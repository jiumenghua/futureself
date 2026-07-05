<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import FsSidebar from './FsSidebar.vue'
import FsTopBar from './FsTopBar.vue'
import { FloatingAssistant } from '@/components/assistant'
import FsNotificationContainer from '@/components/common/FsNotificationContainer.vue'
import NotificationModal from '@/components/common/NotificationModal.vue'
import NotificationCenter from '@/components/notification/NotificationCenter.vue'
import MealReminderModal from '@/components/common/MealReminderModal.vue'
import EmotionCareModal from '@/components/common/EmotionCareModal.vue'
import DemoFloatingButton from '@/components/common/DemoFloatingButton.vue'
import { useAppStore } from '@/stores/appStore'
import { generateDiet } from '@/api/diet(DeepSeek API)'
import { getUnreadNotifications, batchMarkRead } from '@/api/notifications'
import { reportBehavior } from '@/api/behavior(DeepSeek API)'

const store = useAppStore()
const DEFAULT_USER_ID = 'user_demo_001'

// ---- 前端饭点提醒 ----
let mealCheckTimer: ReturnType<typeof setInterval> | null = null
const checkedMeals = ref<Set<string>>(new Set())

async function checkMealTime() {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const currentHM = `${hh}:${mm}`
  const today = now.toISOString().slice(0, 10)

  if (checkedMeals.value.size > 0) {
    const firstKey = [...checkedMeals.value][0]
    if (firstKey && !firstKey.startsWith(today)) checkedMeals.value = new Set()
  }

  const mealTimes: Array<{ meal: string; time: string }> = [
    { meal: 'breakfast', time: '07:30' },
    { meal: 'lunch',     time: '12:00' },
    { meal: 'dinner',    time: '18:00' },
  ]

  for (const { meal, time } of mealTimes) {
    if (Math.abs(timeToMinutes(currentHM) - timeToMinutes(time)) <= 2) {
      const key = `${today}_${meal}`
      if (checkedMeals.value.has(key)) continue
      checkedMeals.value.add(key)
      try {
        const result = await generateDiet(DEFAULT_USER_ID, meal)
        if (result && result.reminder) {
          store.triggerMealBubble(result.reminder)
        }
      } catch { /* 静默失败 */ }
    }
  }
}

function timeToMinutes(hm: string): number {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

// ---- 3 秒轮询：拉取未读通知并自动弹窗 ----
let notifyPollTimer: ReturnType<typeof setInterval> | null = null
const shownNotifyIds = ref<Set<string>>(new Set())  // 已展示过的通知 ID

async function pollUnreadNotifications() {
  try {
    const unread = await getUnreadNotifications(DEFAULT_USER_ID)
    if (!unread.length) return

    const popupTypes = ['emotion_comfort', 'sedentary_remind']
    const toMarkRead: string[] = []

    for (const notif of unread) {
      // 去重：同一条通知不重复弹
      if (shownNotifyIds.value.has(notif._id)) continue

      if (popupTypes.includes(notif.type)) {
        // 主动弹窗，传入通知类型以区分按钮展示
        store.triggerProactiveBubble(notif.content, notif._id, notif.type)
        shownNotifyIds.value.add(notif._id)
        toMarkRead.push(notif._id)
      }
    }

    // 弹窗后批量标记已读
    if (toMarkRead.length > 0) {
      await batchMarkRead(DEFAULT_USER_ID, toMarkRead)
    }

    // 清理已读的 ID（防止 Set 无限增长）
    const allReadIds = unread.filter((n) => n.isRead).map((n) => n._id)
    allReadIds.forEach((id) => shownNotifyIds.value.delete(id))
  } catch { /* 静默失败 */ }
}

// ============================================================
// 页面活动检测：连续学习 45 分钟 → 上报久坐行为
// ============================================================
const SEDENTARY_DURATION = 45 * 60 * 1000  // 45 分钟（毫秒）
let sedentaryTimer: ReturnType<typeof setTimeout> | null = null
let sedentaryStartTime = 0                   // 当前计时区间起点

/** 重置活动倒计时（有用户活动时调用） */
function resetActivityTimer(delayMs?: number) {
  if (sedentaryTimer) clearTimeout(sedentaryTimer)

  // 若「再学10分钟」推迟模式 → 使用推迟时长
  if (store.sedentaryDeferSeconds > 0) {
    const deferMs = store.sedentaryDeferSeconds * 1000
    store.setSedentaryDefer(0)
    sedentaryStartTime = Date.now()
    sedentaryTimer = setTimeout(triggerSedentaryReport, deferMs)
    return
  }

  // 正常模式：若已过 45 分钟则立即触发，否则开始新一轮
  const elapsed = sedentaryStartTime > 0 ? Date.now() - sedentaryStartTime : 0
  if (elapsed >= SEDENTARY_DURATION) {
    triggerSedentaryReport()
  } else {
    const remaining = SEDENTARY_DURATION - elapsed
    sedentaryTimer = setTimeout(triggerSedentaryReport, remaining > 0 ? remaining : SEDENTARY_DURATION)
  }
}

/** 到达 45 分钟 → 调用行为上报接口 */
async function triggerSedentaryReport() {
  const result = await reportBehavior(DEFAULT_USER_ID, 'sedentary_45min')
  // 无论是否推送，都重置计时器重新开始
  sedentaryStartTime = Date.now()
  // 如果被拒绝（冷却/上限/免打扰），静默重新计时
  if (!result.notified) {
    sedentaryTimer = setTimeout(triggerSedentaryReport, SEDENTARY_DURATION)
    return
  }
  // 通知已写入，轮询会在 3 秒内弹窗
  sedentaryTimer = setTimeout(triggerSedentaryReport, SEDENTARY_DURATION)
}

/** 页面可见性变化：隐藏时暂停计时，恢复时重新计算 */
function handleVisibilityChange() {
  if (document.hidden) {
    // 页面隐藏 → 暂停计时
    if (sedentaryTimer) {
      clearTimeout(sedentaryTimer)
      sedentaryTimer = null
    }
  } else {
    // 页面恢复 → 若之前有计时则重新计算剩余时间
    if (sedentaryStartTime > 0) {
      resetActivityTimer()
    }
  }
}

/** 用户活动事件处理 */
let activityInitialized = false

function startActivityDetection() {
  if (activityInitialized) return
  activityInitialized = true

  // 活动事件
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
  const onActivity = () => {
    if (sedentaryStartTime === 0) {
      sedentaryStartTime = Date.now()
      sedentaryTimer = setTimeout(triggerSedentaryReport, SEDENTARY_DURATION)
    } else {
      resetActivityTimer()
    }
  }

  activityEvents.forEach((evt) => {
    document.addEventListener(evt, onActivity, { passive: true })
  })

  // 页面可见性
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

function stopActivityDetection() {
  if (sedentaryTimer) clearTimeout(sedentaryTimer)
  activityInitialized = false
}

onMounted(() => {
  store.startAiLifecycle()
  // 饭点检查
  mealCheckTimer = setInterval(checkMealTime, 60000)
  setTimeout(checkMealTime, 5000)
  // 通知轮询
  notifyPollTimer = setInterval(pollUnreadNotifications, 3000)
  // 启动时立即拉取一次
  setTimeout(pollUnreadNotifications, 2000)
  // 页面活动检测
  startActivityDetection()
  // 进入时弹出欢迎气泡
  setTimeout(() => {
    store.triggerProactiveBubble('嗨～欢迎回来！今天有什么需要我帮忙的吗？😊')
  }, 1500)
})
onUnmounted(() => {
  store.stopAiLifecycle()
  if (mealCheckTimer) clearInterval(mealCheckTimer)
  if (notifyPollTimer) clearInterval(notifyPollTimer)
  stopActivityDetection()
})
</script>

<template>
  <div class="fs-layout">
    <!-- 侧边栏 -->
    <FsSidebar />

    <!-- 主区域 -->
    <div class="fs-main">
      <!-- 顶部状态栏 -->
      <FsTopBar />

      <!-- 内容区（仅此区域滚动） -->
      <main class="fs-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- AI 悬浮助手 -->
    <FloatingAssistant />

    <!-- AI 通知容器（Toast 风格，保留兼容） -->
    <FsNotificationContainer />

    <!-- AI 主动提醒弹窗（Modal 风格） -->
    <NotificationModal />

    <!-- 通知中心面板（铃铛下拉） -->
    <NotificationCenter />

    <!-- 演示用：饭点提醒弹窗（U 键触发） -->
    <MealReminderModal />

    <!-- 演示用：情绪关怀弹窗（F4 键触发） -->
    <EmotionCareModal />

    <!-- 答辩演示悬浮按钮（全局常驻） -->
    <DemoFloatingButton />
  </div>
</template>

<style scoped>
.fs-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--fs-surface-page);
}

.fs-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: var(--fs-sidebar-width);
  min-width: 0;
  height: 100vh;
  overflow: hidden;
}

.fs-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px 32px 40px;
}

/* ===== 页面切换动画 ===== */
.page-enter-active {
  animation: page-enter 300ms var(--fs-ease-out) both;
}
.page-leave-active {
  animation: page-leave 150ms var(--fs-ease-out) both;
}

@keyframes page-enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes page-leave {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>
