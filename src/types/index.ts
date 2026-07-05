// ============================================================
// FutureSelf Type Definitions
// ============================================================

// ---- AI 核心 ----

/** AI 运行状态 */
export type AiStatus = 'idle' | 'thinking' | 'insight' | 'sleeping'

/** AI 心情 */
export type AiMood = 'default' | 'happy' | 'excited' | 'worried' | 'tired' | 'relaxed'

/** AI 状态描述项（用于 FsAiStatus 组件） */
export interface AiStatusItem {
  id: string
  emoji: string
  text: string
  status: AiStatus
}

/** AI 快捷操作 */
export interface AiQuickAction {
  id: string
  label: string
  icon: string
  action: string // route or action key
}

// ---- 用户 ----

export interface UserProfile {
  id: string
  name: string
  avatar: string
  university: string
  major: string
  grade: string
  joinDate: string
}

// ---- AI 洞见 ----

export type InsightType = 'learning' | 'life' | 'emotion' | 'suggestion' | 'summary'

export interface AiInsight {
  id: string
  type: InsightType
  title: string
  content: string
  action?: {
    label: string
    route?: string
  }
  createdAt: string
  isRead: boolean
}

// ---- 通知 ----

export interface AiNotification {
  id: string
  type: 'reminder' | 'suggestion' | 'warning' | 'info'
  title: string
  message: string
  duration?: number // ms, 0 = 不自动关闭
  action?: {
    label: string
    handler?: () => void
  }
}

// ---- 日程/任务 ----

export type TaskType = 'course' | 'study' | 'exam' | 'activity' | 'other'
export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  type: TaskType
  startTime: string
  endTime?: string
  completed: boolean
  priority: Priority
}

// ---- 课程 ----

export interface Course {
  id: string
  name: string
  teacher: string
  location: string
  weekday: number
  startPeriod: number
  endPeriod: number
  weeks: number[]
}

// ---- 成长 ----

export type GrowthCategory = 'study' | 'skill' | 'habit' | 'social' | 'health'

export interface GrowthRecord {
  id: string
  date: string
  category: GrowthCategory
  title: string
  description: string
  metric?: {
    label: string
    value: number
    unit: string
  }
}

// ---- 情绪 ----

export type MoodLevel = 'great' | 'good' | 'okay' | 'bad' | 'terrible'

export interface EmotionRecord {
  id: string
  date: string
  mood: MoodLevel
  note?: string
  tags: string[]
}

// ---- 饮食 ----

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodRecommendation {
  id: string
  meal: MealType
  name: string
  description: string
  calories: number
  reason: string
}

// ---- 探索 ----

export type DiscoverType = 'article' | 'challenge' | 'tool' | 'activity'

export interface DiscoverItem {
  id: string
  type: DiscoverType
  title: string
  summary: string
  tags: string[]
  image?: string
  url?: string
}

// ---- 导航 ----

export interface NavItem {
  id: string
  label: string
  icon: string
  route: string
}
