// ============================================================
// DockController.ts — 智能边缘停靠控制器
// 管理 Edge Dock Mode 的滑入滑出行为
// - 鼠标靠近露出头像 → 自动滑出
// - 鼠标离开 → 2 秒后缩回
// - 面板关闭 → 保持展开 2 秒以便用户查看结果
// - 动画 300ms ease-in-out（由 Store 的 cssLeft + CSS transition 驱动）
// ============================================================

import { useAssistantStore } from '@/stores/assistantStore'

const DOCK_HIDE_DELAY = 2000

export function useDockController() {
  const store = useAssistantStore()

  let hideTimer: ReturnType<typeof setTimeout> | null = null

  /** 鼠标进入悬浮助手区域 → 立即滑出 */
  function onHoverEnter() {
    cancelScheduledHide()
    store.isHovering = true
  }

  /** 鼠标离开悬浮助手区域 → 延迟缩回 */
  function onHoverLeave() {
    if (store.isOpen || store.isDragging) return

    if (store.dockMode === 'none') {
      store.isHovering = false
      return
    }

    // dock 模式下延迟缩回
    scheduleHide()
  }

  /** 面板关闭后 → 保持展开状态，延迟缩回 */
  function onPanelClosed() {
    if (store.isDragging) return
    if (store.dockMode === 'none') return

    // 强制保持展开状态
    store.isHovering = true
    // 延迟后缩回
    scheduleHide()
  }

  /** 计划缩回（私有） */
  function scheduleHide() {
    cancelScheduledHide()

    hideTimer = setTimeout(() => {
      // 再次确认不处于交互状态
      if (!store.isOpen && !store.isDragging) {
        store.isHovering = false
      }
    }, DOCK_HIDE_DELAY)
  }

  /** 取消计划缩回 */
  function cancelScheduledHide() {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  return {
    onHoverEnter,
    onHoverLeave,
    onPanelClosed,
    cancelScheduledHide,
  }
}
