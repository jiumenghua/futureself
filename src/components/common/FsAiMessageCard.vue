<script setup lang="ts">
import { computed } from 'vue'
import type { AiMood, InsightType } from '@/types'
import FsAiAvatar from './FsAiAvatar.vue'
import {
  BookOpen, Heart, Lightbulb, ChefHat, TrendingUp,
  ChevronRight, Sparkles,
} from 'lucide-vue-next'

// ============================================================
// Props
// ============================================================
interface FsAiMessageCardProps {
  title: string
  content: string
  type?: InsightType
  mood?: AiMood
  actionLabel?: string
  createdAt?: string
  isNew?: boolean
}

const props = withDefaults(defineProps<FsAiMessageCardProps>(), {
  type: 'suggestion',
  mood: 'default',
  isNew: false,
})

const emit = defineEmits<{
  action: []
  dismiss: []
}>()

// ============================================================
// 类型 → 图标 + 颜色
// ============================================================
const typeMeta = computed(() => {
  const meta: Record<InsightType, { icon: any; color: string; label: string }> = {
    learning:   { icon: BookOpen,   color: '#3B82F6', label: '学习洞见' },
    life:       { icon: Heart,      color: '#EC4899', label: '生活关怀' },
    emotion:    { icon: Sparkles,   color: '#8B5CF6', label: '情绪感知' },
    suggestion: { icon: Lightbulb,  color: '#F59E0B', label: 'AI 建议' },
    summary:    { icon: TrendingUp, color: '#22C55E', label: '成长总结' },
  }
  return meta[props.type]
})

// ============================================================
// 格式化的时间
// ============================================================
const formattedTime = computed(() => {
  if (!props.createdAt) return ''
  const date = new Date(props.createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} 小时前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
})
</script>

<template>
  <div
    class="fs-ai-card"
    :class="{
      'fs-ai-card--new': isNew,
    }"
  >
    <!-- ========== 顶部：类型标签 + 时间 ========== -->
    <div class="fs-ai-card__header">
      <div class="fs-ai-card__type" :style="{ color: typeMeta.color }">
        <component :is="typeMeta.icon" :size="14" />
        <span>{{ typeMeta.label }}</span>
      </div>
      <span v-if="formattedTime" class="fs-ai-card__time">{{ formattedTime }}</span>
    </div>

    <!-- ========== AI 头像 + 主内容 ========== -->
    <div class="fs-ai-card__body">
      <FsAiAvatar :size="'sm'" :mood="mood" :show-status-dot="false" />
      <div class="fs-ai-card__text">
        <h4 class="fs-ai-card__title">{{ title }}</h4>
        <p class="fs-ai-card__content">{{ content }}</p>
      </div>
    </div>

    <!-- ========== 操作区 ========== -->
    <div v-if="actionLabel" class="fs-ai-card__actions">
      <button class="fs-ai-card__action-btn" @click="emit('action')">
        <span>{{ actionLabel }}</span>
        <ChevronRight :size="15" />
      </button>
    </div>

    <!-- ========== 新消息辉光条（顶部） ========== -->
    <div v-if="isNew" class="fs-ai-card__glow-bar" />
  </div>
</template>

<style scoped>
/* ============================================================
   FsAiMessageCard — AI 消息/洞见卡片
   全站统一的 AI 消息样式
   ============================================================ */

.fs-ai-card {
  position: relative;
  padding: 18px 20px;
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFBFF 100%);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: var(--fs-radius-lg);
  transition: all 250ms var(--fs-ease-out);
  overflow: hidden;
}

/* 新消息辉光 */
.fs-ai-card--new {
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: var(--fs-shadow-ai);
  animation: card-glow-in 500ms var(--fs-ease-out) both;
}

.fs-ai-card:hover {
  border-color: rgba(59, 130, 246, 0.2);
  box-shadow: var(--fs-shadow-ai);
  transform: translateY(-1px);
}

/* ===== 顶部辉光条 ===== */
.fs-ai-card__glow-bar {
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.7;
}

/* ===== Header ===== */
.fs-ai-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.fs-ai-card__type {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  text-transform: none;
}
.fs-ai-card__time {
  font-size: 11.5px;
  color: var(--fs-neutral-400);
  font-weight: 400;
}

/* ===== Body ===== */
.fs-ai-card__body {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.fs-ai-card__text {
  flex: 1;
  min-width: 0;
}
.fs-ai-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fs-neutral-800);
  margin-bottom: 6px;
  line-height: 1.4;
  letter-spacing: -0.01em;
}
.fs-ai-card__content {
  font-size: 14.5px;
  font-weight: 400;
  color: var(--fs-neutral-600);
  line-height: 1.65;
  max-width: 100%;
}

/* ===== Actions ===== */
.fs-ai-card__actions {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--fs-neutral-100);
}
.fs-ai-card__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--fs-brand-500);
  background: var(--fs-brand-50);
  border: none;
  border-radius: var(--fs-radius-md);
  cursor: pointer;
  transition: all 150ms var(--fs-ease-out);
}
.fs-ai-card__action-btn:hover {
  background: var(--fs-brand-100);
  color: var(--fs-brand-600);
}

/* ===== 入场动画 ===== */
@keyframes card-glow-in {
  from {
    opacity: 0;
    transform: translateY(8px);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    box-shadow: var(--fs-shadow-ai);
  }
}
</style>
