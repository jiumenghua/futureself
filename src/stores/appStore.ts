import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AiStatus, AiMood, AiInsight, UserProfile } from '@/types'
import type { NotificationItem } from '@/api/notifications'
import type { GrowthProfile } from '@/api/profile'
import { getProfile } from '@/api/profile'
import { getNotifications, markAllRead as apiMarkAllRead, markRead as apiMarkRead, deleteNotification as apiDeleteNotification } from '@/api/notifications'
import { mockProfile } from '@/mock/profile'

const DEFAULT_USER_ID = 'user_demo_001'

export const useAppStore = defineStore('app', () => {
  // ==================== AI 生命状态 ====================
  const aiStatus = ref<AiStatus>('idle')
  const aiMood = ref<AiMood>('default')

  /** AI 实时状态文字 */
  const aiStatusText = computed(() => {
    const statusMap: Record<AiStatus, string> = {
      idle:     '正在陪伴你…',
      thinking: '正在分析中…',
      insight:  '有新发现！',
      sleeping: '休息中…',
    }
    return statusMap[aiStatus.value]
  })

  // ==================== 用户 ====================
  const user = ref<UserProfile | null>({
    id: DEFAULT_USER_ID,
    name: '思源',
    avatar: '',
    university: mockProfile.school,
    major: mockProfile.major,
    grade: mockProfile.grade,
    joinDate: '2025-03-15',
  })

  // ==================== AI 成长档案 ====================
  const profile = ref<GrowthProfile | null>({ ...mockProfile })
  const profileVersion = ref(1)   // 变更信号，组件 watch 此值实现自动刷新
  const profileLoading = ref(false)

  // ==================== AI 洞见 ====================
  const insights = ref<AiInsight[]>([])
  const unreadInsightCount = computed(() =>
    insights.value.filter(i => !i.isRead).length
  )

  // ==================== AI 悬浮球 ====================
  const isBallOpen = ref(false)

  // ==================== 页面级元信息（供 TopBar 动态读取） ====================
  const pageMeta = ref<{ title?: string; subtitle?: string }>({})

  // ==================== Mock 状态轮换（模拟 AI 生命感） ====================
  let statusTimer: ReturnType<typeof setInterval> | null = null

  const statusSequence: { status: AiStatus; mood: AiMood; duration: number }[] = [
    { status: 'idle',     mood: 'default',  duration: 8000 },
    { status: 'thinking', mood: 'default',  duration: 4000 },
    { status: 'idle',     mood: 'relaxed',  duration: 6000 },
    { status: 'thinking', mood: 'default',  duration: 3000 },
    { status: 'insight',  mood: 'excited',  duration: 5000 },
    { status: 'idle',     mood: 'happy',    duration: 10000 },
  ]

  let seqIndex = 0

  function startAiLifecycle() {
    if (statusTimer) return
    // 首次加载时拉取用户档案
    refreshProfile(DEFAULT_USER_ID)
    const tick = () => {
      const step = statusSequence[seqIndex % statusSequence.length]
      aiStatus.value = step.status
      aiMood.value = step.mood
      seqIndex++
      statusTimer = setTimeout(tick, step.duration)
    }
    tick()
  }

  function stopAiLifecycle() {
    if (statusTimer) {
      clearTimeout(statusTimer)
      statusTimer = null
    }
  }

  // ==================== Actions ====================
  function setAiStatus(status: AiStatus) {
    aiStatus.value = status
  }

  function setAiMood(mood: AiMood) {
    aiMood.value = mood
  }

  function toggleBall() {
    isBallOpen.value = !isBallOpen.value
  }

  function markInsightRead(id: string) {
    const ins = insights.value.find(i => i.id === id)
    if (ins && !ins.isRead) {
      ins.isRead = true
    }
  }

  // ============================================================
  // 演示用：3 条静态通知假数据（纯前端模拟，用于录屏演示）
  // ============================================================
  const DEMO_NOTIFICATIONS: NotificationItem[] = [
    { _id: 'demo_n1', userId: DEFAULT_USER_ID, type: 'study', title: '学习休息提示', content: '已经连续学习 40 分钟，记得起身活动', isRead: false, relatedPath: '', createdAt: new Date().toISOString() },
    { _id: 'demo_n2', userId: DEFAULT_USER_ID, type: 'diet', title: '午餐提醒', content: '今日天热，推荐食堂清淡窗口', isRead: false, relatedPath: '', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
    { _id: 'demo_n3', userId: DEFAULT_USER_ID, type: 'schedule', title: '考试临近', content: '数字电路期末考试还有 3 天', isRead: false, relatedPath: '/journey', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  ]

  // ==================== 通知中心 ====================
  const notifications = ref<NotificationItem[]>([...DEMO_NOTIFICATIONS])
  const isNotificationPanelOpen = ref(false)
  const isLoadingNotifications = ref(false)

  /** 铃铛角标 = 通知未读数量（演示数据默认 3） */
  const unreadNotificationCount = computed(() =>
    notifications.value.filter(n => !n.isRead).length
  )

  async function loadNotifications() {
    isLoadingNotifications.value = true
    try {
      const apiData = await getNotifications(DEFAULT_USER_ID)
      // 演示用：API 无数据时保留演示通知，不清空
      if (apiData.length > 0) {
        notifications.value = apiData
      }
    } catch { /* 保留演示数据 */ }
    isLoadingNotifications.value = false
  }

  function toggleNotificationPanel() {
    isNotificationPanelOpen.value = !isNotificationPanelOpen.value
    // 展开时自动标记全部已读
    if (isNotificationPanelOpen.value && unreadNotificationCount.value > 0) {
      apiMarkAllRead(DEFAULT_USER_ID)
      notifications.value.forEach(n => { n.isRead = true })
    }
  }

  function closeNotificationPanel() {
    isNotificationPanelOpen.value = false
  }

  async function markAllNotificationsRead() {
    await apiMarkAllRead(DEFAULT_USER_ID)
    notifications.value.forEach(n => { n.isRead = true })
  }

  async function markNotificationRead(id: string) {
    await apiMarkRead(DEFAULT_USER_ID, id)
    const n = notifications.value.find(x => x._id === id)
    if (n) n.isRead = true
  }

  // ==================== 饭点气泡提醒 ====================
  const mealBubbleMessage = ref('')
  const showMealBubble = ref(false)
  let mealBubbleTimer: ReturnType<typeof setTimeout> | null = null

  function triggerMealBubble(message: string) {
    mealBubbleMessage.value = message
    showMealBubble.value = true
    if (mealBubbleTimer) clearTimeout(mealBubbleTimer)
    mealBubbleTimer = setTimeout(() => {
      showMealBubble.value = false
    }, 30000)  // 30 秒自动收起
  }

  function dismissMealBubble() {
    showMealBubble.value = false
    if (mealBubbleTimer) clearTimeout(mealBubbleTimer)
  }

  // ============================================================
  // 演示用：情绪关怀气泡提醒（F4 弹窗「想休息一下」触发）
  // ============================================================
  const emotionBubbleMessage = ref('')
  const showEmotionBubble = ref(false)
  let emotionBubbleTimer: ReturnType<typeof setTimeout> | null = null

  function triggerEmotionBubble(message: string) {
    emotionBubbleMessage.value = message
    showEmotionBubble.value = true
    if (emotionBubbleTimer) clearTimeout(emotionBubbleTimer)
    emotionBubbleTimer = setTimeout(() => {
      showEmotionBubble.value = false
    }, 30000)  // 演示用模拟逻辑：30 秒自动消失
  }

  function dismissEmotionBubble() {
    showEmotionBubble.value = false
    if (emotionBubbleTimer) clearTimeout(emotionBubbleTimer)
  }

  // ============================================================
  // 主动轮询气泡（后台通知驱动）
  // ============================================================
  const proactiveBubbleMessage = ref('')
  const showProactiveBubble = ref(false)
  const proactiveNotifyId = ref<string | null>(null)       // 当前气泡对应的通知 ID
  const proactiveNotifyType = ref<string | null>(null)      // 当前气泡对应的通知类型
  let proactiveBubbleTimer: ReturnType<typeof setTimeout> | null = null

  function triggerProactiveBubble(message: string, notifyId?: string, notifyType?: string) {
    proactiveBubbleMessage.value = message
    proactiveNotifyId.value = notifyId || null
    proactiveNotifyType.value = notifyType || null
    showProactiveBubble.value = true
    if (proactiveBubbleTimer) clearTimeout(proactiveBubbleTimer)
    proactiveBubbleTimer = setTimeout(() => {
      showProactiveBubble.value = false
    }, 30000)  // 30 秒自动消失
  }

  function dismissProactiveBubble() {
    showProactiveBubble.value = false
    if (proactiveBubbleTimer) clearTimeout(proactiveBubbleTimer)
  }

  /** 删除当前主动气泡对应的通知（从数据库删除） */
  async function deleteProactiveNotification() {
    const id = proactiveNotifyId.value
    if (id) {
      await apiDeleteNotification(DEFAULT_USER_ID, id)
      proactiveNotifyId.value = null
    }
    showProactiveBubble.value = false
    if (proactiveBubbleTimer) clearTimeout(proactiveBubbleTimer)
  }

  // ============================================================
  // 久坐提醒：再学10分钟推迟信号
  // ============================================================
  /** 久坐提醒推迟剩余秒数（>0 表示正在推迟），由 FsLayout 活动检测消费 */
  const sedentaryDeferSeconds = ref(0)

  function setSedentaryDefer(seconds: number) {
    sedentaryDeferSeconds.value = seconds
  }

  function setPageMeta(meta: { title?: string; subtitle?: string }) {
    pageMeta.value = meta
  }

  /** 从后端刷新成长档案（聊天结束后自动调用） */
  async function refreshProfile(userId: string) {
    profileLoading.value = true
    try {
      const data = await getProfile(userId)
      if (data) {
        profile.value = data
      } else {
        // DB 离线时降级到 mock 数据
        console.warn('[appStore] API 返回空，使用 mock 数据兜底')
        profile.value = { ...mockProfile }
      }
    } catch {
      // 网络异常时也降级到 mock
      console.warn('[appStore] API 异常，使用 mock 数据兜底')
      profile.value = { ...mockProfile }
    }

    // 无论数据来源，只要有 profile 就同步用户信息和版本号
    if (profile.value) {
      profileVersion.value++
      if (!user.value) {
        user.value = {
          id: userId,
          name: '思源',
          avatar: '',
          university: profile.value.school,
          major: profile.value.major,
          grade: profile.value.grade,
          joinDate: '2025-03-15',
        }
      } else {
        user.value.university = profile.value.school || user.value.university
        user.value.major = profile.value.major || user.value.major
        user.value.grade = profile.value.grade || user.value.grade
      }
    }
    profileLoading.value = false
  }

  return {
    // state
    aiStatus,
    aiMood,
    aiStatusText,
    user,
    insights,
    unreadInsightCount,
    isBallOpen,
    pageMeta,
    // 成长档案
    profile,
    profileVersion,
    profileLoading,
    refreshProfile,
    // 通知中心
    notifications,
    isNotificationPanelOpen,
    isLoadingNotifications,
    unreadNotificationCount,
    loadNotifications,
    toggleNotificationPanel,
    closeNotificationPanel,
    markAllNotificationsRead,
    markNotificationRead,
    // 饭点气泡
    mealBubbleMessage,
    showMealBubble,
    triggerMealBubble,
    dismissMealBubble,
    // 演示用：情绪关怀气泡
    emotionBubbleMessage,
    showEmotionBubble,
    triggerEmotionBubble,
    dismissEmotionBubble,
    // 演示用：主动轮询气泡
    proactiveBubbleMessage,
    showProactiveBubble,
    proactiveNotifyId,
    proactiveNotifyType,
    triggerProactiveBubble,
    dismissProactiveBubble,
    deleteProactiveNotification,
    sedentaryDeferSeconds,
    setSedentaryDefer,
    // actions
    setAiStatus,
    setAiMood,
    toggleBall,
    markInsightRead,
    setPageMeta,
    startAiLifecycle,
    stopAiLifecycle,
  }
})
