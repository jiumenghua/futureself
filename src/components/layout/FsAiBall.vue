<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
import { useRouter } from 'vue-router'
import {
  MessageCircleHeart, CalendarCheck, Sprout, UtensilsCrossed,
  Sparkles, X,
} from 'lucide-vue-next'
import { computed } from 'vue'
import type { AiQuickAction } from '@/types'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'

const store = useAppStore()
const router = useRouter()

// ============================================================
// 快捷操作
// ============================================================
const quickActions: AiQuickAction[] = [
  { id: 'chat',    label: '去聊天',   icon: 'MessageCircleHeart', action: '/chat' },
  { id: 'today',   label: '今日安排', icon: 'CalendarCheck',       action: '/today' },
  { id: 'journey', label: '今日成长', icon: 'Sprout',              action: '/journey' },
  { id: 'food',    label: '饮食建议', icon: 'UtensilsCrossed',     action: '/today' },
]

// 图标映射
const iconComponent = (iconName: string) => {
  const map: Record<string, any> = {
    MessageCircleHeart, CalendarCheck, Sprout, UtensilsCrossed,
  }
  return map[iconName] || Sparkles
}

// ============================================================
// AI 心情 → 快捷菜单头部文字
// ============================================================
const menuGreeting = computed(() => {
  const greetings: Record<string, string> = {
    happy:    '今天感觉不错！',
    excited:  '有好消息分享给你！',
    worried:  '我在关注着你…',
    tired:    '辛苦了，休息一下？',
    relaxed:  '放松也是一种成长',
    default:  '我能帮你什么？',
  }
  return greetings[store.aiMood] || greetings.default
})

// ============================================================
// Actions
// ============================================================
function handleAction(action: AiQuickAction) {
  router.push(action.action)
  store.toggleBall()
}
</script>

<template>
  <div class="ai-ball-wrapper">
    <!-- ========== 快捷菜单 ========== -->
    <transition name="ball-menu">
      <div v-if="store.isBallOpen" class="ai-ball-menu">
        <!-- 头部：AI 头像 + 问候 -->
        <div class="ai-ball-menu__header">
          <FsAiAvatar :size="'sm'" :mood="store.aiMood" :status="store.aiStatus" />
          <span class="ai-ball-menu__greeting">{{ menuGreeting }}</span>
          <button class="ai-ball-menu__close" @click="store.toggleBall()" aria-label="关闭菜单">
            <X :size="14" stroke-width="2" />
          </button>
        </div>

        <!-- 快捷操作列表 -->
        <div class="ai-ball-menu__items">
          <button
            v-for="action in quickActions"
            :key="action.id"
            class="ai-ball-menu__item"
            @click="handleAction(action)"
          >
            <component :is="iconComponent(action.icon)" :size="18" stroke-width="1.75" />
            <span>{{ action.label }}</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ========== 悬浮球 ========== -->
    <button
      class="ai-ball"
      :class="{
        'ai-ball--open': store.isBallOpen,
        'ai-ball--insight': store.aiStatus === 'insight',
        'ai-ball--thinking': store.aiStatus === 'thinking',
      }"
      @click="store.toggleBall()"
      aria-label="FutureSelf AI"
    >
      <!-- 关闭态：AI 头像 -->
      <span v-if="!store.isBallOpen" class="ai-ball__avatar-wrap">
        <FsAiAvatar
          :size="'md'"
          :mood="store.aiMood"
          :status="store.aiStatus"
          :show-pulse="store.aiStatus === 'thinking'"
          :show-status-dot="true"
        />
      </span>

      <!-- 打开态：X -->
      <Sparkles v-else :size="22" stroke-width="2" class="ai-ball__icon-open" />

      <!-- 未读标记 -->
      <span
        v-if="store.unreadInsightCount > 0 && !store.isBallOpen"
        class="ai-ball__badge"
      >
        {{ store.unreadInsightCount }}
      </span>
    </button>
  </div>
</template>

<style scoped>
/* ============================================================
   FsAiBall — AI 悬浮球 + 快捷菜单
   固定右下角 · 所有页面可见
   ============================================================ */

.ai-ball-wrapper {
  position: fixed;
  right: 24px;
  bottom: 32px;
  z-index: 200;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 12px;
}

/* ===== 悬浮球 ===== */
.ai-ball {
  width: 52px;
  height: 52px;
  border-radius: var(--fs-radius-full);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  padding: 0;
  transition: all 300ms var(--fs-ease-spring);
  box-shadow: none;
}
.ai-ball:hover {
  transform: scale(1.08);
}
.ai-ball:active {
  transform: scale(0.95);
}
.ai-ball--open {
  background: var(--fs-neutral-0);
  box-shadow: var(--fs-shadow-lg);
  border: 1px solid var(--fs-neutral-200);
}
.ai-ball--thinking {
  animation: ball-breathe 2s ease-in-out infinite;
}
.ai-ball--insight {
  animation: ball-glow 2s ease-in-out infinite;
}

.ai-ball__avatar-wrap {
  display: flex;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.35));
  transition: filter 300ms;
}
.ai-ball--insight .ai-ball__avatar-wrap {
  filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.45));
}

.ai-ball__icon-open {
  color: var(--fs-brand-500);
}

/* 未读标记 */
.ai-ball__badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: var(--fs-error-500);
  border-radius: var(--fs-radius-full);
  border: 2px solid #ffffff;
  padding: 0 5px;
  z-index: 3;
  line-height: 1;
}

/* ===== 快捷菜单 ===== */
.ai-ball-menu {
  width: 240px;
  background: var(--fs-neutral-0);
  border-radius: var(--fs-radius-lg);
  box-shadow: var(--fs-shadow-lg);
  border: 1px solid var(--fs-neutral-200);
  overflow: hidden;
}

/* 菜单头部 */
.ai-ball-menu__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--fs-neutral-100);
}
.ai-ball-menu__greeting {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-600);
}
.ai-ball-menu__close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--fs-neutral-400);
  border-radius: var(--fs-radius-sm);
  cursor: pointer;
  transition: all 100ms;
  flex-shrink: 0;
}
.ai-ball-menu__close:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-600);
}

/* 菜单项 */
.ai-ball-menu__items {
  padding: 6px;
}
.ai-ball-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--fs-neutral-700);
  border-radius: var(--fs-radius-md);
  cursor: pointer;
  transition: all 150ms var(--fs-ease-out);
  font-family: var(--fs-font-sans);
}
.ai-ball-menu__item:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-brand-500);
}

/* ===== 菜单动画 ===== */
.ball-menu-enter-active {
  animation: menu-in 250ms var(--fs-ease-spring) both;
}
.ball-menu-leave-active {
  animation: menu-out 150ms var(--fs-ease-out) both;
}
@keyframes menu-in {
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes menu-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.9); }
}

/* ===== 悬浮球动画 ===== */
@keyframes ball-breathe {
  0%, 100% { filter: drop-shadow(0 4px 14px rgba(59, 130, 246, 0.35)); }
  50%      { filter: drop-shadow(0 4px 22px rgba(59, 130, 246, 0.55)); }
}
@keyframes ball-glow {
  0%, 100% { filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.45)); }
  50%      { filter: drop-shadow(0 4px 26px rgba(245, 158, 11, 0.65)); }
}
</style>
