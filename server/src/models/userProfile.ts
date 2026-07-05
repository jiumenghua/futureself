// ============================================================
// userProfile.ts — AI 成长画像模型
// 独立于 User 模型，存储 AI 自动提取 + 用户手动编辑的画像
// 字段完整对应前端 Me 页各模块
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

// ---- 子文档类型 ----

export interface IBaseInfo {
  school: string
  major: string
  grade: string
  /** 置信度 0-1，手动修改标记为 1 */
  confidence: number
}

export interface IGoalItem {
  content: string
  createdAt: Date
  /** auto = AI 自动提取，manual = 用户手动修改（AI 不可覆盖） */
  source: 'auto' | 'manual'
}

export interface IProfileDimension {
  tags: string[]
  details: string[]
  updatedAt: Date | null
}

export interface IDiscoveryItem {
  content: string
  discoveredAt: Date
  /** 标记是否为新发现（前3条为 true） */
  isNew: boolean
}

// ---- 主文档接口 ----

export interface IUserProfile extends Document {
  userId: string
  baseInfo: IBaseInfo
  goals: IGoalItem[]
  learningProfile: IProfileDimension
  dietProfile: IProfileDimension
  personalityProfile: IProfileDimension
  recentDiscoveries: IDiscoveryItem[]
  /** 累计聊天天数（跨天 +1） */
  totalChatDays: number
  /** 最近一次聊天日期 YYYY-MM-DD */
  lastChatDate: string
  updatedAt: Date
  createdAt: Date
}

// ---- Schema ----

const BaseInfoSchema = new Schema<IBaseInfo>(
  {
    school:     { type: String, default: '' },
    major:      { type: String, default: '' },
    grade:      { type: String, default: '' },
    confidence: { type: Number, default: 0, min: 0, max: 1 },
  },
  { _id: false }
)

const GoalItemSchema = new Schema<IGoalItem>(
  {
    content:   { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    source:    { type: String, enum: ['auto', 'manual'], default: 'auto' },
  },
  { _id: false }
)

const ProfileDimensionSchema = new Schema<IProfileDimension>(
  {
    tags:      { type: [String], default: [] },
    details:   { type: [String], default: [] },
    updatedAt: { type: Date, default: null },
  },
  { _id: false }
)

const DiscoveryItemSchema = new Schema<IDiscoveryItem>(
  {
    content:      { type: String, required: true },
    discoveredAt: { type: Date, default: Date.now },
    isNew:        { type: Boolean, default: true },
  },
  { _id: false }
)

const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId:             { type: String, required: true, unique: true, index: true },
    baseInfo:           { type: BaseInfoSchema, default: () => ({ school: '', major: '', grade: '', confidence: 0 }) },
    goals:              { type: [GoalItemSchema], default: [] },
    learningProfile:    { type: ProfileDimensionSchema, default: () => ({ tags: [], details: [], updatedAt: null }) },
    dietProfile:        { type: ProfileDimensionSchema, default: () => ({ tags: [], details: [], updatedAt: null }) },
    personalityProfile: { type: ProfileDimensionSchema, default: () => ({ tags: [], details: [], updatedAt: null }) },
    recentDiscoveries:  { type: [DiscoveryItemSchema], default: [] },
    totalChatDays:      { type: Number, default: 1 },
    lastChatDate:       { type: String, default: '' },
    updatedAt:          { type: Date, default: Date.now },
    createdAt:          { type: Date, default: Date.now },
  },
  { timestamps: false }
)

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)
