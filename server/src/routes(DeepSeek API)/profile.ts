// ============================================================
// profile.ts — AI 成长档案路由
// GET  /api/profile       — 获取用户成长档案（从 userProfile 模型）
// PATCH /api/profile      — 增量更新画像字段（手动修改标记 source=manual）
// PUT  /api/profile       — 手动覆盖 baseInfo 字段
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { User, UserProfile } from '../models'
import { getConnectionState } from '../db'
import { validateRequest, throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

// ---- 获取成长档案 ----
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: null })
      return
    }

    const profile = await UserProfile.findOne({ userId: userId as string })
    if (!profile) {
      res.json({ success: true, code: 0, message: 'ok', data: null })
      return
    }

    // 兼容前端现有 GrowthProfile 格式
    res.json({
      success: true, code: 0, message: 'ok',
      data: {
        school: profile.baseInfo?.school || '',
        major: profile.baseInfo?.major || '',
        grade: profile.baseInfo?.grade || '',
        confidence: profile.baseInfo?.confidence || 0,
        goals: profile.goals?.map((g) => g.content) || [],
        studyProfile: profile.learningProfile?.details || [],
        foodProfile: profile.dietProfile?.details || [],
        personalityProfile: profile.personalityProfile?.details || [],
        recentDiscoveries: profile.recentDiscoveries?.map((d) => d.content) || [],
        lastProfileUpdate: profile.updatedAt || null,
        growthScore: 0,  // 暂从 User 模型读取
        totalChatDays: profile.totalChatDays || 1,
      },
    })
  } catch (err) { next(err) }
})

// ---- 增量更新画像字段（手动修改） ----
router.patch('/', validateRequest(['userId']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线，暂不可用', data: null })
      return
    }
    const { userId, goals, studyProfile, foodProfile, personalityProfile, recentDiscoveries } = req.body

    // 查询或创建画像文档
    let profile = await UserProfile.findOne({ userId })
    if (!profile) {
      const today = new Date().toISOString().slice(0, 10)
      profile = await UserProfile.create({ userId, lastChatDate: today })
    }

    const now = new Date()

    // goals：手动修改标记 source=manual, confidence=1
    if (Array.isArray(goals) && goals.length > 0) {
      const existing = new Set(profile.goals.map((g) => g.content))
      const newGoals = goals
        .filter((g: string) => !existing.has(g))
        .map((g: string) => ({ content: g, createdAt: now, source: 'manual' as const }))
      if (newGoals.length > 0) {
        profile.goals.push(...newGoals)
        profile.baseInfo.confidence = 1
      }
    }

    // 各维度 details
    const patchDetails = (dim: 'learningProfile' | 'dietProfile' | 'personalityProfile', items?: string[]) => {
      if (!Array.isArray(items) || items.length === 0) return
      const existingSet = new Set(profile![dim].details)
      const additions = items.filter((item) => !existingSet.has(item))
      if (additions.length > 0) {
        profile![dim].details.push(...additions)
        profile![dim].updatedAt = now
      }
    }
    patchDetails('learningProfile', studyProfile)
    patchDetails('dietProfile', foodProfile)
    patchDetails('personalityProfile', personalityProfile)

    // recentDiscoveries
    if (Array.isArray(recentDiscoveries) && recentDiscoveries.length > 0) {
      const existingContents = new Set(profile.recentDiscoveries.map((d) => d.content))
      const newItems = recentDiscoveries
        .filter((d: string) => !existingContents.has(d))
        .map((d: string) => ({ content: d, discoveredAt: now, isNew: true }))
      if (newItems.length > 0) {
        profile.recentDiscoveries.unshift(...newItems)
        if (profile.recentDiscoveries.length > 5) {
          profile.recentDiscoveries = profile.recentDiscoveries.slice(0, 5)
        }
        profile.recentDiscoveries.forEach((d, i) => { d.isNew = i < 3 })
      }
    }

    profile.updatedAt = now
    await profile.save()

    // 同步 User 模型
    const flatUpdate: any = { lastProfileUpdate: now }
    if (Array.isArray(goals) && goals.length > 0) {
      flatUpdate.$addToSet = { goals: { $each: goals } }
    }
    if (Array.isArray(studyProfile) && studyProfile.length > 0) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, studyProfile: { $each: studyProfile } }
    }
    if (Array.isArray(foodProfile) && foodProfile.length > 0) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, foodProfile: { $each: foodProfile } }
    }
    if (Array.isArray(personalityProfile) && personalityProfile.length > 0) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, personalityProfile: { $each: personalityProfile } }
    }
    await User.updateOne({ userId }, flatUpdate).catch(() => {})

    res.json({
      success: true, code: 0, message: 'ok',
      data: {
        school: profile.baseInfo?.school || '',
        major: profile.baseInfo?.major || '',
        grade: profile.baseInfo?.grade || '',
        confidence: profile.baseInfo?.confidence || 0,
        goals: profile.goals?.map((g) => g.content) || [],
        studyProfile: profile.learningProfile?.details || [],
        foodProfile: profile.dietProfile?.details || [],
        personalityProfile: profile.personalityProfile?.details || [],
        recentDiscoveries: profile.recentDiscoveries?.map((d) => d.content) || [],
        lastProfileUpdate: profile.updatedAt || null,
        growthScore: 0,
        totalChatDays: profile.totalChatDays || 1,
      },
    })
  } catch (err) { next(err) }
})

// ---- 手动覆盖 baseInfo ----
router.put('/', validateRequest(['userId']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线，暂不可用', data: null })
      return
    }
    const { userId, school, major, grade } = req.body

    let profile = await UserProfile.findOne({ userId })
    if (!profile) {
      const today = new Date().toISOString().slice(0, 10)
      profile = await UserProfile.create({ userId, lastChatDate: today })
    }

    // 手动覆盖 baseInfo，confidence 设为 1
    if (school !== undefined) profile.baseInfo.school = school
    if (major !== undefined) profile.baseInfo.major = major
    if (grade !== undefined) profile.baseInfo.grade = grade
    profile.baseInfo.confidence = 1
    profile.updatedAt = new Date()
    await profile.save()

    res.json({
      success: true, code: 0, message: 'ok',
      data: {
        school: profile.baseInfo.school,
        major: profile.baseInfo.major,
        grade: profile.baseInfo.grade,
        confidence: profile.baseInfo.confidence,
      },
    })
  } catch (err) { next(err) }
})

export default router
