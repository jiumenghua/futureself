// ============================================================
// notifications.ts — 通知中心 API
// 支持 MongoDB 不可用时的 localStorage 降级
// ============================================================

import client from './client'
import {
  loadCachedNotifications,
  saveCachedNotifications,
  markCachedAllRead,
  markCachedRead,
} from '@/utils/notificationCache'

export interface NotificationItem {
  _id: string
  userId: string
  type: 'study' | 'diet' | 'schedule' | 'growth' | 'emotion_comfort' | 'sedentary_remind' | 'diet_remind' | 'daily'
  title: string
  content: string
  isRead: boolean
  relatedPath: string
  createdAt: string
}

/** 获取通知列表（API 优先，空则降级 localStorage） */
export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  try {
    const res = await client.get('/notifications/list', { params: { userId } })
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      saveCachedNotifications(userId, res.data)
      return res.data as NotificationItem[]
    }
  } catch { /* 降级 */ }
  return loadCachedNotifications(userId)
}

/** 获取未读通知（用于轮询弹窗） */
export async function getUnreadNotifications(userId: string): Promise<NotificationItem[]> {
  try {
    const res = await client.get('/notify/unread', { params: { userId } })
    if (res.success && Array.isArray(res.data)) {
      return res.data as NotificationItem[]
    }
  } catch { /* 静默失败 */ }
  return []
}

/** 批量标记已读 */
export async function batchMarkRead(userId: string, ids: string[]): Promise<boolean> {
  try {
    const res = await client.post('/notify/read', { userId, ids })
    if (res.success) return true
  } catch { /* 降级 */ }
  return false
}

/** 全部标记已读（API 优先，失败降级 localStorage） */
export async function markAllRead(userId: string): Promise<boolean> {
  try {
    const res = await client.put('/notifications/read-all', { userId })
    if (res.success) return true
  } catch { /* 降级 */ }
  markCachedAllRead(userId)
  return true
}

/** 删除单条通知 */
export async function deleteNotification(userId: string, id: string): Promise<boolean> {
  try {
    const res = await client.delete(`/notify/${id}`, { data: { userId } })
    if (res.success) return true
  } catch { /* 静默失败 */ }
  return false
}

/** 单条标记已读（API 优先，失败降级 localStorage） */
export async function markRead(userId: string, notificationId: string): Promise<boolean> {
  try {
    const res = await client.put(`/notifications/${notificationId}/read`, { userId })
    if (res.success) return true
  } catch { /* 降级 */ }
  markCachedRead(userId, notificationId)
  return true
}
