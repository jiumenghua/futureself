// ============================================================
// AssistantStore.ts — FutureSelf 悬浮助手全局状态管理
// Pinia Store，管理悬浮助手的所有状态和行为
// ============================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  loadPosition,
  savePosition,
  getDefaultPosition,
  type PositionData,
  type DockMode,
} from '@/utils/positionStorage'

// ---- 常量 ----
export const BALL_SIZE = 52
export const DOCK_VISIBLE = 14 // dock 态露出约 25%
export const EDGE_DOCK_THRESHOLD = 30 // 靠近边缘 <30px → dock
export const EDGE_FREE_THRESHOLD = 60 // 远离边缘 >60px → 完全显示

export const useAssistantStore = defineStore('assistant', () => {
  // ==================== 状态 ====================

  const pos = loadPosition()

  const position = ref({ x: pos.x, y: pos.y })
  const dockMode = ref<DockMode>(pos.dockMode)
  const isOpen = ref(false)
  const isDragging = ref(false)
  const isHovering = ref(false)
  const status = ref<'idle' | 'thinking'>('idle')
  const showContextMenu = ref(false)
  const contextMenuPos = ref({ x: 0, y: 0 })
  const isTransitioning = ref(false) // 是否正在 dock 动画中

  // ==================== 计算属性 ====================

  const isDocked = computed(() => dockMode.value !== 'none')

  /** 当前 CSS left 值 */
  const cssLeft = computed(() => {
    if (isDragging.value) return position.value.x
    if (dockMode.value === 'left') {
      return isHovering.value || isOpen.value ? 0 : -(BALL_SIZE - DOCK_VISIBLE)
    }
    if (dockMode.value === 'right') {
      return isHovering.value || isOpen.value
        ? window.innerWidth - BALL_SIZE
        : window.innerWidth - DOCK_VISIBLE
    }
    return position.value.x
  })

  /** 是否应该应用过渡动画 */
  const shouldAnimate = computed(() => !isDragging.value)

  // ==================== 动作 ====================

  /** 设置位置 */
  function setPosition(x: number, y: number) {
    position.value.x = x
    position.value.y = y
  }

  /** 进入停靠模式 */
  function enterDockMode(mode: 'left' | 'right') {
    dockMode.value = mode
    // 停靠时锁定 Y 坐标
    persistPosition()
  }

  /** 退出停靠模式（从 dock 恢复为普通模式） */
  function exitDockMode() {
    if (dockMode.value === 'none') return
    // 恢复位置：从 dock 位置推算正常位置
    if (dockMode.value === 'left') {
      position.value.x = 8
    } else {
      position.value.x = window.innerWidth - BALL_SIZE - 8
    }
    dockMode.value = 'none'
    persistPosition()
  }

  /** 双击切换 dock */
  function toggleDock() {
    if (isDragging.value) return
    if (dockMode.value === 'none') {
      // 进入 dock：根据位置决定停靠到哪边
      const centerX = position.value.x + BALL_SIZE / 2
      const screenCenterX = window.innerWidth / 2
      enterDockMode(centerX < screenCenterX ? 'left' : 'right')
    } else {
      exitDockMode()
    }
  }

  /** 打开/关闭面板 */
  function togglePanel() {
    if (isDragging.value) return
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      // 打开面板时强制完全显示
      if (dockMode.value !== 'none') {
        // 暂时不退出 dock，但通过 cssLeft 的 isOpen 条件强制滑出
      }
    }
  }

  /** 关闭面板 */
  function closePanel() {
    isOpen.value = false
  }

  /** 持久化当前位置到 localStorage */
  function persistPosition() {
    savePosition({
      x: position.value.x,
      y: position.value.y,
      dockMode: dockMode.value,
    })
  }

  /** 重置到默认位置 */
  function resetPosition() {
    const def = getDefaultPosition()
    position.value.x = def.x
    position.value.y = def.y
    dockMode.value = def.dockMode
    isOpen.value = false
    persistPosition()
  }

  /** 移动到左侧 */
  function moveToLeft() {
    position.value.x = 8
    position.value.y = position.value.y
    dockMode.value = 'none'
    isOpen.value = false
    persistPosition()
  }

  /** 移动到右侧 */
  function moveToRight() {
    position.value.x = window.innerWidth - BALL_SIZE - 8
    position.value.y = position.value.y
    dockMode.value = 'none'
    isOpen.value = false
    persistPosition()
  }

  return {
    // state
    position,
    dockMode,
    isOpen,
    isDragging,
    isHovering,
    status,
    showContextMenu,
    contextMenuPos,
    isTransitioning,

    // computed
    isDocked,
    cssLeft,
    shouldAnimate,

    // actions
    setPosition,
    enterDockMode,
    exitDockMode,
    toggleDock,
    togglePanel,
    closePanel,
    persistPosition,
    resetPosition,
    moveToLeft,
    moveToRight,
  }
})
