// ============================================================
// diet.ts — 饮食推荐路由 🔗 [调用DeepSeek API]
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { User, DietRecord, Notification } from '../models'
import { generateDietAdvice } from '../services(DeepSeek API)/deepseek(DeepSeek API)'
import { getWeather } from '../services(DeepSeek API)/weather'
import { decrypt } from '../services(DeepSeek API)/crypto'
import { getConnectionState } from '../db'
import { throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

// ============================================================
// ① 获取当日饮食推荐
// ============================================================
router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    const today = new Date().toISOString().slice(0, 10)

    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: { date: today, meals: {} } })
      return
    }

    const records = await DietRecord.find({ userId, date: today }).sort({ createdAt: -1 })
    const meals: Record<string, any> = {}
    for (const r of records) {
      meals[r.mealType] = {
        foodContent: r.foodContent,
        source: r.source,
        createdAt: r.createdAt,
      }
    }

    res.json({ success: true, code: 0, message: 'ok', data: { date: today, meals } })
  } catch (err) { next(err) }
})

// ============================================================
// ② 获取饮食历史
// ============================================================
router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, days = '7' } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }

    const since = new Date(); since.setDate(since.getDate() - parseInt(days as string, 10))
    const records = await DietRecord.find({
      userId,
      date: { $gte: since.toISOString().slice(0, 10) },
    }).sort({ date: -1, createdAt: -1 })

    res.json({ success: true, code: 0, message: 'ok', data: records })
  } catch (err) { next(err) }
})

// ============================================================
// ③ 手动触发 AI 生成推荐
// ============================================================
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, mealType: forcedMealType } = req.body
    if (!userId) throwError('VALIDATION_ERROR')

    // 确定当前餐次
    const hour = new Date().getHours()
    let mealType: 'breakfast' | 'lunch' | 'dinner' = 'lunch'
    if (forcedMealType && ['breakfast', 'lunch', 'dinner'].includes(forcedMealType)) {
      mealType = forcedMealType
    } else if (hour < 10) {
      mealType = 'breakfast'
    } else if (hour < 15) {
      mealType = 'lunch'
    } else {
      mealType = 'dinner'
    }

    const today = new Date().toISOString().slice(0, 10)

    // 检查是否已有当日该餐次记录
    if (dbOnline()) {
      try {
        const existing = await DietRecord.findOne({ userId, date: today, mealType })
        if (existing) {
          res.json({
            success: true, code: 0, message: '已存在',
            data: { mealType, foodContent: existing.foodContent, cached: true },
          })
          return
        }
      } catch { /* DB 离线，继续生成 */ }
    }

    // 获取用户信息
    let campus = '', preferences: string[] = [], taboos: string[] = [], recentStrs: string[] = []
    let weatherData = null

    if (dbOnline()) {
      try {
        const user = await User.findOne({ userId })
        if (user) {
          campus = user.campus || user.university || ''
          preferences = user.dietPreference || []
          taboos = user.dietTaboo || []
        }

        const threeDaysAgo = new Date(); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        const recent = await DietRecord.find({
          userId,
          date: { $gte: threeDaysAgo.toISOString().slice(0, 10) },
        }).sort({ date: -1 }).limit(10)
        recentStrs = recent.map((r: any) => `[${r.date}] ${r.mealType}: ${r.foodContent}`)

        weatherData = campus ? await getWeather(campus) : null
      } catch { /* 降级 */ }
    }

    // 调用 AI
    const advice = await generateDietAdvice({
      campus, preferences, taboos, recentDietRecords: recentStrs,
      weather: weatherData, mealType,
    })

    // 写入 DB
    const foodContent = advice.recommendations.map(r => `${r.name}（${r.reason}）`).join('；')
    if (dbOnline()) {
      try {
        await DietRecord.create({ userId, date: today, mealType, foodContent, source: 'ai_recommend' })
      } catch { /* 唯一索引冲突 */ }

      try {
        const mealLabels: Record<string, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }
        await Notification.create({
          userId, type: 'diet',
          title: `${mealLabels[mealType]}推荐`,
          content: `${advice.reminder}\n\n${foodContent}\n\n💡 ${advice.tip}`,
          isRead: false, relatedPath: '/today',
        })
      } catch { /* DB 离线 */ }
    }

    res.json({
      success: true, code: 0, message: 'ok',
      data: { mealType, ...advice, foodContent, cached: false },
    })
  } catch (err) { next(err) }
})

// ============================================================
// ④ 获取个性化饮食推荐（Discover 页点击触发，不写 DB）
// ============================================================
router.get('/recommend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')

    // 确定当前餐次
    const hour = new Date().getHours()
    let mealType: 'breakfast' | 'lunch' | 'dinner' = 'lunch'
    if (hour < 10) {
      mealType = 'breakfast'
    } else if (hour < 15) {
      mealType = 'lunch'
    } else {
      mealType = 'dinner'
    }

    // 获取用户饮食画像
    let campus = '', preferences: string[] = [], taboos: string[] = [], recentStrs: string[] = []
    let weatherData = null

    if (dbOnline()) {
      try {
        // 优先从 UserProfile 获取饮食画像
        const { UserProfile } = require('../models/userProfile')
        const profile = await UserProfile.findOne({ userId })
        if (profile) {
          preferences = profile.dietProfile?.tags || []
          const details = profile.dietProfile?.details || []
          preferences = [...preferences, ...details]
          campus = profile.baseInfo?.school || ''
        }

        // 降级：从旧 User 模型获取
        if (preferences.length === 0) {
          const user = await User.findOne({ userId })
          if (user) {
            campus = campus || user.campus || user.university || ''
            preferences = user.dietPreference || []
            taboos = user.dietTaboo || []
          }
        }

        // 近 3 天饮食记录
        const threeDaysAgo = new Date(); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        const recent = await DietRecord.find({
          userId,
          date: { $gte: threeDaysAgo.toISOString().slice(0, 10) },
        }).sort({ date: -1 }).limit(10)
        recentStrs = recent.map((r: any) => `[${r.date}] ${r.mealType}: ${r.foodContent}`)

        // 天气
        weatherData = campus ? await getWeather(campus) : null
      } catch { /* 降级 */ }
    }

    // 调用 AI
    const advice = await generateDietAdvice({
      campus, preferences, taboos, recentDietRecords: recentStrs,
      weather: weatherData, mealType,
    })

    res.json({
      success: true, code: 0, message: 'ok',
      data: { mealType, ...advice },
    })
  } catch (err) { next(err) }
})

export default router
