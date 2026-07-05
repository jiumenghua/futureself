// ============================================================
// types/index.ts — 服务端共享类型定义
// ============================================================

// ---- API 标准响应 ----
export interface ApiResponse<T = any> {
  success: boolean
  code: number
  message: string
  data?: T
}

// ---- 标准化错误码 ----
export enum ErrorCode {
  SUCCESS = 0,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  RATE_LIMITED = 429,
  INTERNAL_ERROR = 500,
  AI_API_ERROR = 1001,
  AI_TIMEOUT = 1002,
  DB_ERROR = 2001,
  DB_CONNECTION_ERROR = 2002,
}

// ---- 聊天消息 ----
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ---- 聊天请求 ----
export interface ChatRequest {
  userId: string
  message: string
  conversationId?: string
  context?: {
    page?: string
    userProfile?: Record<string, any>
  }
}

// ---- 聊天响应 ----
export interface ChatResponse {
  conversationId: string
  reply: string
  timestamp: string
}

// ---- 每日建议 ----
export interface DailyAdviceRequest {
  userId: string
  date?: string
}

export interface DailyAdvice {
  study: { title: string; content: string; tip: string }
  food: { title: string; content: string; tip: string }
  emotion: { title: string; content: string; tip: string }
  summary: string
}

// ---- 成长评价 ----
export interface GrowthEvalRequest {
  userId: string
  period?: 'week' | 'month'
}

export interface GrowthEval {
  summary: string
  highlights: string[]
  suggestions: string[]
  encouragement: string
}

// ---- 用户 ----
export interface UserData {
  userId: string
  nickname: string
  avatar?: string
  university?: string
  major?: string
  grade?: string
  growthScore: number
  createdAt: string
}

// ---- 成长记录 ----
export interface GrowthRecord {
  userId: string
  date: string
  type: 'study' | 'food' | 'emotion' | 'exercise'
  title: string
  description: string
  duration?: number
  mood?: string
  tags?: string[]
}
