// ============================================================
// notifications.ts — 通知中心路由
// GET    /api/notifications/list      — 获取用户所有提醒（按时间倒序）
// PUT    /api/notifications/read-all  — 全部标记已读
// PUT    /api/notifications/:id/read  — 单条标记已读
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { Notification } from '../models/Notification'
import { getConnectionState } from '../db'
import { throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

// ============================================================
// ① 获取通知列表
// ============================================================
router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: true, code: 0, message: 'ok', data: [] }); return }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100)

    res.json({ success: true, code: 0, message: 'ok', data: notifications })
  } catch (err) { next(err) }
})

// ============================================================
// ② 全部标记已读
// ============================================================
router.put('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: false, code: 2001, message: '数据库离线' }); return }

    await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } })
    res.json({ success: true, code: 0, message: '已全部标记为已读' })
  } catch (err) { next(err) }
})

// ============================================================
// ③ 单条标记已读
// ============================================================
router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    if (!id || !userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) { res.json({ success: false, code: 2001, message: '数据库离线' }); return }

    await Notification.findOneAndUpdate({ _id: id, userId }, { $set: { isRead: true } })
    res.json({ success: true, code: 0, message: '已标记为已读' })
  } catch (err) { next(err) }
})

export default router
