// ============================================================
// api/index.ts — 统一导出
// ============================================================

export {
  sendMessage, getHistory, newSession, getSessions,
  searchMessages, uploadFile,
} from './chat(DeepSeek API)'
export type {
  ChatSendParams, ChatSendResult, ChatRecord,
  ChatSession, UploadResult, SearchResult,
} from './chat(DeepSeek API)'

export { getDailyAdvice, getTodayData } from './today(DeepSeek API)'
export type { DailyAdvice } from './today(DeepSeek API)'

export { getGrowthEval, getRecords, addRecord } from './journey(DeepSeek API)'
export type { GrowthEvaluation, GrowthRecord } from './journey(DeepSeek API)'

export { getUserProfile, upsertUser, getMemories, addMemory } from './user'
export type { UserProfile, AiMemoryItem } from './user'

export { getProfile, updateProfile } from './profile'
export type { GrowthProfile } from './profile'
