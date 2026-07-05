// ============================================================
// chat.ts — 聊天 API
// ============================================================

import client from './client'

// ---- 类型 ----
export interface ChatSendParams {
  userId: string
  message: string
  conversationId?: string
  sessionId?: string
  context?: { page?: string; userProfile?: Record<string, any> }
  fileInfo?: { fileUrl: string; fileName: string; fileType: string }
}

export interface ChatSendResult {
  conversationId: string
  sessionId: string
  reply: string
  title?: string           // AI 生成的对话概述（首轮）
  timestamp: string
}

export interface ChatRecord {
  _id: string
  userId: string
  conversationId: string
  sessionId?: string
  role: 'user' | 'assistant'
  content: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  timestamp: string
}

export interface ChatSession {
  _id: string
  userId: string
  sessionId: string
  title: string
  summary: string          // 最后一条消息前 20 字预览
  messageCount: number
  isActive: boolean
  createdAt: string
  lastMessageAt: string
}

export interface UploadResult {
  fileUrl: string
  fileName: string
  fileType: 'image' | 'document'
  fileSize: number
  analysis: string
}

export interface SearchResult extends ChatRecord {
  sessionName?: string     // 所属会话名称
}

// ---- API 方法 ----

export async function sendMessage(params: ChatSendParams): Promise<ChatSendResult | null> {
  const res = await client.post('/chat/send', params)
  if (res.success) return res.data as ChatSendResult
  console.warn('[API:chat] sendMessage 失败:', res.message)
  return null
}

export async function getHistory(
  userId: string, conversationId?: string, sessionId?: string, limit = 200
): Promise<ChatRecord[]> {
  const params: any = { userId, limit }
  if (conversationId) params.conversationId = conversationId
  if (sessionId) params.sessionId = sessionId
  const res = await client.get('/chat/history', { params })
  if (res.success) return (res.data || []) as ChatRecord[]
  return []
}

export async function newSession(userId: string): Promise<string | null> {
  const res = await client.post('/chat/new-session', { userId })
  if (res.success) return res.data.sessionId as string
  console.warn('[API:chat] newSession 失败:', res.message)
  return null
}

export async function getSessions(userId: string): Promise<ChatSession[]> {
  const res = await client.get('/chat/sessions', { params: { userId } })
  if (res.success) return (res.data || []) as ChatSession[]
  return []
}

export async function searchMessages(userId: string, keyword: string, limit = 30): Promise<SearchResult[]> {
  const res = await client.get('/chat/search', { params: { userId, keyword, limit } })
  if (res.success) return (res.data || []) as SearchResult[]
  return []
}

export async function uploadFile(file: File, userId: string, message?: string): Promise<UploadResult | null> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)
  if (message) formData.append('message', message)
  const res = await client.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  if (res.success) return res.data as UploadResult
  console.warn('[API:chat] uploadFile 失败:', res.message)
  return null
}

/** 删除会话及其全部消息 */
export async function deleteSession(userId: string, sessionId: string): Promise<boolean> {
  const res = await client.delete(`/chat/session/${sessionId}`, { data: { userId } })
  if (res.success) return true
  console.warn('[API:chat] deleteSession 失败:', res.message)
  return false
}

/** 重命名会话 */
export async function renameSession(userId: string, sessionId: string, title: string): Promise<string | null> {
  const res = await client.patch(`/chat/session/${sessionId}`, { userId, title })
  if (res.success) return res.data?.title || title
  console.warn('[API:chat] renameSession 失败:', res.message)
  return null
}
