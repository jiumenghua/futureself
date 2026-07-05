<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { Bell, Settings, ChevronDown } from 'lucide-vue-next'

const route = useRoute()
const store = useAppStore()

// ---- 页面元信息（由路由 meta 提供，业务页面可通过 store 覆盖） ----
const pageMeta = computed(() => {
  const defaults: Record<string, { title: string; subtitle: string }> = {
    Today:    { title: 'Today',     subtitle: '今日概览与 AI 洞见' },
    Journey:  { title: 'Journey',   subtitle: '成长时间线与记录' },
    Discover: { title: 'Discover',  subtitle: '探索挑战与新可能' },
    Chat:     { title: 'FutureSelf',subtitle: '你的 AI 成长伙伴' },
    Me:       { title: 'Me',        subtitle: '个人中心与设置' },
  }
  return defaults[route.name as string] || { title: 'FutureSelf', subtitle: '' }
})

// ---- 时间问候 ----
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6)  return { emoji: '🌙', text: '夜深了' }
  if (hour < 9)  return { emoji: '☀️', text: '早上好' }
  if (hour < 12) return { emoji: '😊', text: '上午好' }
  if (hour < 14) return { emoji: '😎', text: '中午好' }
  if (hour < 18) return { emoji: '🌤️', text: '下午好' }
  if (hour < 22) return { emoji: '🌆', text: '晚上好' }
  return { emoji: '🌙', text: '夜深了' }
})

const userName = computed(() => store.user.name)

// ---- 实时时钟 ----
const currentTime = ref('')
let clockTimer: ReturnType<typeof setInterval> | null = null

function updateClock() {
  const now = new Date()
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<template>
  <header class="topbar">
    <!-- ====== 左侧：页面标题 + 副标题 ====== -->
    <div class="topbar__left">
      <h1 class="topbar__title">{{ pageMeta.title }}</h1>
      <p class="topbar__subtitle">{{ pageMeta.subtitle }}</p>
    </div>

    <!-- ====== 右侧：AI 问候 + 状态 + 通知 + 设置 + 头像 ====== -->
    <div class="topbar__right">
      <!-- AI 问候 + 状态文字 + 时钟 -->
      <div class="topbar__ai">
        <span class="topbar__ai-greeting">
          {{ greeting.emoji }} {{ greeting.text }}，{{ userName }}
        </span>
        <span class="topbar__ai-divider">·</span>
        <span class="topbar__ai-status" :class="{ 'topbar__ai-status--thinking': store.aiStatus === 'thinking' }">
          <span class="topbar__ai-dot" />
          {{ store.aiStatusText }}
        </span>
        <span class="topbar__ai-divider">·</span>
        <span class="topbar__clock">{{ currentTime }}</span>
      </div>

      <!-- 通知按钮 -->
      <button class="topbar__icon-btn" :class="{ 'topbar__icon-btn--active': store.isNotificationPanelOpen }" aria-label="通知" @click="store.toggleNotificationPanel()">
        <Bell :size="19" stroke-width="1.75" />
        <span v-if="store.unreadNotificationCount > 0" class="topbar__icon-badge">
          {{ store.unreadNotificationCount }}
        </span>
      </button>

      <!-- 设置按钮 -->
      <button class="topbar__icon-btn" aria-label="设置">
        <Settings :size="19" stroke-width="1.75" />
      </button>

      <!-- 用户头像 -->
      <div class="topbar__user">
        <div class="topbar__user-avatar">
          {{ userName.charAt(0) }}
        </div>
        <ChevronDown :size="14" stroke-width="2" class="topbar__user-chevron" />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ============================================================
   TopBar — 全局顶部栏
   高度：72px
   ============================================================ */

.topbar {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background: var(--fs-neutral-0);
  border-bottom: 1px solid var(--fs-neutral-200);
  flex-shrink: 0;
  z-index: 50;
}

/* ===== 左侧：标题区 ===== */
.topbar__left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.topbar__title {
  font-size: 19px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.topbar__subtitle {
  font-size: 12.5px;
  font-weight: 400;
  color: var(--fs-neutral-400);
  line-height: 1.2;
}

/* ===== 右侧 ===== */
.topbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* AI 问候区 */
.topbar__ai {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--fs-neutral-50);
  border-radius: var(--fs-radius-full);
  border: 1px solid var(--fs-neutral-200);
  margin-right: 8px;
}
.topbar__ai-greeting {
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-700);
  white-space: nowrap;
}
.topbar__ai-divider {
  color: var(--fs-neutral-300);
  font-weight: 300;
}
.topbar__ai-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--fs-neutral-500);
  white-space: nowrap;
}
.topbar__ai-status--thinking {
  color: var(--fs-brand-500);
}
.topbar__ai-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--fs-radius-full);
  background: #22C55E;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.35);
  flex-shrink: 0;
}

/* 实时时钟 */
.topbar__clock {
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-400);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  min-width: 40px;
}

.topbar__ai-status--thinking .topbar__ai-dot {
  background: var(--fs-brand-500);
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.45);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

/* 图标按钮 */
.topbar__icon-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--fs-neutral-500);
  border-radius: var(--fs-radius-md);
  cursor: pointer;
  transition: all 150ms var(--fs-ease-out);
  position: relative;
}
.topbar__icon-btn:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-700);
}
.topbar__icon-btn--active {
  background: var(--fs-brand-50);
  color: var(--fs-brand-500);
}
.topbar__icon-badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: var(--fs-error-500);
  border-radius: var(--fs-radius-full);
  border: 1.5px solid #ffffff;
  padding: 0 4px;
  line-height: 1;
}

/* 用户头像 */
.topbar__user {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  margin-left: 4px;
  border-radius: var(--fs-radius-md);
  cursor: pointer;
  transition: background 150ms var(--fs-ease-out);
}
.topbar__user:hover {
  background: var(--fs-neutral-100);
}
.topbar__user-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--fs-radius-full);
  background: var(--fs-ai-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}
.topbar__user-chevron {
  color: var(--fs-neutral-400);
  flex-shrink: 0;
}

/* 动画 */
@keyframes pulse-dot {
  0%, 100% { opacity: 1;   transform: scale(1); }
  50%      { opacity: 0.55;transform: scale(1.35); }
}
</style>
