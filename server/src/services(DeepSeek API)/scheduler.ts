// ============================================================
// scheduler.ts — 定时任务调度引擎
// node-cron 每 5 分钟扫描，检查饭点 → 生成 AI 推荐 → 写入通知
// ============================================================

import cron from 'node-cron'
import { User, DietRecord, Notification } from '../models'
import { getConnectionState } from '../db'
import { generateDietAdvice } from './deepseek(DeepSeek API)'
import { getWeather } from './weather'

const dbOnline = () => getConnectionState()

// 追踪当日已推送的餐次（内存 + DB 双重防重复）
const pushedToday = new Set<string>()  // key: userId_date_mealType

/**
 * 启动所有定时任务
 */
export function startScheduler(): void {
  console.log('[Scheduler] 定时任务引擎已启动（每 5 分钟扫描饭点）')

  // 清理昨日标记
  const today = new Date().toISOString().slice(0, 10)
  cron.schedule('0 0 * * *', () => {
    pushedToday.clear()
    console.log('[Scheduler] 新的一天，已清理推送标记')
  })

  // 每 5 分钟检查饭点
  cron.schedule('*/5 * * * *', async () => {
    try {
      await checkMealTimes()
    } catch (err) {
      console.error('[Scheduler] 饭点检查异常:', (err as Error).message)
    }
  })

  // 启动时立即检查一次
  setTimeout(() => checkMealTimes().catch(() => {}), 3000)
}

/**
 * 检查所有用户的饭点
 */
async function checkMealTimes(): Promise<void> {
  if (!dbOnline()) return

  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // 查找所有开启了提醒的用户
  const users = await User.find({ mealRemindEnabled: true }).limit(200)
  if (users.length === 0) return

  const mealTypes: Array<'breakfast' | 'lunch' | 'dinner'> = ['breakfast', 'lunch', 'dinner']

  for (const user of users) {
    const mealTime = (user as any).customMealTime || { breakfast: '07:30', lunch: '12:00', dinner: '18:00' }

    for (const mealType of mealTypes) {
      const targetTime = mealTime[mealType]
      if (!targetTime) continue

      // 检查是否在当前时间 ±5 分钟内
      if (!isWithinWindow(currentHM, targetTime, 5)) continue

      // 防重复：当日该用户该餐次是否已推送
      const pushKey = `${user.userId}_${today}_${mealType}`
      if (pushedToday.has(pushKey)) continue

      // DB 检查是否已有记录（DB 离线时跳过）
      try {
        const existing = await DietRecord.findOne({ userId: user.userId, date: today, mealType })
        if (existing) {
          pushedToday.add(pushKey)
          continue
        }
      } catch { continue }

      // 执行推送
      await pushMealReminder(user, mealType, today, pushKey)
    }
  }
}

/**
 * 为单个用户推送饭点提醒
 */
async function pushMealReminder(
  user: any,
  mealType: 'breakfast' | 'lunch' | 'dinner',
  today: string,
  pushKey: string
): Promise<void> {
  try {
    // 1. 获取天气
    const campus = user.campus || user.university || ''
    const weatherData = campus ? await getWeather(campus) : null

    // 2. 获取近 3 天饮食记录
    const threeDaysAgo = new Date(); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const recentRecords = await DietRecord.find({
      userId: user.userId,
      date: { $gte: threeDaysAgo.toISOString().slice(0, 10) },
    }).sort({ date: -1, createdAt: -1 }).limit(10)
    const recentStrs = recentRecords.map((r: any) => `[${r.date}] ${r.mealType}: ${r.foodContent}`)

    // 3. 调用 AI 生成推荐
    const advice = await generateDietAdvice({
      campus,
      preferences: user.dietPreference || [],
      taboos: user.dietTaboo || [],
      recentDietRecords: recentStrs,
      weather: weatherData,
      mealType,
    })

    // 4. 写入 DietRecord
    const foodContent = advice.recommendations.map(r => `${r.name}（${r.reason}）`).join('；')
    try {
      await DietRecord.create({
        userId: user.userId, date: today, mealType,
        foodContent, source: 'ai_recommend',
      })
    } catch { /* 唯一索引冲突 → 已存在，跳过 */ }

    // 5. 写入 Notification
    const mealLabels: Record<string, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }
    try {
      await Notification.create({
        userId: user.userId,
        type: 'diet',
        title: `${mealLabels[mealType]}提醒`,
        content: `${advice.reminder}\n\n${foodContent}\n\n💡 ${advice.tip}`,
        isRead: false,
        relatedPath: '/today',
      })
    } catch { /* DB 离线 */ }

    // 6. 标记已推送
    pushedToday.add(pushKey)
    console.log(`[Scheduler] ✅ 已推送 ${user.userId} ${mealType} 提醒`)
  } catch (err) {
    console.error(`[Scheduler] 推送失败 (${user.userId} ${mealType}):`, (err as Error).message)
  }
}

/**
 * 判断当前时间是否在目标时间 ±windowMinutes 内
 */
function isWithinWindow(current: string, target: string, windowMinutes: number): boolean {
  const [ch, cm] = current.split(':').map(Number)
  const [th, tm] = target.split(':').map(Number)
  const currentTotal = ch * 60 + cm
  const targetTotal = th * 60 + tm
  return Math.abs(currentTotal - targetTotal) <= windowMinutes
}
