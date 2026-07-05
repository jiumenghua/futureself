// ============================================================
// DietRecord.ts — 用户饮食记录模型
// 留存 AI 推荐 + 用户手动输入的饮食数据，用于去重与分析
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type DietSource = 'ai_recommend' | 'user_input'

export interface IDietRecord extends Document {
  userId: string
  date: string           // YYYY-MM-DD
  mealType: MealType
  foodContent: string    // 推荐内容描述（JSON 序列化字符串）
  source: DietSource
  createdAt: Date
}

const DietRecordSchema = new Schema<IDietRecord>(
  {
    userId:      { type: String, required: true, index: true },
    date:        { type: String, required: true },
    mealType:    { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    foodContent: { type: String, default: '' },
    source:      { type: String, enum: ['ai_recommend', 'user_input'], default: 'ai_recommend' },
    createdAt:   { type: Date, default: Date.now },
  },
  { timestamps: false }
)

// 索引：用户+日期、用户+日期+餐次（唯一，防重复推送）
DietRecordSchema.index({ userId: 1, date: 1 })
DietRecordSchema.index({ userId: 1, date: 1, mealType: 1 }, { unique: true })

export const DietRecord = mongoose.model<IDietRecord>('DietRecord', DietRecordSchema)
