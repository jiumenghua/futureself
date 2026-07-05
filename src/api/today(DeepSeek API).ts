// ============================================================
// today.ts — Today 页面 API
// ============================================================

import client from './client'

export interface DailyAdvice {
  study: { title: string; content: string; tip: string }
  food: { title: string; content: string; tip: string }
  emotion: { title: string; content: string; tip: string }
  summary: string
  userProfile?: Record<string, any>
  todayData?: any[]
  date?: string
}

/** 生成每日个性化建议 */
export async function getDailyAdvice(userId: string, date?: string): Promise<DailyAdvice | null> {
  const res = await client.post('/today/advice', { userId, date })
  if (res.success) return res.data as DailyAdvice
  console.warn('[API:today] getDailyAdvice 失败:', res.message)
  return null
}

/** 获取今日数据 */
export async function getTodayData(userId: string, date?: string): Promise<any[]> {
  const res = await client.get('/today/data', { params: { userId, date } })
  if (res.success) return (res.data || []) as any[]
  return []
}
