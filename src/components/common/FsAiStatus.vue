<script setup lang="ts">
import { computed } from 'vue'
import type { AiStatus } from '@/types'
import {
  Eye, Brain, Lightbulb, Moon, Sparkles,
  BookOpen, Utensils, Activity, Star, Heart,
} from 'lucide-vue-next'

// ============================================================
// Props
// ============================================================
interface FsAiStatusProps {
  statusText: string
  status?: AiStatus
  icon?: string // 覆盖默认图标 key
  variant?: 'inline' | 'card'
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<FsAiStatusProps>(), {
  status: 'idle',
  variant: 'inline',
  size: 'md',
})

// ============================================================
// 图标映射
// ============================================================
const statusIcon = computed(() => {
  if (props.icon) {
    const iconMap: Record<string, any> = {
      book: BookOpen, food: Utensils, activity: Activity,
      star: Star, heart: Heart, brain: Brain,
      lightbulb: Lightbulb, sparkles: Sparkles,
    }
    return iconMap[props.icon] || Sparkles
  }

  const defaultIcons: Record<AiStatus, any> = {
    idle:     Eye,
    thinking: Brain,
    insight:  Lightbulb,
    sleeping: Moon,
  }
  return defaultIcons[props.status]
})

const iconSize = computed(() => props.size === 'sm' ? 14 : 16)

// ============================================================
// 状态色
// ============================================================
const statusColor = computed(() => {
  const colors: Record<AiStatus, string> = {
    idle:     '#22C55E',
    thinking: '#3B82F6',
    insight:  '#F59E0B',
    sleeping: '#94A3B8',
  }
  return colors[props.status]
})
</script>

<template>
  <div
    class="fs-ai-status"
    :class="[
      `fs-ai-status--${variant}`,
      `fs-ai-status--${size}`,
      { 'fs-ai-status--thinking': status === 'thinking' },
      { 'fs-ai-status--insight': status === 'insight' },
    ]"
  >
    <!-- 图标 + 点 -->
    <div class="fs-ai-status__icon-wrap">
      <div class="fs-ai-status__dot" :style="{ background: statusColor }" />
      <component :is="statusIcon" :size="iconSize" class="fs-ai-status__icon" />
    </div>

    <!-- 文字 -->
    <span class="fs-ai-status__text">{{ statusText }}</span>

    <!-- thinking 态：跳动点动画 -->
    <span v-if="status === 'thinking'" class="fs-ai-status__dots">
      <span class="fs-ai-status__dots-item" />
      <span class="fs-ai-status__dots-item" />
      <span class="fs-ai-status__dots-item" />
    </span>
  </div>
</template>

<style scoped>
/* ============================================================
   FsAiStatus — AI 动态状态指示器
   支持 inline / card 两种变体
   ============================================================ */

.fs-ai-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--fs-font-sans);
  transition: all 300ms var(--fs-ease-out);
}

/* ---- Variant: inline ---- */
.fs-ai-status--inline {
  padding: 6px 14px;
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-full);
}
.fs-ai-status--inline.fs-ai-status--sm {
  padding: 4px 10px;
}

/* ---- Variant: card ---- */
.fs-ai-status--card {
  padding: 14px 18px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  box-shadow: var(--fs-shadow-sm);
}
.fs-ai-status--card.fs-ai-status--thinking {
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: var(--fs-shadow-ai);
}
.fs-ai-status--card.fs-ai-status--insight {
  border-color: rgba(245, 158, 11, 0.25);
}

/* ---- 图标区域 ---- */
.fs-ai-status__icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fs-ai-status__dot {
  position: absolute;
  top: -2px;
  right: -3px;
  width: 6px;
  height: 6px;
  border-radius: var(--fs-radius-full);
  border: 1.5px solid #ffffff;
  z-index: 1;
}
.fs-ai-status--thinking .fs-ai-status__dot {
  animation: status-dot-pulse 1.5s ease-in-out infinite;
}
.fs-ai-status__icon {
  color: var(--fs-neutral-500);
}
.fs-ai-status--thinking .fs-ai-status__icon {
  color: var(--fs-brand-500);
}
.fs-ai-status--insight .fs-ai-status__icon {
  color: var(--fs-warning-500);
}

/* ---- 文字 ---- */
.fs-ai-status__text {
  color: var(--fs-neutral-600);
  white-space: nowrap;
  font-weight: 500;
}
.fs-ai-status--md .fs-ai-status__text { font-size: 13px; }
.fs-ai-status--sm .fs-ai-status__text { font-size: 12px; }
.fs-ai-status--thinking .fs-ai-status__text { color: var(--fs-brand-600); }

/* ---- 跳动点（thinking） ---- */
.fs-ai-status__dots {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: 2px;
}
.fs-ai-status__dots-item {
  width: 4px;
  height: 4px;
  border-radius: var(--fs-radius-full);
  background: var(--fs-brand-400);
  animation: dots-bounce 1.4s ease-in-out infinite both;
}
.fs-ai-status__dots-item:nth-child(2) { animation-delay: 0.2s; }
.fs-ai-status__dots-item:nth-child(3) { animation-delay: 0.4s; }

@keyframes dots-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-4px); opacity: 1; }
}

@keyframes status-dot-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50%      { transform: scale(1.5); box-shadow: 0 0 6px 2px rgba(59, 130, 246, 0.2); }
}
</style>
