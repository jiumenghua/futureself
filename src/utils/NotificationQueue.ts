// ============================================================
// NotificationQueue — AI 提醒队列管理
// 规则：同时只显示 1 个，关闭后 10 分钟内不重复同场景
// ============================================================

export interface ProactiveNotification {
  id: string
  scenario: string
  title: string
  content: string
  duration: number
  type: 'study' | 'diet' | 'schedule' | 'growth'
  primaryAction?: { label: string; route?: string }
  secondaryAction?: { label: string; route?: string }
}

interface QueueItem {
  notification: ProactiveNotification
  resolve: () => void
}

const COOLDOWN_MS = 10 * 60 * 1000
const recentDismissals = new Map<string, number>()

let currentItem: QueueItem | null = null
const waitQueue: QueueItem[] = []
let dismissTimer: ReturnType<typeof setTimeout> | null = null

export function canShow(scenario: string): boolean {
  const last = recentDismissals.get(scenario)
  if (!last) return true
  return Date.now() - last > COOLDOWN_MS
}

function recordDismiss(scenario: string) {
  recentDismissals.set(scenario, Date.now())
}

export function enqueue(notification: ProactiveNotification): Promise<void> {
  if (!canShow(notification.scenario)) return Promise.resolve()

  return new Promise((resolve) => {
    const item: QueueItem = { notification, resolve }
    if (currentItem) {
      waitQueue.push(item)
    } else {
      showNow(item)
    }
  })
}

function showNow(item: QueueItem) {
  currentItem = item

  if (item.notification.duration > 0) {
    clearTimeout(dismissTimer as any)
    dismissTimer = setTimeout(() => dismiss(), item.notification.duration)
  }
}

export function dismiss() {
  if (!currentItem) return
  const item = currentItem
  currentItem = null
  clearTimeout(dismissTimer as any)
  recordDismiss(item.notification.scenario)
  item.resolve()

  if (waitQueue.length > 0) {
    const next = waitQueue.shift()!
    if (canShow(next.notification.scenario)) {
      showNow(next)
    } else {
      next.resolve()
    }
  }
}

export function getCurrent(): QueueItem | null {
  return currentItem
}

export function queueLength(): number {
  return waitQueue.length + (currentItem ? 1 : 0)
}

export function clearAll() {
  currentItem = null
  waitQueue.length = 0
  clearTimeout(dismissTimer as any)
}
