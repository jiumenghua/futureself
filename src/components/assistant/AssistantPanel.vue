<script setup lang="ts">
// ============================================================
// AssistantPanel.vue — FutureSelf 快捷面板
// 点击悬浮头像展开，340px 毛玻璃卡片
// ============================================================

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAssistantStore } from '@/stores/assistantStore'
import {
  MessageCircleHeart,
  CalendarCheck,
  BookOpen,
  ChefHat,
  TrendingUp,
  User,
  Sparkles,
} from 'lucide-vue-next'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'

const router = useRouter()
const store = useAssistantStore()

// ---- 根据时间生成问候语 ----
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了 🌙'
  if (hour < 9) return '早上好 ☀️'
  if (hour < 12) return '上午好 🌤️'
  if (hour < 14) return '中午好 ☀️'
  if (hour < 18) return '下午好 👋'
  if (hour < 21) return '晚上好 🌆'
  return '夜深了 🌙'
})

// ---- 操作列表 ----
interface PanelAction {
  id: string
  label: string
  icon: typeof MessageCircleHeart
  route: string
  emoji?: string
}

const actions: PanelAction[] = [
  { id: 'chat', label: '聊天', icon: MessageCircleHeart, route: '/chat', emoji: '💬' },
  { id: 'today', label: '今日安排', icon: CalendarCheck, route: '/today', emoji: '📅' },
  { id: 'study', label: '学习计划', icon: BookOpen, route: '/journey', emoji: '📚' },
  { id: 'food', label: '今日饮食', icon: ChefHat, route: '/today', emoji: '🍚' },
  { id: 'growth', label: '成长分析', icon: TrendingUp, route: '/journey', emoji: '🌱' },
  { id: 'me', label: '我的成长', icon: User, route: '/me', emoji: '👤' },
]

function navigate(route: string) {
  router.push(route)
  store.closePanel()
}

function close() {
  store.closePanel()
}
</script>

<template>
  <div class="ap">
    <!-- 头部：问候 -->
    <div class="ap__header">
      <div class="ap__header-left">
        <FsAiAvatar :size="'sm'" :mood="'happy'" :show-status-dot="true" />
        <div class="ap__header-text">
          <div class="ap__header-name">FutureSelf</div>
          <div class="ap__header-greeting">
            <Sparkles :size="11" />
            <span>{{ greeting }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作列表 -->
    <div class="ap__actions">
      <button
        v-for="action in actions"
        :key="action.id"
        class="ap__action-item"
        @click="navigate(action.route)"
      >
        <span class="ap__action-emoji">{{ action.emoji }}</span>
        <span class="ap__action-label">{{ action.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   AssistantPanel — 快捷面板样式
   毛玻璃 · 24px 圆角 · 柔和阴影
   ============================================================ */

.ap {
  width: 340px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 24px;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.04),
    0 8px 48px rgba(19, 22, 54, 0.12);
  overflow: hidden;
}

/* ---- 头部 ---- */
.ap__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.06);
}

.ap__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap__header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap__header-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.01em;
}

.ap__header-greeting {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--fs-brand-500);
}

/* ---- 操作列表 ---- */
.ap__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 8px;
}

.ap__action-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--fs-neutral-700);
  border-radius: 14px;
  cursor: pointer;
  transition: all 150ms var(--fs-ease-out);
  font-family: var(--fs-font-sans);
  text-align: left;
}

.ap__action-item:hover {
  background: rgba(59, 130, 246, 0.06);
  color: var(--fs-brand-600);
}

.ap__action-emoji {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.ap__action-label {
  white-space: nowrap;
}
</style>
