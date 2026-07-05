// ============================================================
// journey.ts — Journey 成长页面 API
// ============================================================

import client from './client'

export interface GrowthEvaluation {
  summary: string
  highlights: string[]
  suggestions: string[]
  encouragement: string
  period: string
  recordCount: number
  records: any[]
}

export interface GrowthRecord {
  _id: string
  userId: string
  date: string
  type: 'study' | 'food' | 'emotion' | 'exercise'
  title: string
  description: string
  duration?: number
  mood?: string
  tags: string[]
}

/** 生成成长评价 */
export async function getGrowthEval(userId: string, period: 'week' | 'month' = 'week'): Promise<GrowthEvaluation | null> {
  const res = await client.post('/journey/eval', { userId, period })
  if (res.success) return res.data as GrowthEvaluation
  console.warn('[API:journey] getGrowthEval 失败:', res.message)
  return null
}

/** 获取成长记录 */
export async function getRecords(userId: string, type?: string, limit = 30): Promise<GrowthRecord[]> {
  const res = await client.get('/journey/records', { params: { userId, type, limit } })
  if (res.success) return (res.data || []) as GrowthRecord[]
  return []
}

/** 添加成长记录 */
export async function addRecord(params: {
  userId: string
  type: string
  title: string
  description?: string
  duration?: number
  mood?: string
  tags?: string[]
  date?: string
}): Promise<GrowthRecord | null> {
  const res = await client.post('/journey/record', params)
  if (res.success) return res.data as GrowthRecord
  console.warn('[API:journey] addRecord 失败:', res.message)
  return null
}
