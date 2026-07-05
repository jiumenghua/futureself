import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 通知类型（不再依赖 mock，类型内联定义）
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

export const useNotificationStore = defineStore('notification', () => {
  const active = ref<ProactiveNotification | null>(null)
  const visible = ref(false)

  const hasActive = computed(() => visible.value && active.value !== null)

  // ---- 简单冷却：10 分钟内同一场景不重复 ----
  const cooldowns = new Map<string, number>()

  function canShow(scenario: string): boolean {
    const last = cooldowns.get(scenario)
    if (!last) return true
    return Date.now() - last > 10 * 60 * 1000
  }

  /** 推送并显示 */
  function push(notification: ProactiveNotification) {
    if (visible.value) return
    if (!canShow(notification.scenario)) return

    active.value = notification
    visible.value = true

    if (notification.duration > 0) {
      setTimeout(() => {
        if (active.value?.id === notification.id) dismiss()
      }, notification.duration)
    }
  }

  function dismiss() {
    if (active.value) {
      cooldowns.set(active.value.scenario, Date.now())
    }
    visible.value = false
    setTimeout(() => { active.value = null }, 400)
  }

  function primaryAction() { dismiss() }
  function secondaryAction() { dismiss() }

  /** 场景已清空，no-op（待后续从真实通知 API 驱动） */
  function trigger(_scenarioId: string) { /* no-op */ }
  function triggerRandom() { /* no-op */ }

  // ---- 自动调度（已停用，待后续接入真实通知） ----
  let timer: ReturnType<typeof setInterval> | null = null

  function startSchedule() {
    // 暂不启用自动调度
  }

  function stopSchedule() {
    if (timer) { clearInterval(timer); timer = null }
  }

  return {
    active,
    visible,
    hasActive,
    push,
    dismiss,
    primaryAction,
    secondaryAction,
    trigger,
    triggerRandom,
    startSchedule,
    stopSchedule,
  }
})
