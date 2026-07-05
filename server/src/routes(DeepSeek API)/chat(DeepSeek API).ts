// ============================================================
// chat.ts — 聊天路由 🔗 [调用DeepSeek API]
// ============================================================
// GET  /api/chat/search      — 搜索聊天记录（含会话名）
// POST /api/chat/upload      — 文件上传 + AI 分析
// ============================================================

import { Router, Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { ChatRecord, ChatSession, User, UserProfile } from '../models'
import type { IUserProfile } from '../models/userProfile'
import { chatCompletion, chatWithImage, chatWithDocument, generateConversationTitle, detectCalendarIntent, extractCalendarEvent, extractGrowthProfile, analyzeEmotion, generateProactiveMessage } from '../services(DeepSeek API)/deepseek(DeepSeek API)'
import { CalendarEvent } from '../models/CalendarEvent'
import { Notification } from '../models/Notification'
import { getConnectionState } from '../db'
import { validateRequest, throwError } from '../middleware/errorHandler'
import type { ChatMessage } from '../types'

const router = Router()
const dbOnline = () => getConnectionState()

// ---- 文件上传配置 ----
const UPLOAD_DIR = path.resolve(__dirname, '../../static/upload')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.txt', '.docx']
const MAX_FILE_SIZE = 10 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuid()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_EXT.includes(ext)) return cb(new Error('不支持的文件格式'))
    cb(null, true)
  },
})

// ---- 工具 ----
function truncate(text: string, maxLen: number): string {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}

/** Fire-and-forget: 从多轮对话提取成长档案并增量更新 userProfile */
async function extractAndSaveProfile(userId: string): Promise<void> {
  try {
    // 1. 获取最近 5 轮对话（10 条消息）
    const recentRecords = await ChatRecord.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
    if (recentRecords.length === 0) return

    const chatHistory = recentRecords.reverse().map((r) => ({
      role: r.role as 'user' | 'assistant',
      content: r.content,
    }))

    // 2. 查询当前画像
    let profile = await UserProfile.findOne({ userId })

    // 首次聊天自动创建画像文档
    if (!profile) {
      profile = await UserProfile.create({ userId })
    }

    // 3. 构建 currentProfile 供 extractGrowthProfile 使用
    const currentProfile = {
      baseInfo: {
        school: profile.baseInfo?.school || '',
        major: profile.baseInfo?.major || '',
        grade: profile.baseInfo?.grade || '',
      },
      goals: profile.goals?.map((g) => g.content) || [],
      learningDetails: profile.learningProfile?.details || [],
      dietDetails: profile.dietProfile?.details || [],
      personalityDetails: profile.personalityProfile?.details || [],
      discoveryContents: profile.recentDiscoveries?.map((d) => d.content) || [],
    }

    // 4. 调用 AI 提取
    const extracted = await extractGrowthProfile(chatHistory, currentProfile)

    // 5. 检查是否有实际更新
    const hasUpdates =
      extracted.baseInfo ||
      extracted.newGoals?.length ||
      extracted.learningAdd?.length ||
      extracted.dietAdd?.length ||
      extracted.personalityAdd?.length ||
      extracted.newDiscoveries?.length

    if (!hasUpdates) return

    // 6. 增量更新 userProfile
    const now = new Date()

    // baseInfo 更新（空字段不覆盖）
    if (extracted.baseInfo) {
      const bi = extracted.baseInfo
      if (bi.school) profile.baseInfo.school = bi.school
      if (bi.major) profile.baseInfo.major = bi.major
      if (bi.grade) profile.baseInfo.grade = bi.grade
      // AI 提取的置信度设为 0.7
      if (bi.school || bi.major || bi.grade) {
        profile.baseInfo.confidence = Math.max(profile.baseInfo.confidence, 0.7)
      }
    }

    // goals：$addToSet 去重，跳过 source=manual 的项
    if (extracted.newGoals?.length) {
      const manualContents = new Set(
        profile.goals.filter((g) => g.source === 'manual').map((g) => g.content)
      )
      const newGoals = extracted.newGoals
        .filter((g) => !manualContents.has(g))
        .filter((g) => !profile.goals.some((existing) => existing.content === g))
        .map((g) => ({ content: g, createdAt: now, source: 'auto' as const }))
      if (newGoals.length > 0) {
        profile.goals.push(...newGoals)
      }
    }

    // 各维度 details：$addToSet 去重
    const addToDetails = (dim: 'learningProfile' | 'dietProfile' | 'personalityProfile', newItems?: string[]) => {
      if (!newItems?.length) return
      const existing = new Set(profile[dim].details)
      const additions = newItems.filter((item) => !existing.has(item))
      if (additions.length > 0) {
        profile[dim].details.push(...additions)
        profile[dim].updatedAt = now
      }
    }
    addToDetails('learningProfile', extracted.learningAdd)
    addToDetails('dietProfile', extracted.dietAdd)
    addToDetails('personalityProfile', extracted.personalityAdd)

    // recentDiscoveries：头部插入，保留最近 5 条，最新 3 条 isNew
    if (extracted.newDiscoveries?.length) {
      const existingContents = new Set(profile.recentDiscoveries.map((d) => d.content))
      const newItems = extracted.newDiscoveries
        .filter((d) => !existingContents.has(d))
        .map((d) => ({ content: d, discoveredAt: now, isNew: true }))
      if (newItems.length > 0) {
        // 头部插入新条目
        profile.recentDiscoveries.unshift(...newItems)
        // 保留最近 5 条
        if (profile.recentDiscoveries.length > 5) {
          profile.recentDiscoveries = profile.recentDiscoveries.slice(0, 5)
        }
        // 前 3 条标记 isNew，其余 false
        profile.recentDiscoveries.forEach((d, i) => {
          d.isNew = i < 3
        })
      }
    }

    // 7. 跨天判断
    const today = new Date().toISOString().slice(0, 10)
    if (profile.lastChatDate !== today) {
      if (profile.lastChatDate) {
        profile.totalChatDays += 1
      }
      profile.lastChatDate = today
    }

    profile.updatedAt = now
    await profile.save()
    console.log(`[Profile] 已更新用户 ${userId} 的成长画像`)

    // 8. 同步更新 User 模型扁平字段（兼容现有 profile route）
    const flatUpdate: any = { lastProfileUpdate: now }
    if (extracted.newGoals?.length) {
      flatUpdate.$addToSet = { goals: { $each: extracted.newGoals } }
    }
    if (extracted.learningAdd?.length) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, studyProfile: { $each: extracted.learningAdd } }
    }
    if (extracted.dietAdd?.length) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, foodProfile: { $each: extracted.dietAdd } }
    }
    if (extracted.personalityAdd?.length) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, personalityProfile: { $each: extracted.personalityAdd } }
    }
    if (extracted.newDiscoveries?.length) {
      flatUpdate.$addToSet = { ...flatUpdate.$addToSet, recentDiscoveries: { $each: extracted.newDiscoveries } }
    }
    if (extracted.baseInfo) {
      const bi = extracted.baseInfo
      if (bi.school) flatUpdate.$set = { ...flatUpdate.$set, university: bi.school }
      // major/grade 在 User 中是加密的，这里不更新（profile route 从 userProfile 读）
    }
    if (Object.keys(flatUpdate).length > 1 || flatUpdate.$addToSet) {
      await User.updateOne({ userId }, flatUpdate).catch(() => {})
    }

    // 9. 情绪分析 + 主动关怀通知（fire-and-forget 内部子步骤）
    try {
      const emotionResult = await analyzeEmotion(
        chatHistory,
        profile.personalityProfile?.details || []
      )
      if (emotionResult) {
        console.log(`[Emotion] 用户 ${userId} 情绪: ${emotionResult.emotion}(${emotionResult.intensity}) shouldComfort=${emotionResult.shouldComfort}`)

        // 高危场景：shouldComfort=true 时不受每日弹窗次数限制
        if (emotionResult.shouldComfort) {
          const comfortMessage = await generateProactiveMessage(
            {
              scenario: 'emotion_comfort',
              emotion: emotionResult.emotion,
              intensity: emotionResult.intensity,
            },
            {
              school: profile.baseInfo?.school,
              learningProfile: profile.learningProfile?.details,
              dietProfile: profile.dietProfile?.details,
              personalityProfile: profile.personalityProfile?.details,
              goals: profile.goals?.map((g) => g.content),
            }
          )

          // 写入通知表
          await Notification.create({
            userId,
            type: 'emotion_comfort',
            title: '状态小提醒',
            content: comfortMessage,
            isRead: false,
            relatedPath: '',
          })
          console.log(`[Emotion] 已为用户 ${userId} 生成情绪关怀通知: ${comfortMessage.slice(0, 30)}...`)
        }
      }
    } catch { /* 情绪分析静默失败 */ }
  } catch (err) {
    console.warn('[Profile] 成长档案提取失败:', err)
  }
}

// ============================================================
// ① 新建会话（归档旧会话，全量保留，不删除）
// ============================================================
router.post('/new-session', validateRequest(['userId']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body
    const newSessionId = uuid()

    if (dbOnline()) {
      try {
        // 将当前活跃会话归档（不删除！）
        await ChatSession.updateMany(
          { userId, isActive: true },
          { $set: { isActive: false } }
        )

        // 创建新会话
        await ChatSession.create({
          userId,
          sessionId: newSessionId,
          title: '新对话',
          summary: '',
          messageCount: 0,
          isActive: true,
        })
      } catch { /* DB 降级 */ }
    }

    res.json({
      success: true, code: 0, message: 'ok',
      data: { sessionId: newSessionId },
    })
  } catch (err) { next(err) }
})

// ============================================================
// ② 获取全部会话列表（按最后消息时间倒序）
// ============================================================
router.get('/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }

    const sessions = await ChatSession.find({ userId })
      .sort({ lastMessageAt: -1 })

    res.json({ success: true, code: 0, message: 'ok', data: sessions })
  } catch (err) { next(err) }
})

// ============================================================
// ③ 发送消息（自动更新 title + summary）
// ============================================================
router.post('/send', validateRequest(['userId', 'message']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, message, conversationId, sessionId, context, fileInfo } = req.body
    const sid = sessionId || conversationId || uuid()

    // ---- 日历意图检测（在正常聊天之前） ----
    if (detectCalendarIntent(message)) {
      try {
        const extracted = await extractCalendarEvent(message)
        if (extracted) {
          // 写入数据库（DB 在线时）
          if (dbOnline()) {
            try { await CalendarEvent.create({ userId, title: extracted.title, type: extracted.type || 'custom', date: new Date(extracted.date), description: extracted.description || '', source: 'user_add', remindEnabled: true, remindDays: 3 }) } catch {}
          }

          const d = new Date(extracted.date)
          const dateLabel = `${d.getMonth() + 1}月${d.getDate()}日`
          const confirmReply = `好的～已帮你把「${extracted.title}」添加到 ${dateLabel} 的日历里啦，会提前提醒你 😉`

          res.json({
            success: true, code: 0, message: 'ok',
            data: { conversationId: sid, sessionId: sid, reply: confirmReply, timestamp: new Date().toISOString() },
          })
          return
        } else {
          const askReply = '好的，我帮你记到日历里～请问这个事件是在哪一天呢？比如「5月20日」或者「下周五」这样告诉我就可以啦 📅'
          res.json({
            success: true, code: 0, message: 'ok',
            data: { conversationId: sid, sessionId: sid, reply: askReply, timestamp: new Date().toISOString() },
          })
          return
        }
      } catch {
        // 提取失败，继续走正常聊天
      }
    }

    // ---- 正常聊天流程 ----
    // 加载历史
    let history: ChatMessage[] = []
    if (dbOnline()) {
      try {
        const rawHistory = await ChatRecord.find({
          userId,
          $or: [{ conversationId: sid }, { sessionId: sid }],
        }).sort({ timestamp: -1 }).limit(20)
        history = rawHistory.reverse().map((r) => ({
          role: r.role as 'user' | 'assistant',
          content: r.content,
        }))
      } catch { /* 降级 */ }
    }

    // 查询用户画像（带入记忆）
    let userProfile: IUserProfile | null = null
    if (dbOnline()) {
      try {
        userProfile = await UserProfile.findOne({ userId })
        // 首次聊天自动初始化画像文档
        if (!userProfile) {
          const today = new Date().toISOString().slice(0, 10)
          userProfile = await UserProfile.create({ userId, lastChatDate: today })
        }
      } catch { /* 降级 */ }
    }

    // 调用 DeepSeek（传入画像实现带记忆回复）
    const reply = await chatCompletion(history, message, context, userProfile)
    const now = new Date()

    // ---- 标题生成（不依赖 DB） ----
    let generatedTitle = ''
    if (dbOnline()) {
      const session = await ChatSession.findOne({ sessionId: sid }).catch(() => null)
      if (!session || session.title === '新对话') {
        try { generatedTitle = await generateConversationTitle(message, reply) }
        catch { generatedTitle = truncate(message, 15) }
      }
    } else {
      // DB 离线时降级为截断
      generatedTitle = truncate(message, 15)
    }

    // ---- 写入数据库 ----
    if (dbOnline()) {
      try {
        const recordData: any[] = [
          { userId, conversationId: sid, sessionId: sid, role: 'user', content: message, timestamp: now },
          { userId, conversationId: sid, sessionId: sid, role: 'assistant', content: reply, timestamp: now },
        ]
        if (fileInfo) recordData[0] = { ...recordData[0], ...fileInfo }
        await ChatRecord.create(recordData)

        const session = await ChatSession.findOne({ sessionId: sid })
        const finalTitle = generatedTitle || truncate(message, 15)

        if (session) {
          await ChatSession.updateOne(
            { sessionId: sid },
            {
              $set: {
                title: session.title === '新对话' ? finalTitle : session.title,
                summary: truncate(reply, 20),
                isActive: true,
                lastMessageAt: now,
              },
              $inc: { messageCount: 2 },
            }
          )
        } else {
          await ChatSession.create({
            userId, sessionId: sid,
            title: finalTitle,
            summary: truncate(reply, 20),
            messageCount: 2, isActive: true,
          })
        }

        await ChatSession.updateMany(
          { userId, sessionId: { $ne: sid } },
          { $set: { isActive: false } }
        )
      } catch { /* 降级 */ }
    }

    res.json({
      success: true, code: 0, message: 'ok',
      data: {
        conversationId: sid, sessionId: sid, reply,
        title: generatedTitle || undefined,
        timestamp: now.toISOString(),
      },
    })

    // ---- Fire-and-forget: 异步提取成长档案 ----
    if (dbOnline()) {
      extractAndSaveProfile(userId)
    }
  } catch (err) { next(err) }
})

// ============================================================
// ④ 获取消息历史
// ============================================================
router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, conversationId, sessionId, limit = '200' } = req.query
    if (!userId) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }

    const filter: any = { userId }
    if (conversationId) filter.conversationId = conversationId
    else if (sessionId) filter.sessionId = sessionId

    const records = await ChatRecord.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string, 10))

    res.json({ success: true, code: 0, message: 'ok', data: records.reverse() })
  } catch (err) { next(err) }
})

// ============================================================
// ⑤ 搜索聊天记录（含会话名称）
// ============================================================
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, keyword, limit = '30' } = req.query
    if (!userId || !keyword) throwError('VALIDATION_ERROR')
    if (!dbOnline()) {
      res.json({ success: true, code: 0, message: 'ok', data: [] })
      return
    }

    // 正则模糊匹配
    const records = await ChatRecord.find({
      userId,
      content: { $regex: keyword as string, $options: 'i' },
    })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string, 10))

    // 关联查询会话名称
    const sessionIds = [...new Set(records.map((r) => r.sessionId).filter(Boolean))]
    const sessions = await ChatSession.find({ sessionId: { $in: sessionIds } })
    const sessionMap = new Map(sessions.map((s) => [s.sessionId, s.title]))

    const enriched = records.map((r) => ({
      ...r.toObject(),
      sessionName: sessionMap.get(r.sessionId || '') || '未知会话',
    }))

    res.json({ success: true, code: 0, message: 'ok', data: enriched })
  } catch (err) { next(err) }
})

// ============================================================
// ⑥ 文件上传 + AI 分析
// ============================================================
router.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throwError('VALIDATION_ERROR')

    const file = req.file
    const ext = path.extname(file.originalname).toLowerCase()
    const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    const fileType = isImage ? 'image' : 'document'
    const fileUrl = `/static/upload/${file.filename}`

    let aiAnalysis = ''
    if (isImage) {
      const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`
      aiAnalysis = await chatWithImage(fullUrl, req.body.message || '请帮我看看这张图片')
    } else {
      let docText = ''
      if (ext === '.txt') {
        docText = fs.readFileSync(file.path, 'utf-8')
      } else if (ext === '.pdf') {
        try {
          const pdfParse = require('pdf-parse')
          const pdfData = await pdfParse(fs.readFileSync(file.path))
          docText = pdfData.text
        } catch { docText = '[PDF 解析失败]' }
      } else if (ext === '.docx') {
        try {
          const mammoth = require('mammoth')
          const result = await mammoth.extractRawText({ path: file.path })
          docText = result.value
        } catch { docText = '[DOCX 解析失败]' }
      }
      aiAnalysis = await chatWithDocument(docText, file.originalname, req.body.message || '')
    }

    res.json({
      success: true, code: 0, message: 'ok',
      data: { fileUrl, fileName: file.originalname, fileType, fileSize: file.size, analysis: aiAnalysis },
    })
  } catch (err) { next(err) }
})

// ============================================================
// ⑦ 删除会话（含其全部聊天记录）
// ============================================================
router.delete('/session/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params
    const { userId } = req.body
    if (!sessionId || !userId) throwError('VALIDATION_ERROR')

    if (dbOnline()) {
      try {
        await ChatSession.deleteOne({ sessionId, userId })
        await ChatRecord.deleteMany({ sessionId, userId })
      } catch { /* DB 降级 */ }
    }

    res.json({ success: true, code: 0, message: '会话已删除' })
  } catch (err) { next(err) }
})

// ============================================================
// ⑧ 重命名会话
// ============================================================
router.patch('/session/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params
    const { userId, title } = req.body
    if (!sessionId || !userId || !title) throwError('VALIDATION_ERROR')

    const trimmed = title.trim().slice(0, 30)
    if (!trimmed) throwError('VALIDATION_ERROR')

    if (dbOnline()) {
      try {
        await ChatSession.updateOne({ sessionId, userId }, { $set: { title: trimmed } })
      } catch { /* DB 降级 */ }
    }

    res.json({ success: true, code: 0, message: 'ok', data: { title: trimmed } })
  } catch (err) { next(err) }
})

export default router
