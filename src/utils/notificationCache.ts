// ============================================================
// notificationCache.ts — 通知本地缓存
// 当 MongoDB 不可达时，localStorage 作为降级持久化层
// ============================================================

import type { NotificationItem } from '@/api/notifications'

const NOTIF_KEY = (userId: string) => `fs_notifications_${userId}`

export function loadCachedNotifications(userId: string): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY(userId))
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export function saveCachedNotifications(userId: string, notifications: NotificationItem[]): void {
  try {
    localStorage.setItem(NOTIF_KEY(userId), JSON.stringify(notifications.slice(0, 200)))
  } catch { /* localStorage 满 */ }
}

export function addCachedNotification(userId: string, notification: NotificationItem): void {
  const all = loadCachedNotifications(userId)
  all.unshift(notification)
  saveCachedNotifications(userId, all)
}

export function markCachedAllRead(userId: string): void {
  const all = loadCachedNotifications(userId)
  all.forEach((n) => { n.isRead = true })
  saveCachedNotifications(userId, all)
}

export function markCachedRead(userId: string, notificationId: string): void {
  const all = loadCachedNotifications(userId)
  const found = all.find((n) => n._id === notificationId)
  if (found) found.isRead = true
  saveCachedNotifications(userId, all)
}
