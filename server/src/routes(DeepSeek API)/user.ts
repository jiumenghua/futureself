// ============================================================
// user.ts — 用户相关路由
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'
import { User, AiMemory } from '../models'
import { encrypt, decrypt } from '../services(DeepSeek API)/crypto'
import { getConnectionState } from '../db'
import { validateRequest, throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: null })
      return
    }
    const user = await User.findOne({ userId })
    if (!user) throwError('NOT_FOUND')
    res.json({
      success: true, code: 0, message: 'ok',
      data: {
        userId: user.userId, nickname: decrypt(user.nickname), avatar: user.avatar,
        university: user.university, major: decrypt(user.major), grade: decrypt(user.grade),
        growthScore: user.growthScore, createdAt: user.createdAt,
        campus: user.campus || '',
        dietPreference: user.dietPreference || [],
        dietTaboo: user.dietTaboo || [],
        mealRemindEnabled: user.mealRemindEnabled ?? true,
        customMealTime: user.customMealTime || { breakfast: '07:30', lunch: '12:00', dinner: '18:00' },
        goals: user.goals || [],
        studyProfile: user.studyProfile || [],
        foodProfile: user.foodProfile || [],
        personalityProfile: user.personalityProfile || [],
        recentDiscoveries: user.recentDiscoveries || [],
        lastProfileUpdate: user.lastProfileUpdate || null,
      },
    })
  } catch (err) { next(err) }
})

router.post('/profile', validateRequest(['nickname']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线，暂不可用', data: null })
      return
    }
    const { userId: inputId, nickname, avatar, university, major, grade,
      campus, dietPreference, dietTaboo, mealRemindEnabled, customMealTime } = req.body
    const userId = inputId || uuid()

    const updateData: any = {
      userId, nickname: encrypt(nickname), avatar: avatar || '',
      university: university || '', major: encrypt(major || ''), grade: encrypt(grade || ''),
    }
    // 饮食字段（可选，明文）
    if (campus !== undefined) updateData.campus = campus
    if (dietPreference !== undefined) updateData.dietPreference = dietPreference
    if (dietTaboo !== undefined) updateData.dietTaboo = dietTaboo
    if (mealRemindEnabled !== undefined) updateData.mealRemindEnabled = mealRemindEnabled
    if (customMealTime !== undefined) updateData.customMealTime = customMealTime

    const user = await User.findOneAndUpdate(
      { userId },
      updateData,
      { upsert: true, new: true }
    )
    res.json({
      success: true, code: 0, message: 'ok',
      data: {
        userId: user.userId, nickname, avatar: user.avatar,
        university: user.university, major: major || '', grade: grade || '',
        growthScore: user.growthScore, createdAt: user.createdAt,
        campus: user.campus || '',
        dietPreference: user.dietPreference || [],
        dietTaboo: user.dietTaboo || [],
        mealRemindEnabled: user.mealRemindEnabled ?? true,
        customMealTime: user.customMealTime || { breakfast: '07:30', lunch: '12:00', dinner: '18:00' },
        goals: user.goals || [],
        studyProfile: user.studyProfile || [],
        foodProfile: user.foodProfile || [],
        personalityProfile: user.personalityProfile || [],
        recentDiscoveries: user.recentDiscoveries || [],
        lastProfileUpdate: user.lastProfileUpdate || null,
      },
    })
  } catch (err) { next(err) }
})

router.get('/memories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }
    const memories = await AiMemory.find({ userId }).sort({ weight: -1 })
    res.json({
      success: true, code: 0, message: 'ok',
      data: memories.map((m) => ({ id: m._id, tag: decrypt(m.tag), weight: m.weight, category: m.category, updatedAt: m.updatedAt })),
    })
  } catch (err) { next(err) }
})

router.post('/memory', validateRequest(['userId', 'tag']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线，暂不可用', data: null })
      return
    }
    const { userId, tag, weight = 0.5, category = 'preference' } = req.body
    const encryptedTag = encrypt(tag)
    const existing = await AiMemory.findOne({ userId, category })
    if (existing) {
      existing.tag = encryptedTag; existing.weight = Math.min(1, weight); existing.updatedAt = new Date()
      await existing.save()
    } else {
      await AiMemory.create({ userId, tag: encryptedTag, weight, category })
    }
    res.json({ success: true, code: 0, message: 'ok', data: { tag, weight, category } })
  } catch (err) { next(err) }
})

export default router
