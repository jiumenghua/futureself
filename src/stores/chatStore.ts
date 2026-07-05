// ============================================================
// chatStore.ts — 聊天模块共享状态（含 localStorage 降级）
// API 优先，失败时自动降级到 localStorage 缓存
// ============================================================

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  sendMessage as apiSend,
  getHistory,
  newSession as apiNewSession,
  getSessions,
  searchMessages,
  deleteSession as apiDeleteSession,
  renameSession as apiRenameSession,
} from '@/api/chat(DeepSeek API)'
import type { ChatSession, ChatRecord, SearchResult } from '@/api/chat(DeepSeek API)'
import {
  loadCachedSessions, saveCachedSessions, addCachedSession, updateCachedSession,
  loadCachedMessages, saveCachedMessages, addCachedMessage,
  type CachedMessage,
} from '@/utils/sessionCache'

export interface DisplayMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
  fileUrl?: string
  fileName?: string
  fileType?: string
}

export const useChatStore = defineStore('chat', () => {
  const DEFAULT_USER_ID = 'user_demo_001'

  // ============================================================
  // 演示用：3 条静态会话（匹配通知中心/近期提醒数据）
  // ============================================================
  const now = new Date().toISOString()
  const DEMO_SESSIONS: ChatSession[] = [
    { _id: 'demo_s1', userId: DEFAULT_USER_ID, sessionId: 'demo_s1', title: '学习休息提示', summary: '已经连续学习 40 分钟，记得起身活动', messageCount: 2, isActive: false, createdAt: now, lastMessageAt: now },
    { _id: 'demo_s2', userId: DEFAULT_USER_ID, sessionId: 'demo_s2', title: '午餐提醒', summary: '今日天热，推荐食堂清淡窗口', messageCount: 2, isActive: false, createdAt: new Date(Date.now() - 10 * 60000).toISOString(), lastMessageAt: new Date(Date.now() - 10 * 60000).toISOString() },
    { _id: 'demo_s3', userId: DEFAULT_USER_ID, sessionId: 'demo_s3', title: '考试临近', summary: '数字电路期末考试还有 3 天', messageCount: 3, isActive: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), lastMessageAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  ]

  // ==================== 会话 ====================
  const sessions = ref<ChatSession[]>([...DEMO_SESSIONS])
  const currentSessionId = ref<string>('')
  const isLoadingSessions = ref(false)

  // ==================== 消息 ====================
  const messages = ref<DisplayMessage[]>([])
  const isLoadingMessages = ref(false)
  const isSending = ref(false)
  const hasUserMessages = ref(false)

  // ==================== 搜索 ====================
  const searchKeyword = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isSearching = ref(false)
  const highlightKeyword = ref('')
  const targetMessageId = ref<string | null>(null)

  const currentSession = computed(() =>
    sessions.value.find((s) => s.sessionId === currentSessionId.value)
  )

  // ==================== 会话操作 ====================

  async function loadSessions() {
    isLoadingSessions.value = true
    try {
      const apiData = await getSessions(DEFAULT_USER_ID)
      if (apiData.length > 0) {
        sessions.value = apiData
        // 同步到缓存
        saveCachedSessions(DEFAULT_USER_ID, apiData)
        isLoadingSessions.value = false
        return
      }
    } catch { /* API 不可用 */ }

    // 降级：从 localStorage 加载
    const cached = loadCachedSessions(DEFAULT_USER_ID)
    if (cached.length > 0) {
      sessions.value = cached
    }
    // 演示用：API/localStorage 都为空时保留 DEMO_SESSIONS
    isLoadingSessions.value = false
  }

  /** 新建会话 */
  async function createSession(): Promise<string | null> {
    // 1. 先在本地创建（乐观）
    const tempId = 'local_' + Date.now()
    const now = new Date().toISOString()

    // 将旧活跃会话归档
    sessions.value.forEach((s) => { if (s.isActive) s.isActive = false })
    const newSession: ChatSession = {
      _id: tempId, userId: DEFAULT_USER_ID, sessionId: tempId,
      title: '新对话', summary: '', messageCount: 0, isActive: true,
      createdAt: now, lastMessageAt: now,
    }
    sessions.value.unshift(newSession)
    saveCachedSessions(DEFAULT_USER_ID, sessions.value)
    currentSessionId.value = tempId
    messages.value = []
    hasUserMessages.value = false

    // 2. 尝试后端创建
    try {
      const id = await apiNewSession(DEFAULT_USER_ID)
      if (id) {
        // 替换临时 ID 为真实 ID
        newSession.sessionId = id
        newSession._id = id
        currentSessionId.value = id
        saveCachedSessions(DEFAULT_USER_ID, sessions.value)
        return id
      }
    } catch { /* API 不可用，使用本地 ID */ }

    return tempId
  }

  /** 切换到指定会话 */
  async function switchToSession(sessionId: string) {
    if (sessionId === currentSessionId.value) return
    currentSessionId.value = sessionId
    highlightKeyword.value = ''
    targetMessageId.value = null

    // 确保该会话在列表中
    if (!sessions.value.find((s) => s.sessionId === sessionId)) {
      // 从缓存查找
      const cached = loadCachedSessions(DEFAULT_USER_ID)
      const found = cached.find((s) => s.sessionId === sessionId)
      if (found) {
        sessions.value.unshift(found)
        saveCachedSessions(DEFAULT_USER_ID, sessions.value)
      }
    }

    await loadMessages(sessionId)
  }

  // ==================== 消息操作 ====================

  async function loadMessages(sessionId: string) {
    isLoadingMessages.value = true
    try {
      const records = await getHistory(DEFAULT_USER_ID, sessionId, sessionId, 200)
      if (records.length > 0) {
        messages.value = records.map(mapRecord)
        hasUserMessages.value = records.some((r) => r.role === 'user')
        saveCachedMessages(sessionId, messages.value)
        isLoadingMessages.value = false
        return
      }
    } catch { /* API 不可用 */ }

    // 降级：从 localStorage 加载
    const cached = loadCachedMessages(sessionId)
    messages.value = cached
    hasUserMessages.value = cached.some((m) => m.role === 'user')
    isLoadingMessages.value = false
  }

  /** 发送消息 */
  async function sendMessage(
    text: string,
    fileInfo?: { fileUrl: string; fileName: string; fileType: string }
  ): Promise<string | null> {
    if (!text.trim() && !fileInfo) return null
    const sid = currentSessionId.value
    if (!sid) return null

    hasUserMessages.value = true
    const now = new Date().toISOString()

    // 乐观添加用户消息
    const userMsg: DisplayMessage = { id: 'user_' + Date.now(), role: 'user', content: text, timestamp: now, ...(fileInfo || {}) }
    messages.value.push(userMsg)
    addCachedMessage(sid, userMsg)

    // 更新会话摘要（本地缓存）
    const currentTitle = sessions.value.find((s) => s.sessionId === sid)?.title
    updateCachedSession(DEFAULT_USER_ID, {
      sessionId: sid,
      title: (currentTitle === '新对话' || !currentTitle) ? text.slice(0, 15) : undefined,
      summary: text.slice(0, 20),
      lastMessageAt: now,
      isActive: true,
      messageCount: (sessions.value.find((s) => s.sessionId === sid)?.messageCount || 0) + 1,
    })

    // 刷新列表（本地缓存驱动排序）
    sessions.value.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
    // 移除非活跃会话中的重复临时项
    saveCachedSessions(DEFAULT_USER_ID, sessions.value)

    isSending.value = true
    try {
      const result = await apiSend({
        userId: DEFAULT_USER_ID, message: text,
        sessionId: sid, conversationId: sid,
        context: { page: 'chat' }, fileInfo,
      })

      let reply: string
      if (result) {
        reply = result.reply
        // 用后端真实 sessionId 替换本地临时 ID
        if (result.sessionId && result.sessionId !== sid) {
          currentSessionId.value = result.sessionId
        }
        // 用 AI 生成的标题更新缓存
        if (result.title) {
          updateCachedSession(DEFAULT_USER_ID, {
            sessionId: result.sessionId || sid,
            title: result.title,
          })
          // 同步更新内存中的 sessions
          const sess = sessions.value.find((s) => s.sessionId === (result!.sessionId || sid))
          if (sess) sess.title = result.title
        }
        // 后端成功，刷新列表
        try { await loadSessions() } catch {}
      } else {
        reply = '抱歉，我现在有点走神了……能再说一次吗？😅'
      }

      const aiMsg: DisplayMessage = { id: 'ai_' + Date.now(), role: 'ai', content: reply, timestamp: new Date().toISOString() }
      messages.value.push(aiMsg)
      addCachedMessage(sid, aiMsg)

      // 延迟刷新成长档案（等后端异步提取完成）
      setTimeout(() => {
        import('@/stores/appStore').then(({ useAppStore }) => {
          useAppStore().refreshProfile(DEFAULT_USER_ID)
        })
      }, 3000)

      return reply
    } catch {
      const fallback = '网络好像不太好，稍等一下再试试吧。我一直在这里～'
      const aiMsg: DisplayMessage = { id: 'ai_error_' + Date.now(), role: 'ai', content: fallback, timestamp: new Date().toISOString() }
      messages.value.push(aiMsg)
      addCachedMessage(sid, aiMsg)
      return null
    } finally {
      isSending.value = false
    }
  }

  // ==================== 搜索 ====================

  async function doSearch(keyword: string) {
    if (!keyword.trim()) { searchResults.value = []; return }
    isSearching.value = true
    try { searchResults.value = await searchMessages(DEFAULT_USER_ID, keyword, 50) }
    catch { searchResults.value = [] }
    finally { isSearching.value = false }
  }

  async function navigateToSearchResult(result: SearchResult) {
    const sid = result.sessionId || result.conversationId
    if (!sid) return
    if (sid !== currentSessionId.value) await switchToSession(sid)
    highlightKeyword.value = searchKeyword.value
    targetMessageId.value = result._id
    searchResults.value = []
    searchKeyword.value = ''
  }

  function clearSearch() {
    searchKeyword.value = ''; searchResults.value = []
    highlightKeyword.value = ''; targetMessageId.value = null
  }

  // ==================== 删除 + 重命名 ====================

  /** 删除会话及其全部消息 */
  async function deleteSession(sessionId: string) {
    // 1. 调用后端
    try { await apiDeleteSession(DEFAULT_USER_ID, sessionId) } catch { /* 降级 */ }

    // 2. 从列表移除
    sessions.value = sessions.value.filter((s) => s.sessionId !== sessionId)
    saveCachedSessions(DEFAULT_USER_ID, sessions.value)

    // 3. 清除消息缓存
    try { localStorage.removeItem(`fs_messages_${sessionId}`) } catch {}

    // 4. 如果删除的是当前会话，切换到第一个可用会话
    if (currentSessionId.value === sessionId) {
      if (sessions.value.length > 0) {
        await switchToSession(sessions.value[0].sessionId)
      } else {
        await createSession()
      }
    }
  }

  /** 重命名会话 */
  async function renameSession(sessionId: string, title: string) {
    const trimmed = title.trim().slice(0, 30)
    if (!trimmed) return

    // 1. 乐观更新内存
    const sess = sessions.value.find((s) => s.sessionId === sessionId)
    if (sess) sess.title = trimmed

    // 2. 更新本地缓存
    updateCachedSession(DEFAULT_USER_ID, { sessionId, title: trimmed })
    saveCachedSessions(DEFAULT_USER_ID, sessions.value)

    // 3. 调用后端
    try { await apiRenameSession(DEFAULT_USER_ID, sessionId, trimmed) } catch { /* 降级 */ }
  }

  // ==================== 工具 ====================

  function mapRecord(r: ChatRecord): DisplayMessage {
    return {
      id: r._id, role: r.role === 'assistant' ? 'ai' : 'user',
      content: r.content, timestamp: r.timestamp,
      fileUrl: r.fileUrl, fileName: r.fileName, fileType: r.fileType,
    }
  }

  function formatSessionTime(dateStr: string): string {
    const d = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays === 2) return '前天'
    if (diffDays < 7) return `${diffDays} 天前`
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return {
    DEFAULT_USER_ID,
    sessions, currentSessionId, isLoadingSessions,
    messages, isLoadingMessages, isSending, hasUserMessages,
    searchKeyword, searchResults, isSearching, highlightKeyword, targetMessageId,
    currentSession,
    loadSessions, createSession, switchToSession, loadMessages, sendMessage,
    doSearch, navigateToSearchResult, clearSearch, deleteSession, renameSession,
    formatSessionTime,
  }
})
