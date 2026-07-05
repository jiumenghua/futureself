// ============================================================
// ChatSession.ts — 会话模型
// 全量保留所有历史会话，不自动删除
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export interface IChatSession extends Document {
  userId: string
  sessionId: string
  title: string          // 首条用户消息前 15 字
  summary: string        // 最后一条消息前 20 字
  messageCount: number
  isActive: boolean
  createdAt: Date
  lastMessageAt: Date
}

const ChatSessionSchema = new Schema<IChatSession>({
  userId:       { type: String, required: true, index: true },
  sessionId:    { type: String, required: true, unique: true, index: true },
  title:        { type: String, default: '新对话' },
  summary:      { type: String, default: '' },
  messageCount: { type: Number, default: 0 },
  isActive:     { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
  lastMessageAt:{ type: Date, default: Date.now },
})

ChatSessionSchema.index({ userId: 1, isActive: 1 })
ChatSessionSchema.index({ userId: 1, lastMessageAt: -1 })

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema)
