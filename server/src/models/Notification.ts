// ============================================================
// Notification.ts — AI 主动提醒通知模型
// 统一收纳所有 AI 推送的提醒记录
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export type NotificationType = 'study' | 'diet' | 'schedule' | 'growth' | 'emotion_comfort' | 'sedentary_remind' | 'diet_remind' | 'daily'

export interface INotification extends Document {
  userId: string
  type: NotificationType
  title: string
  content: string
  isRead: boolean
  relatedPath: string
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId:      { type: String, required: true, index: true },
    type:        { type: String, enum: ['study', 'diet', 'schedule', 'growth', 'emotion_comfort', 'sedentary_remind', 'diet_remind', 'daily'], required: true },
    title:       { type: String, required: true },
    content:     { type: String, default: '' },
    isRead:      { type: Boolean, default: false },
    relatedPath: { type: String, default: '' },
    createdAt:   { type: Date, default: Date.now },
  },
  { timestamps: false }
)

// 索引：按用户+已读状态查询未读数量，按用户+时间倒序排列
NotificationSchema.index({ userId: 1, isRead: 1 })
NotificationSchema.index({ userId: 1, createdAt: -1 })

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema)
