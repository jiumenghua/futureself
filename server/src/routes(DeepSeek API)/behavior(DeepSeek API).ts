// ============================================================
// behavior.ts — 用户行为上报路由 🔗 [调用DeepSeek API]
// POST /api/behavior/report — 上报行为，触发决策引擎
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { Notification } from '../models/Notification'
import { UserProfile } from '../models/userProfile'
import { getConnectionState } from '../db'
import { throwError } from '../middleware/errorHandler'
import { generateSedentaryRemind } from '../services(DeepSeek API)/deepseek(DeepSeek API)'

const router = Router()
const dbOnline = () => getConnectionState()

// ---- 行为类型枚举 ----
type BehaviorType = 'sedentary_45min'

// ---- 决策引擎配置 ----
const DECISION_CONFIG = {
  sedentary_45min: {
    /** 每日最大推送次数 */
    dailyCap: 3,
    /** 冷却时间（分钟） */
    cooldownMinutes: 90,
    /** 免打扰时段 [开始小时, 结束小时] */
    muteHours: { start: 22, end: 7 },
  },
} as const

// ============================================================
// POST /api/behavior/report
// ============================================================
router.post('/report', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, behaviorType, context } = req.body

    // 参数校验
    if (!userId || !behaviorType) throwError('VALIDATION_ERROR')

    // 仅处理支持的行为类型
    if (behaviorType !== 'sedentary_45min') {
      res.json({ success: true, code: 0, message: 'ok', data: { notified: false, reason: 'unsupported_behavior' } })
      return
    }

    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: { notified: false, reason: 'db_offline' } })
      return
    }

    const cfg = DECISION_CONFIG['sedentary_45min']

    // ---- 决策引擎：免打扰时段检查 ----
    const now = new Date()
    const currentHour = now.getHours()
    const { start: muteStart, end: muteEnd } = cfg.muteHours
    // 免打扰时段跨天（22:00 ~ 次日 07:00）
    const inMuteHours = muteStart < muteEnd
      ? (currentHour >= muteStart && currentHour < muteEnd)
      : (currentHour >= muteStart || currentHour < muteEnd)

    if (inMuteHours) {
      res.json({
        success: true,
        code: 0,
        message: 'ok',
        data: { notified: false, reason: 'mute_hours' },
      })
      return
    }

    // ---- 决策引擎：每日上限检查 ----
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    const todayCount = await Notification.countDocuments({
      userId: userId as string,
      type: 'sedentary_remind',
      createdAt: { $gte: todayStart, $lt: tomorrowStart },
    })

    if (todayCount >= cfg.dailyCap) {
      res.json({
        success: true,
        code: 0,
        message: 'ok',
        data: { notified: false, reason: 'daily_cap_reached', todayCount },
      })
      return
    }

    // ---- 决策引擎：冷却时间检查 ----
    const cooldownThreshold = new Date(now.getTime() - cfg.cooldownMinutes * 60 * 1000)

    const lastNotification = await Notification.findOne({
      userId: userId as string,
      type: 'sedentary_remind',
      createdAt: { $gte: cooldownThreshold },
    }).sort({ createdAt: -1 })

    if (lastNotification) {
      const minutesSinceLast = Math.floor((now.getTime() - lastNotification.createdAt.getTime()) / 60000)
      res.json({
        success: true,
        code: 0,
        message: 'ok',
        data: { notified: false, reason: 'cooldown', minutesSinceLast },
      })
      return
    }

    // ---- 通过决策：获取用户画像 ----
    let learningTags: string[] = []
    let learningDetails: string[] = []
    let dietTags: string[] = []
    let dietDetails: string[] = []

    try {
      const profile = await UserProfile.findOne({ userId: userId as string })
      if (profile) {
        learningTags = profile.learningProfile?.tags || []
        learningDetails = profile.learningProfile?.details || []
        dietTags = profile.dietProfile?.tags || []
        dietDetails = profile.dietProfile?.details || []
      }
    } catch {
      // 画像获取失败不阻塞，使用空数组
    }

    // ---- 调用 DeepSeek 生成个性化话术 ----
    const message = await generateSedentaryRemind(
      { tags: learningTags, details: learningDetails },
      { tags: dietTags, details: dietDetails }
    )

    // ---- 写入通知 ----
    await Notification.create({
      userId: userId as string,
      type: 'sedentary_remind',
      title: '久坐提醒',
      content: message,
      isRead: false,
      relatedPath: '',
      createdAt: now,
    })

    res.json({
      success: true,
      code: 0,
      message: 'ok',
      data: { notified: true, content: message, todayCount: todayCount + 1 },
    })
  } catch (err) {
    next(err)
  }
})

export default router
