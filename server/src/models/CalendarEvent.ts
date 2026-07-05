// ============================================================
// CalendarEvent.ts — 成长日历事件模型
// ============================================================

import mongoose, { Schema, Document } from 'mongoose'

export type EventType = 'competition' | 'exam' | 'study' | 'custom'
export type EventSource = 'ai_auto' | 'user_add'

export interface ICalendarEvent extends Document {
  userId: string
  title: string
  type: EventType
  category: string
  date: Date
  description: string
  source: EventSource
  remindEnabled: boolean
  remindDays: number
  officialUrl: string
  lastRemindedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const CalendarEventSchema = new Schema<ICalendarEvent>({
  userId:        { type: String, required: true, index: true },
  title:         { type: String, required: true },
  type:          { type: String, required: true, enum: ['competition', 'exam', 'study', 'custom'], default: 'custom' },
  category:      { type: String, default: '' },
  date:          { type: Date, required: true },
  description:   { type: String, default: '' },
  source:        { type: String, enum: ['ai_auto', 'user_add'], default: 'user_add' },
  remindEnabled: { type: Boolean, default: true },
  remindDays:    { type: Number, default: 3 },
  officialUrl:   { type: String, default: '' },
  lastRemindedAt:{ type: Date },
}, { timestamps: true })

CalendarEventSchema.index({ userId: 1, date: 1 })
CalendarEventSchema.index({ userId: 1, type: 1 })

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema)
