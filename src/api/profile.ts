// ============================================================
// profile.ts — 成长档案 API
// GET  /api/profile        — 获取用户成长档案
// PATCH /api/profile       — 增量更新成长档案
// ============================================================

import client from './client'

export interface GrowthProfile {
  school: string
  major: string
  grade: string
  goals: string[]
  studyProfile: string[]
  foodProfile: string[]
  personalityProfile: string[]
  recentDiscoveries: string[]
  lastProfileUpdate: string | null  // ISO date string or null
  growthScore: number
}

/** 获取用户成长档案 */
export async function getProfile(userId: string): Promise<GrowthProfile | null> {
  const res = await client.get('/profile', { params: { userId } })
  if (res.success && res.data) return res.data as GrowthProfile
  return null
}

/** 增量更新成长档案字段 */
export async function updateProfile(
  userId: string,
  data: Partial<Pick<GrowthProfile, 'goals' | 'studyProfile' | 'foodProfile' | 'personalityProfile' | 'recentDiscoveries'>>
): Promise<GrowthProfile | null> {
  const res = await client.patch('/profile', { userId, ...data })
  if (res.success && res.data) return res.data as GrowthProfile
  return null
}
