// ============================================================
// notify.ts — 主动弹窗通知路由
// GET    /api/notify/unread  — 获取当前用户未读通知
// POST   /api/notify/read    — 批量标记通知为已读
// DELETE /api/notify/:id     — 删除单条通知
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { Notification } from '../models/Notification'
import { getConnectionState } from '../db'
import { throwError } from '../middleware/errorHandler'

const router = Router()
const dbOnline = () => getConnectionState()

// ---- 获取未读通知 ----
router.get('/unread', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }

    const notifications = await Notification.find({
      userId: userId as string,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ success: true, code: 0, message: 'ok', data: notifications })
  } catch (err) { next(err) }
})

// ---- 批量标记已读 ----
router.post('/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, ids } = req.body
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线' })
      return
    }

    if (Array.isArray(ids) && ids.length > 0) {
      await Notification.updateMany(
        { userId, _id: { $in: ids } },
        { $set: { isRead: true } }
      )
    }

    res.json({ success: true, code: 0, message: 'ok' })
  } catch (err) { next(err) }
})

// ---- 删除单条通知 ----
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    if (!id || !userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: false, code: 2001, message: '数据库离线' })
      return
    }

    const result = await Notification.findOneAndDelete({ _id: id, userId })
    if (!result) {
      res.json({ success: false, code: 404, message: '通知不存在' })
      return
    }

    res.json({ success: true, code: 0, message: '已删除' })
  } catch (err) { next(err) }
})

export default router
