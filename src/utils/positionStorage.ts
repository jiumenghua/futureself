// ============================================================
// PositionStorage.ts — 悬浮助手位置持久化
// 保存/加载位置和停靠状态到 localStorage
// 整个网站共享位置
// ============================================================

export type DockMode = 'none' | 'left' | 'right'

export interface PositionData {
  x: number
  y: number
  dockMode: DockMode
}

const STORAGE_KEY = 'fs_assistant_position'

/** 默认位置：右侧中间 */
export function getDefaultPosition(): PositionData {
  return {
    x: window.innerWidth - 68, // 52px ball + 16px margin from right
    y: window.innerHeight / 2 - 26,
    dockMode: 'none',
  }
}

/** 从 localStorage 加载位置 */
export function loadPosition(): PositionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as PositionData
      // 合理性校验
      if (
        typeof data.x === 'number' &&
        typeof data.y === 'number' &&
        ['none', 'left', 'right'].includes(data.dockMode)
      ) {
        return data
      }
    }
  } catch {
    // localStorage 损坏或不支持，使用默认值
  }
  return getDefaultPosition()
}

/** 保存位置到 localStorage */
export function savePosition(data: PositionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // 静默失败，localStorage 可能已满
  }
}
