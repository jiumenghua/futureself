import { ref } from 'vue'
import type { AiNotification } from '@/types'

// ============================================================
// useNotification — 全局通知队列管理
// ============================================================

const activeNotifications = ref<AiNotification[]>([])

let idCounter = 0

export function useNotification() {
  /** 推送通知 */
  function push(notification: Omit<AiNotification, 'id'>) {
    const id = `notif_${++idCounter}_${Date.now()}`
    const item: AiNotification = { ...notification, id }
    activeNotifications.value = [...activeNotifications.value, item]

    // 最多显示 3 条
    if (activeNotifications.value.length > 3) {
      activeNotifications.value = activeNotifications.value.slice(-3)
    }

    return id
  }

  /** 关闭通知 */
  function dismiss(id: string) {
    activeNotifications.value = activeNotifications.value.filter(n => n.id !== id)
  }

  /** 快捷推送（预设模板） */
  function notifyReminder(title: string, message: string, action?: AiNotification['action']) {
    return push({ type: 'reminder', title, message, duration: 6000, action })
  }

  function notifySuggestion(title: string, message: string, action?: AiNotification['action']) {
    return push({ type: 'suggestion', title, message, duration: 8000, action })
  }

  function notifyWarning(title: string, message: string) {
    return push({ type: 'warning', title, message, duration: 0 })
  }

  function notifyInfo(title: string, message: string) {
    return push({ type: 'info', title, message, duration: 4000 })
  }

  return {
    activeNotifications,
    push,
    dismiss,
    notifyReminder,
    notifySuggestion,
    notifyWarning,
    notifyInfo,
  }
}
