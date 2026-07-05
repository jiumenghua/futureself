// ============================================================
// today.ts — Today 页面路由 🔗 [调用DeepSeek API]
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { User, GrowthData } from '../models'
import { generateDailyAdvice } from '../services(DeepSeek API)/deepseek(DeepSeek API)'
import { decrypt } from '../services(DeepSeek API)/crypto'
import { getConnectionState } from '../db'
import { validateRequest, throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

/**
 * POST /api/today/advice
 * 基于用户画像和今日数据，生成个性化建议
 */
router.post('/advice', validateRequest(['userId']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, date } = req.body
    const today = date || new Date().toISOString().slice(0, 10)

    // 获取用户信息（仅当 DB 在线）
    let userProfile: any = { nickname: '同学', major: '', grade: '', growthScore: 0 }
    let todayCourses: string[] = []
    let growthSummary = '暂无历史数据'

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
        const todayData = await GrowthData.find({ userId, date: today })
        todayCourses = todayData.filter((d) => d.type === 'study').map((d) => d.title)

        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
        const weekData = await GrowthData.find({ userId, createdAt: { $gte: weekAgo } })
        growthSummary = `${weekData.length} 条成长记录`
      } catch { /* DB 查询失败，使用默认值 */ }
    }

    // 调用 DeepSeek
    const rawJson = await generateDailyAdvice(userProfile, todayCourses, growthSummary)

    // 解析 JSON
    let advice: any
    try {
      const cleaned = rawJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      advice = JSON.parse(cleaned)
    } catch {
      advice = {
        study: { title: '今日学习', content: rawJson.slice(0, 200), tip: '保持节奏' },
        food: { title: '饮食建议', content: '', tip: '好好吃饭' },
        emotion: { title: '心情陪伴', content: '', tip: '记得休息' },
        summary: '今天也一起加油吧 👋',
      }
    }

    res.json({
      success: true,
      code: 0,
      message: 'ok',
      data: { ...advice, userProfile, date: today },
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/today/data?userId=xxx&date=2026-07-04
 */
router.get('/data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, date } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: '数据库离线', data: [] })
      return
    }
    const today = (date as string) || new Date().toISOString().slice(0, 10)
    const data = await GrowthData.find({ userId, date: today }).sort({ createdAt: -1 })
    res.json({ success: true, code: 0, message: 'ok', data })
  } catch (err) {
    next(err)
  }
})

export default router
