// ============================================================
// test.ts — 测试接口（仅开发环境使用）
// GET /api/test/popup — 一键生成测试通知，验证弹窗链路
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { Notification } from '../models/Notification'
import { getConnectionState } from '../db'

const router = Router()
const dbOnline = () => getConnectionState()

// ---- 生成测试通知 ----
router.get('/popup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, type } = req.query
    const uid = (userId as string) || 'user_demo_001'
    const notifType = (type as string) || 'emotion_comfort'

    const testData: Record<string, { title: string; content: string }> = {
      emotion_comfort: {
        title: '状态小提醒',
        content: '看你刚才好像有点静不下心，深呼吸一下，慢慢来～我在这儿陪着你 🌿',
      },
      sedentary_remind: {
        title: '起来活动一下吧',
        content: '已经学了45分钟啦，起来接杯水、活动活动肩膀，回来效率更高～',
      },
      diet_remind: {
        title: '饭点提醒',
        content: '到饭点啦～今天食堂的红烧肉不错，记得按时吃饭哦 🍚',
      },
      daily: {
        title: '今日成长小结',
        content: '今天也是充实的一天！回顾一下今天的收获，明天继续加油 ✨',
      },
    }

    const data = testData[notifType] || testData.emotion_comfort

    if (dbOnline()) {
      const notif = await Notification.create({
        userId: uid,
        type: notifType,
        title: data.title,
        content: data.content,
        isRead: false,
        relatedPath: '',
      })
      res.json({
        success: true, code: 0, message: '测试通知已生成',
        data: notif,
      })
    } else {
      res.json({
        success: true, code: 0, message: '测试通知（DB离线，未持久化）',
        data: { userId: uid, type: notifType, ...data, isRead: false },
      })
    }
  } catch (err) { next(err) }
})

export default router
