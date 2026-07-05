// ============================================================
// user.ts — 用户 API
// ============================================================

import client from './client'

export interface UserProfile {
  userId: string
  nickname: string
  avatar: string
  university: string
  major: string
  grade: string
  growthScore: number
  createdAt: string
}

export interface AiMemoryItem {
  id: string
  tag: string
  weight: number
  category: string
  updatedAt: string
}

/** 获取用户信息 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const res = await client.get('/user/profile', { params: { userId } })
  if (res.success) return res.data as UserProfile
  console.warn('[API:user] getUserProfile 失败:', res.message)
  return null
}

/** 创建或更新用户 */
export async function upsertUser(params: {
  userId?: string
  nickname: string
  avatar?: string
  university?: string
  major?: string
  grade?: string
}): Promise<UserProfile | null> {
  const res = await client.post('/user/profile', params)
  if (res.success) return res.data as UserProfile
  console.warn('[API:user] upsertUser 失败:', res.message)
  return null
}

/** 获取 AI 记忆 */
export async function getMemories(userId: string): Promise<AiMemoryItem[]> {
  const res = await client.get('/user/memories', { params: { userId } })
  if (res.success) return (res.data || []) as AiMemoryItem[]
  return []
}

/** 添加 AI 记忆 */
export async function addMemory(params: {
  userId: string
  tag: string
  weight?: number
  category?: string
}): Promise<any> {
  const res = await client.post('/user/memory', params)
  if (res.success) return res.data
  return null
}
