// ============================================================
// User.ts — 用户模型
// 敏感字段在路由层通过 crypto 服务加解密
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  userId: string
  nickname: string       // 加密存储
  avatar: string
  university: string
  major: string          // 加密存储
  grade: string          // 加密存储
  growthScore: number
  // 饮食相关（明文）
  campus: string
  dietPreference: string[]
  dietTaboo: string[]
  mealRemindEnabled: boolean
  customMealTime: { breakfast: string; lunch: string; dinner: string }
  // AI 成长档案（明文，AI 自动提取）
  goals: string[]
  studyProfile: string[]
  foodProfile: string[]
  personalityProfile: string[]
  recentDiscoveries: string[]
  lastProfileUpdate: Date | null
  createdAt: Date
}

const defaultMealTime = { breakfast: '07:30', lunch: '12:00', dinner: '18:00' }

const UserSchema = new Schema<IUser>({
  userId:    { type: String, required: true, unique: true, index: true },
  nickname:  { type: String, required: true },
  avatar:    { type: String, default: '' },
  university:{ type: String, default: '' },
  major:     { type: String, default: '' },
  grade:     { type: String, default: '' },
  growthScore: { type: Number, default: 0 },
  campus:      { type: String, default: '' },
  dietPreference: { type: [String], default: [] },
  dietTaboo:      { type: [String], default: [] },
  mealRemindEnabled: { type: Boolean, default: true },
  customMealTime:   { type: Schema.Types.Mixed, default: defaultMealTime },
  // AI 成长档案
  goals:              { type: [String], default: [] },
  studyProfile:       { type: [String], default: [] },
  foodProfile:        { type: [String], default: [] },
  personalityProfile: { type: [String], default: [] },
  recentDiscoveries:  { type: [String], default: [] },
  lastProfileUpdate:  { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.model<IUser>('User', UserSchema)
