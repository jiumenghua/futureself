<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { AiNotification } from '@/types'
import FsAiAvatar from './FsAiAvatar.vue'
import { X, ChevronRight } from 'lucide-vue-next'

// ============================================================
// Props
// ============================================================
interface FsAiNotificationProps {
  notification: AiNotification
  index?: number // 用于堆叠偏移
}

const props = withDefaults(defineProps<FsAiNotificationProps>(), {
  index: 0,
})

const emit = defineEmits<{
  close: [id: string]
  action: [id: string]
}>()

// ============================================================
// 自动关闭
// ============================================================
const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // 延迟一帧触发入场动画
  requestAnimationFrame(() => {
    visible.value = true
  })

  // 自动关闭
  const duration = props.notification.duration || 5000
  if (duration > 0) {
    timer = setTimeout(() => {
      close()
    }, duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

function close() {
  visible.value = false
  setTimeout(() => emit('close', props.notification.id), 300)
}

function handleAction() {
  emit('action', props.notification.id)
  close()
}

// ============================================================
// 类型 → 配置
// ============================================================
const typeConfig: Record<string, { borderColor: string; dotColor: string }> = {
  reminder:   { borderColor: 'rgba(59, 130, 246, 0.25)', dotColor: '#3B82F6' },
  suggestion: { borderColor: 'rgba(245, 158, 11, 0.25)', dotColor: '#F59E0B' },
  warning:    { borderColor: 'rgba(239, 68, 68, 0.25)',  dotColor: '#EF4444' },
  info:       { borderColor: 'rgba(34, 197, 94, 0.25)',  dotColor: '#22C55E' },
}

const config = typeConfig[props.notification.type] || typeConfig.info
</script>

<template>
  <div
    class="fs-notification"
    :class="{ 'fs-notification--visible': visible }"
    :style="{
      borderLeftColor: config.borderColor,
      bottom: `${24 + index * 8}px`,
      right: `${24 + index * 8}px`,
      zIndex: 1000 - index,
    }"
  >
    <!-- 左侧色条 -->
    <div class="fs-notification__bar" :style="{ background: config.dotColor }" />

    <!-- 内容 -->
    <div class="fs-notification__body">
      <div class="fs-notification__header">
        <FsAiAvatar size="sm" :show-status-dot="false" />
        <span class="fs-notification__title">{{ notification.title }}</span>
        <button class="fs-notification__close" @click="close">
          <X :size="13" />
        </button>
      </div>
      <p class="fs-notification__message">{{ notification.message }}</p>

      <!-- 操作按钮 -->
      <button
        v-if="notification.action"
        class="fs-notification__action"
        @click="handleAction"
      >
        <span>{{ notification.action.label }}</span>
        <ChevronRight :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   FsAiNotification — AI 主动提醒弹窗
   右下角滑入 · 自动关闭 · 堆叠支持
   ============================================================ */

.fs-notification {
  position: fixed;
  width: 340px;
  display: flex;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-left: 3px solid var(--fs-brand-400);
  border-radius: var(--fs-radius-lg);
  box-shadow: var(--fs-shadow-lg);
  overflow: hidden;
  opacity: 0;
  transform: translateX(20px) translateY(10px) scale(0.95);
  transition: all 300ms var(--fs-ease-spring);
  pointer-events: none;
}
.fs-notification--visible {
  opacity: 1;
  transform: translateX(0) translateY(0) scale(1);
  pointer-events: auto;
}

/* 左侧色条 */
.fs-notification__bar {
  width: 3px;
  flex-shrink: 0;
  border-radius: 0 2px 2px 0;
}

/* 内容区 */
.fs-notification__body {
  flex: 1;
  padding: 14px 16px;
  min-width: 0;
}

/* Header */
.fs-notification__header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.fs-notification__title {
  flex: 1;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--fs-neutral-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fs-notification__close {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--fs-neutral-400);
  border-radius: var(--fs-radius-sm);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 100ms;
}
.fs-notification__close:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-600);
}

/* Message */
.fs-notification__message {
  font-size: 13px;
  color: var(--fs-neutral-600);
  line-height: 1.55;
  margin-left: 42px;
  margin-bottom: 0;
}

/* Action */
.fs-notification__action {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 10px;
  margin-left: 42px;
  padding: 4px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fs-brand-500);
  background: var(--fs-brand-50);
  border: none;
  border-radius: var(--fs-radius-sm);
  cursor: pointer;
  transition: all 150ms;
}
.fs-notification__action:hover {
  background: var(--fs-brand-100);
}
</style>
