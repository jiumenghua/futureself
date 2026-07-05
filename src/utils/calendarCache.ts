// ============================================================
// calendarCache.ts — 日历事件本地缓存
// 当 MongoDB 不可达时，localStorage 作为降级持久化层
// 确保添加/编辑/删除操作在离线时也能正常工作
// ============================================================

import type { CalendarEvent } from '@/api/calendar(DeepSeek API)'

const EVENTS_KEY = (userId: string) => `fs_calendar_${userId}`

// ---- 全量读写 ----

export function loadCachedEvents(userId: string): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY(userId))
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export function saveCachedEvents(userId: string, events: CalendarEvent[]): void {
  try {
    localStorage.setItem(EVENTS_KEY(userId), JSON.stringify(events))
  } catch { /* localStorage 满 */ }
}

// ---- 按月过滤 ----

export function loadCachedMonthEvents(userId: string, year: number, month: number): CalendarEvent[] {
  const all = loadCachedEvents(userId)
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return all.filter((e) => e.date?.startsWith?.(prefix))
}

// ---- 增删改 ----

export function addCachedEvent(userId: string, event: CalendarEvent): void {
  const events = loadCachedEvents(userId)
  events.push(event)
  saveCachedEvents(userId, events)
}

export function updateCachedEvent(userId: string, eventId: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
  const events = loadCachedEvents(userId)
  const idx = events.findIndex((e) => e._id === eventId)
  if (idx < 0) return null
  events[idx] = { ...events[idx], ...updates }
  saveCachedEvents(userId, events)
  return events[idx]
}

export function deleteCachedEvent(userId: string, eventId: string): boolean {
  const events = loadCachedEvents(userId)
  const filtered = events.filter((e) => e._id !== eventId)
  if (filtered.length === events.length) return false
  saveCachedEvents(userId, filtered)
  return true
}

// ---- 近期事件（7天） ----

export function loadCachedUpcoming(userId: string): CalendarEvent[] {
  const all = loadCachedEvents(userId)
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const end = new Date(now); end.setDate(end.getDate() + 7)
  return all.filter((e) => {
    const d = new Date(e.date)
    return d >= now && d <= end
  })
}
