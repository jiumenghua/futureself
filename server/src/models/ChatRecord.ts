// ============================================================
// ChatRecord.ts — 聊天记录模型
// 扩展：sessionId、文件附件字段
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export interface IChatRecord extends Document {
  userId: string
  conversationId: string   // 向后兼容
  sessionId: string         // 关联 ChatSession
  role: 'user' | 'assistant'
  content: string
  fileUrl?: string          // 上传文件访问 URL
  fileName?: string         // 原始文件名
  fileType?: string         // 'image' | 'document'
  timestamp: Date
}

const ChatRecordSchema = new Schema<IChatRecord>({
  userId:         { type: String, required: true, index: true },
  conversationId: { type: String, required: true, index: true },
  sessionId:      { type: String, default: '', index: true },
  role:           { type: String, required: true, enum: ['user', 'assistant'] },
  content:        { type: String, required: true },
  fileUrl:        { type: String },
  fileName:       { type: String },
  fileType:       { type: String, enum: ['image', 'document'] },
  timestamp:      { type: Date, default: Date.now },
})

ChatRecordSchema.index({ userId: 1, sessionId: 1, timestamp: 1 })
ChatRecordSchema.index({ userId: 1, conversationId: 1, timestamp: 1 })
// 全文搜索索引
ChatRecordSchema.index({ content: 'text' })

export const ChatRecord = mongoose.model<IChatRecord>('ChatRecord', ChatRecordSchema)
