// ============================================================
// journey.ts — Journey 成长页面路由 🔗 [调用DeepSeek API]
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { User, GrowthData } from '../models'
import { generateGrowthEvaluation } from '../services(DeepSeek API)/deepseek(DeepSeek API)'
import { decrypt } from '../services(DeepSeek API)/crypto'
import { getConnectionState } from '../db'
import { validateRequest, throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

router.post('/eval', validateRequest(['userId']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, period = 'week' } = req.body

    let userProfile: any = { nickname: '同学', major: '', grade: '', growthScore: 0 }
    let growthData: Array<{ type: string; title: string; date: string }> = []

    if (dbOnline()) {
      try {
        const user = await User.findOne({ userId })
        if (user) {
          userProfile = {
            nickname: decrypt(user.nickname),
            major: decrypt(user.major),
            grade: decrypt(user.grade),
            growthScore: user.growthScore,
          }
        }
        const now = new Date(); const since = new Date()
        if (period === 'month') since.setMonth(since.getMonth() - 1)
        else since.setDate(since.getDate() - 7)

        const records = await GrowthData.find({ userId, createdAt: { $gte: since } }).sort({ date: -1 })
        growthData = records.map((r) => ({ type: r.type, title: r.title, date: r.date }))
      } catch { /* DB 降级 */ }
    }

    const periodLabel = period === 'month' ? '本月' : '本周'
    const rawJson = await generateGrowthEvaluation(userProfile, periodLabel, growthData)

    let evaluation: any
    try {
      const cleaned = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      evaluation = JSON.parse(cleaned)
    } catch {
      evaluation = {
        summary: rawJson.slice(0, 200),
        highlights: ['坚持记录成长数据'],
        suggestions: ['尝试更多样的学习方式'],
        encouragement: '每一天的努力都在积累，慢慢来。',
      }
    }

    res.json({
      success: true, code: 0, message: 'ok',
      data: { ...evaluation, period: periodLabel, recordCount: growthData.length },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/records', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, type, limit = '30' } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }
    const filter: any = { userId }
    if (type) filter.type = type
    const records = await GrowthData.find(filter).sort({ date: -1, createdAt: -1 }).limit(parseInt(limit as string, 10))
    res.json({ success: true, code: 0, message: 'ok', data: records })
  } catch (err) {
    next(err)
  }
})

router.post('/record', validateRequest(['userId', 'type', 'title']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线，暂不可用', data: null })
      return
    }
    const { userId, type, title, description, duration, mood, tags, date } = req.body
    const record = await GrowthData.create({
      userId, date: date || new Date().toISOString().slice(0, 10), type, title,
      description: description || '', duration, mood, tags: tags || [],
    })
    await User.updateOne({ userId }, { $inc: { growthScore: 1 } })
    res.json({ success: true, code: 0, message: 'ok', data: record })
  } catch (err) {
    next(err)
  }
})

export default router
