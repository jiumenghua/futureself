<script setup lang="ts">
// ============================================================
// AssistantAvatar.vue — FutureSelf 悬浮头像球
// 独立的头像展示组件，负责呼吸/眨眼动画和交互事件
// ============================================================

import { onMounted, onUnmounted, ref } from 'vue'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'

// ---- Props ----
withDefaults(defineProps<{
  isHovering?: boolean
  isOpen?: boolean
  isDragging?: boolean
  unreadCount?: number
}>(), {
  isHovering: false,
  isOpen: false,
  isDragging: false,
  unreadCount: 0,
})

// ---- Emits ----
const emit = defineEmits<{
  pointerdown: [e: PointerEvent]
  click: []
  dblclick: []
  contextmenu: [e: MouseEvent]
}>()

// ============================================================
// 呼吸动画 — 约 4 秒一个周期
// ============================================================
const breathePhase = ref(false)
let breatheTimer: ReturnType<typeof setInterval>

onMounted(() => {
  breatheTimer = setInterval(() => {
    breathePhase.value = true
    setTimeout(() => {
      breathePhase.value = false
    }, 2000)
  }, 4000)
})

onUnmounted(() => {
  clearInterval(breatheTimer)
})

// ============================================================
// 眨眼动画 — 8~15 秒随机
// ============================================================
const isBlinking = ref(false)
let blinkTimer: ReturnType<typeof setTimeout>

function scheduleBlink() {
  const delay = 8000 + Math.random() * 7000
  blinkTimer = setTimeout(() => {
    isBlinking.value = true
    setTimeout(() => {
      isBlinking.value = false
    }, 180)
    scheduleBlink()
  }, delay)
}

onMounted(() => scheduleBlink())
onUnmounted(() => clearTimeout(blinkTimer))

// ============================================================
// 点击处理（区分单/双击）
// ============================================================
let clickTimer: ReturnType<typeof setTimeout>

function handlePointerdown(e: PointerEvent) {
  emit('pointerdown', e)
}

function handleClick() {
  clearTimeout(clickTimer)
  clickTimer = setTimeout(() => {
    emit('click')
  }, 220)
}

function handleDblClick() {
  clearTimeout(clickTimer)
  emit('dblclick')
}

function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  emit('contextmenu', e)
}
</script>

<template>
  <div
    class="aa-ball"
    :class="{
      'aa-ball--open': isOpen,
      'aa-ball--breathe': breathePhase && !isDragging && !isHovering,
      'aa-ball--blink': isBlinking,
      'aa-ball--hover': isHovering && !isDragging,
    }"
    @pointerdown="handlePointerdown"
    @click="handleClick"
    @dblclick="handleDblClick"
    @contextmenu="handleContextMenu"
  >
    <!-- AI 头像 -->
    <span class="aa-ball__avatar">
      <FsAiAvatar
        :size="'md'"
        :mood="'happy'"
        :status="'idle'"
        :show-pulse="false"
        :show-status-dot="true"
      />
    </span>

    <!-- 未读徽章 -->
    <span v-if="unreadCount > 0 && !isOpen" class="aa-ball__badge">
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </span>

    <!-- Hover 光晕 -->
    <span class="aa-ball__glow" />
  </div>
</template>

<style scoped>
/* ============================================================
   AssistantAvatar — 悬浮头像球样式
   ============================================================ */

.aa-ball {
  width: 52px;
  height: 52px;
  border-radius: var(--fs-radius-full);
  cursor: grab;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              filter 300ms var(--fs-ease-out),
              box-shadow 300ms var(--fs-ease-out);
  flex-shrink: 0;
  user-select: none;
  z-index: 1;
}

.aa-ball:active {
  cursor: grabbing;
}

/* ---- Hover 放大 + 光晕 ---- */
.aa-ball--hover {
  transform: scale(1.08);
  filter: drop-shadow(0 8px 28px rgba(59, 130, 246, 0.35));
}

.aa-ball--hover .aa-ball__glow {
  opacity: 1;
}

/* ---- 展开态阴影 ---- */
.aa-ball--open {
  filter: drop-shadow(0 4px 18px rgba(59, 130, 246, 0.28));
}

/* ---- 呼吸动画 ---- */
.aa-ball--breathe {
  animation: aa-breathe 2s ease-in-out;
}

@keyframes aa-breathe {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-5px) scale(1.03);
  }
  60% {
    transform: translateY(0) scale(1);
  }
}

/* ---- 眨眼动画 ---- */
.aa-ball--blink :deep(.fs-ai-avatar__svg) {
  animation: aa-blink 0.18s ease-in-out;
}

@keyframes aa-blink {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.12);
  }
}

/* ---- 头像容器 ---- */
.aa-ball__avatar {
  position: relative;
  z-index: 2;
}

/* ---- 蓝色光晕 ---- */
.aa-ball__glow {
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(59, 130, 246, 0.04) 60%,
    transparent 100%
  );
  z-index: 0;
  opacity: 0;
  transition: opacity 300ms var(--fs-ease-out);
  pointer-events: none;
}

/* ---- 未读徽章 ---- */
.aa-ball__badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: var(--fs-error-500);
  border-radius: var(--fs-radius-full);
  border: 2px solid #fff;
  padding: 0 5px;
  z-index: 4;
  line-height: 1;
}
</style>
