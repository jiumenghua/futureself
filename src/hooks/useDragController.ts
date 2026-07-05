// ============================================================
// DragController.ts — 自由拖拽控制器
// 纯逻辑层：计算位置偏移、判断移动阈值
// 事件绑定由 FloatingAssistant 的 overlay 层统一管理
// ============================================================

import { useAssistantStore, BALL_SIZE, EDGE_DOCK_THRESHOLD } from '@/stores/assistantStore'

const MIN_MOVE = 3 // 最小移动阈值（区分点击和拖拽）

export function useDragController() {
  const store = useAssistantStore()

  let startX = 0
  let startY = 0
  let startPosX = 0
  let startPosY = 0
  let moved = false

  /** 记录拖拽起点 */
  function begin(e: PointerEvent) {
    store.isDragging = true
    store.closePanel()

    startX = e.clientX
    startY = e.clientY
    startPosX = store.position.x
    startPosY = store.position.y
    moved = false

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }

  /** 拖拽移动计算 */
  function move(e: PointerEvent) {
    if (!store.isDragging) return

    const dx = e.clientX - startX
    const dy = e.clientY - startY

    if (Math.abs(dx) > MIN_MOVE || Math.abs(dy) > MIN_MOVE) {
      moved = true
    }

    let newX = startPosX + dx
    let newY = startPosY + dy

    // 轻微边界约束：保持至少 12px 可见
    const minX = -(BALL_SIZE - 12)
    const maxX = window.innerWidth - 12
    const minY = 0
    const maxY = window.innerHeight - BALL_SIZE

    newX = Math.max(minX, Math.min(maxX, newX))
    newY = Math.max(minY, Math.min(maxY, newY))

    store.setPosition(newX, newY)
  }

  /** 结束拖拽，评估停靠状态 */
  function end() {
    if (!store.isDragging) return

    document.body.style.userSelect = ''
    document.body.style.cursor = ''

    store.isDragging = false

    // 评估是否需要进入 Edge Dock Mode
    evaluateDockState()

    // 持久化
    store.persistPosition()
  }

  /** 根据最终位置判断是否 dock */
  function evaluateDockState() {
    const x = store.position.x

    if (x < -(BALL_SIZE - EDGE_DOCK_THRESHOLD)) {
      // 球大部分拖到左边缘外
      store.enterDockMode('left')
    } else if (x > window.innerWidth - EDGE_DOCK_THRESHOLD) {
      // 球大部分拖到右边缘外
      store.enterDockMode('right')
    } else if (store.dockMode === 'left' && x + BALL_SIZE > 60) {
      // 从左 dock 拖出
      store.exitDockMode()
    } else if (store.dockMode === 'right' && x < window.innerWidth - 60) {
      // 从右 dock 拖出
      store.exitDockMode()
    }
  }

  /** 本次拖拽是否移动过（区分点击） */
  function hasMoved(): boolean {
    return moved
  }

  return {
    begin,
    move,
    end,
    hasMoved,
  }
}
