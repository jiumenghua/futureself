// ============================================================
// calendar.ts — 成长日历 API
// 支持 MongoDB 不可用时的 localStorage 降级
// ============================================================

import client from './client'
import {
  loadCachedMonthEvents,
  addCachedEvent,
  updateCachedEvent,
  deleteCachedEvent,
  loadCachedUpcoming,
} from '@/utils/calendarCache'

export interface CalendarEvent {
  _id: string
  userId: string
  title: string
  type: 'competition' | 'exam' | 'study' | 'custom'
  category: string
  date: string
  description: string
  source: 'ai_auto' | 'user_add'
  remindEnabled: boolean
  remindDays: number
  officialUrl: string
  createdAt: string
  updatedAt: string
}

/** 按月份查询（API 优先，空则降级 localStorage） */
export async function getMonthEvents(userId: string, year: number, month: number): Promise<CalendarEvent[]> {
  try {
    const res = await client.get('/calendar/list', { params: { userId, year, month } })
    if (res.success && Array.isArray(res.data) && res.data.length > 0) return res.data as CalendarEvent[]
  } catch { /* 降级 */ }
  // API 返回空或失败 → 降级 localStorage
  return loadCachedMonthEvents(userId, year, month)
}

/** 新增事件（API 优先，失败降级 localStorage） */
export async function addEvent(data: {
  userId: string; title: string; date: string; type?: string; category?: string; description?: string
  remindEnabled?: boolean; remindDays?: number; officialUrl?: string
}): Promise<CalendarEvent | null> {
  try {
    const res = await client.post('/calendar/event', data)
    if (res.success && res.data) return res.data as CalendarEvent
  } catch { /* 降级 */ }

  // 降级：localStorage
  const now = new Date().toISOString()
  const event: CalendarEvent = {
    _id: crypto.randomUUID(),
    userId: data.userId,
    title: data.title,
    type: (data.type as any) || 'custom',
    category: data.category || '',
    date: data.date,
    description: data.description || '',
    source: 'user_add',
    remindEnabled: data.remindEnabled ?? true,
    remindDays: data.remindDays ?? 3,
    officialUrl: data.officialUrl || '',
    createdAt: now,
    updatedAt: now,
  }
  addCachedEvent(data.userId, event)
  return event
}

/** 编辑事件（API 优先，失败降级 localStorage） */
export async function updateEvent(eventId: string, userId: string, data: Record<string, any>): Promise<CalendarEvent | null> {
  try {
    const res = await client.put(`/calendar/event/${eventId}`, { userId, ...data })
    if (res.success && res.data) return res.data as CalendarEvent
  } catch { /* 降级 */ }

  // 降级：localStorage
  return updateCachedEvent(userId, eventId, { ...data, updatedAt: new Date().toISOString() })
}

/** 删除事件（API 优先，失败降级 localStorage） */
export async function deleteEvent(eventId: string, userId: string): Promise<boolean> {
  try {
    const res = await client.delete(`/calendar/event/${eventId}`, { data: { userId } })
    if (res.success) return true
  } catch { /* 降级 */ }

  // 降级：localStorage
  return deleteCachedEvent(userId, eventId)
}

/** AI 同步赛事 */
export async function syncAiCalendar(userId: string, profile: {
  school: string; major: string; grade: string; categories: string[]
}): Promise<number> {
  try {
    const res = await client.post('/calendar/sync-ai', { userId, ...profile })
    if (res.success) return res.data?.count || 0
  } catch { /* 降级 */ }
  return 0
}

/** 近期事件（7天，API 优先，空则降级 localStorage） */
export async function getUpcoming(userId: string): Promise<CalendarEvent[]> {
  try {
    const res = await client.get('/calendar/upcoming', { params: { userId } })
    if (res.success && Array.isArray(res.data) && res.data.length > 0) return res.data as CalendarEvent[]
  } catch { /* 降级 */ }
  return loadCachedUpcoming(userId)
}
