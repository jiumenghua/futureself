// ============================================================
// AiMemory.ts — AI 长期记忆标签模型
// 记忆内容使用 AES 加密存储
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export interface IAiMemory extends Document {
  userId: string
  tag: string           // 加密存储
  weight: number        // 权重 0-1
  category: string      // 记忆分类：habit, preference, achievement, concern
  updatedAt: Date
}

const AiMemorySchema = new Schema<IAiMemory>({
  userId:   { type: String, required: true, index: true },
  tag:      { type: String, required: true },
  weight:   { type: Number, default: 0.5, min: 0, max: 1 },
  category: { type: String, default: 'preference', enum: ['habit', 'preference', 'achievement', 'concern'] },
  updatedAt:{ type: Date, default: Date.now },
})

AiMemorySchema.index({ userId: 1, category: 1 })

export const AiMemory = mongoose.model<IAiMemory>('AiMemory', AiMemorySchema)
