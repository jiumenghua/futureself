// ============================================================
// calendar.ts — 成长日历路由 🔗 [调用DeepSeek API]
// ============================================================
// POST   /api/calendar/sync-ai   — AI 自动匹配赛事
// GET    /api/calendar/upcoming  — 近期事件（7天）
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { CalendarEvent } from '../models/CalendarEvent'
import { getConnectionState } from '../db'
import { validateRequest, throwError } from '../middleware/errorHandler'
import { syncCalendarEvents } from '../services(DeepSeek API)/deepseek(DeepSeek API)'

const router = Router()
const dbOnline = () => getConnectionState()

// ============================================================
// ① 按月份查询
// ============================================================
router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, year, month } = req.query
    if (!userId || !year || !month) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: true, code: 0, message: 'ok', data: [] }); return }

    const y = parseInt(year as string), m = parseInt(month as string)
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0, 23, 59, 59)

    const events = await CalendarEvent.find({ userId, date: { $gte: start, $lte: end } }).sort({ date: 1 })
    res.json({ success: true, code: 0, message: 'ok', data: events })
  } catch (err) { next(err) }
})

// ============================================================
// ② 新增事件
// ============================================================
router.post('/event', validateRequest(['userId', 'title', 'date']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!dbOnline()) { res.json({ success: false, code: 2001, message: '数据库离线' }); return }
    const { userId, title, type = 'custom', category = '', date, description = '', remindEnabled = true, remindDays = 3, officialUrl = '' } = req.body
    const event = await CalendarEvent.create({ userId, title, type, category, date: new Date(date), description, source: 'user_add', remindEnabled, remindDays, officialUrl })
    res.json({ success: true, code: 0, message: 'ok', data: event })
  } catch (err) { next(err) }
})

// ============================================================
// ③ 编辑事件
// ============================================================
router.put('/event/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId, ...updates } = req.body
    if (!id || !userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: false, code: 2001, message: '数据库离线' }); return }
    if (updates.date) updates.date = new Date(updates.date)
    const event = await CalendarEvent.findOneAndUpdate({ _id: id, userId }, { $set: updates }, { new: true })
    if (!event) throwError('NOT_FOUND')
    res.json({ success: true, code: 0, message: 'ok', data: event })
  } catch (err) { next(err) }
})

// ============================================================
// ④ 删除事件
// ============================================================
router.delete('/event/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    if (!id || !userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: false, code: 2001, message: '数据库离线' }); return }
    await CalendarEvent.findOneAndDelete({ _id: id, userId })
    res.json({ success: true, code: 0, message: '已删除' })
  } catch (err) { next(err) }
})

// ============================================================
// ⑤ AI 同步赛事
// ============================================================
router.post('/sync-ai', validateRequest(['userId']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, school, major, grade, categories } = req.body
    const count = await syncCalendarEvents(userId, { school: school || '', major: major || '', grade: grade || '', categories: categories || [] })
    res.json({ success: true, code: 0, message: `已为你更新 ${count} 条赛事标注`, data: { count } })
  } catch (err) { next(err) }
})

// ============================================================
// ⑥ 近期事件（7天内）
// ============================================================
router.get('/upcoming', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: true, code: 0, message: 'ok', data: [] }); return }

    const now = new Date(); now.setHours(0, 0, 0, 0)
    const end = new Date(now); end.setDate(end.getDate() + 7)

    const events = await CalendarEvent.find({ userId, date: { $gte: now, $lte: end } }).sort({ date: 1 })
    res.json({ success: true, code: 0, message: 'ok', data: events })
  } catch (err) { next(err) }
})

export default router
