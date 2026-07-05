// ============================================================
// GrowthData.ts — 用户成长数据模型
// 按日维度记录学习、饮食、情绪、运动
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export interface IGrowthData extends Document {
  userId: string
  date: string           // YYYY-MM-DD
  type: 'study' | 'food' | 'emotion' | 'exercise'
  title: string
  description: string
  duration?: number      // 学习/运动时长（分钟）
  mood?: string          // 情绪记录
  tags: string[]
  createdAt: Date
}

const GrowthDataSchema = new Schema<IGrowthData>({
  userId:      { type: String, required: true, index: true },
  date:        { type: String, required: true },
  type:        { type: String, required: true, enum: ['study', 'food', 'emotion', 'exercise'] },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  duration:    { type: Number },
  mood:        { type: String },
  tags:        { type: [String], default: [] },
  createdAt:   { type: Date, default: Date.now },
})

// 按用户+日期查询
GrowthDataSchema.index({ userId: 1, date: 1 })
GrowthDataSchema.index({ userId: 1, type: 1, date: 1 })

export const GrowthData = mongoose.model<IGrowthData>('GrowthData', GrowthDataSchema)
