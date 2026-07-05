// ============================================================
// diet.ts — 饮食推荐 API
// ============================================================

import client from './client'
import { loadCachedDiet, setCachedMeal, type CachedDietMeal } from '@/utils/dietCache'

const DEFAULT_USER_ID = 'user_demo_001'

export interface DietMealData {
  foodContent: string
  source: string
  createdAt: string
}

export interface TodayDietResponse {
  date: string
  meals: Record<string, DietMealData>
}

export interface DietGenerateResponse {
  mealType: string
  reminder: string
  recommendations: Array<{ name: string; reason: string }>
  tip: string
  foodContent: string
  cached: boolean
}

/** 获取当日饮食推荐（API 优先，降级 localStorage） */
export async function getTodayDiet(userId: string = DEFAULT_USER_ID): Promise<TodayDietResponse> {
  try {
    const res = await client.get('/diet/today', { params: { userId } })
    if (res.success && res.data) return res.data as TodayDietResponse
  } catch { /* 降级 */ }
  // 降级：localStorage
  const cached = loadCachedDiet(userId)
  const today = new Date().toISOString().slice(0, 10)
  const meals: Record<string, DietMealData> = {}
  Object.entries(cached).forEach(([key, val]) => {
    if (key.startsWith(today) && val.mealType) {
      meals[val.mealType] = { foodContent: val.foodContent, source: 'ai_recommend', createdAt: val.createdAt }
    }
  })
  return { date: today, meals }
}

/** 手动触发 AI 生成推荐 */
export async function generateDiet(userId: string = DEFAULT_USER_ID, mealType?: string): Promise<DietGenerateResponse | null> {
  try {
    const res = await client.post('/diet/generate', { userId, mealType })
    if (res.success && res.data) {
      const data = res.data as DietGenerateResponse
      // 写入缓存
      setCachedMeal(userId, new Date().toISOString().slice(0, 10), {
        mealType: data.mealType, foodContent: data.foodContent,
        reminder: data.reminder, tip: data.tip,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      })
      return data
    }
  } catch { /* 降级 */ }
  return null
}

/** 饮食推荐结果（Discover 页弹窗用） */
export interface DietRecommendResult {
  mealType: string
  reminder: string
  recommendations: Array<{ name: string; reason: string }>
  tip: string
}

/** 获取个性化饮食推荐（不写 DB，Discover 页弹窗触发） */
export async function recommendDiet(userId: string = DEFAULT_USER_ID): Promise<DietRecommendResult | null> {
  try {
    const res = await client.get('/diet/recommend', { params: { userId } })
    if (res.success && res.data) return res.data as DietRecommendResult
  } catch { /* 降级 */ }
  return null
}

/** 获取饮食历史 */
export async function getDietHistory(userId: string = DEFAULT_USER_ID, days: number = 7): Promise<any[]> {
  try {
    const res = await client.get('/diet/history', { params: { userId, days } })
    if (res.success && Array.isArray(res.data)) return res.data
  } catch { /* 降级 */ }
  return []
}
