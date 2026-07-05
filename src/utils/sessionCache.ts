// ============================================================
// sessionCache.ts — 会话与消息本地缓存
// 当 MongoDB 不可达时，localStorage 作为降级持久化层
// 保证"最近对话"列表和聊天记录在刷新后不丢失
// ============================================================

import type { ChatSession } from '@/api/chat(DeepSeek API)'

const SESSIONS_KEY = (userId: string) => `fs_sessions_${userId}`
const MESSAGES_KEY = (sessionId: string) => `fs_messages_${sessionId}`

// ---- 会话缓存 ----

export function loadCachedSessions(userId: string): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY(userId))
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export function saveCachedSessions(userId: string, sessions: ChatSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY(userId), JSON.stringify(sessions))
  } catch { /* localStorage 满 */ }
}

/** 添加一个新会话到缓存顶部，其余下移 */
export function addCachedSession(userId: string, session: ChatSession): void {
  const sessions = loadCachedSessions(userId)
  // 去重
  const filtered = sessions.filter((s) => s.sessionId !== session.sessionId)
  filtered.unshift(session)
  saveCachedSessions(userId, filtered)
}

/** 更新缓存的会话（标题、摘要、时间） */
export function updateCachedSession(userId: string, update: Partial<ChatSession> & { sessionId: string }): void {
  const sessions = loadCachedSessions(userId)
  const idx = sessions.findIndex((s) => s.sessionId === update.sessionId)
  if (idx >= 0) {
    sessions[idx] = { ...sessions[idx], ...update }
  } else {
    sessions.unshift(update as ChatSession)
  }
  saveCachedSessions(userId, sessions)
}

// ---- 消息缓存 ----

export interface CachedMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
  fileUrl?: string
  fileName?: string
  fileType?: string
}

export function loadCachedMessages(sessionId: string): CachedMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY(sessionId))
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export function saveCachedMessages(sessionId: string, messages: CachedMessage[]): void {
  try {
    // 限制每个会话最多缓存 200 条消息
    const trimmed = messages.slice(-200)
    localStorage.setItem(MESSAGES_KEY(sessionId), JSON.stringify(trimmed))
  } catch { /* localStorage 满 */ }
}

export function addCachedMessage(sessionId: string, message: CachedMessage): void {
  const messages = loadCachedMessages(sessionId)
  messages.push(message)
  saveCachedMessages(sessionId, messages)
}
