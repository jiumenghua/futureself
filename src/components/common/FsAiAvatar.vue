<script setup lang="ts">
import { computed } from 'vue'
import type { AiMood, AiStatus } from '@/types'

// ============================================================
// Props
// ============================================================
interface FsAiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  mood?: AiMood
  status?: AiStatus
  showPulse?: boolean
  showStatusDot?: boolean
}

const props = withDefaults(defineProps<FsAiAvatarProps>(), {
  size: 'md',
  mood: 'default',
  status: 'idle',
  showPulse: false,
  showStatusDot: true,
})

// ============================================================
// 尺寸映射
// ============================================================
const sizeMap: Record<string, { avatar: number; inner: number; stroke: number }> = {
  sm:  { avatar: 32, inner: 14, stroke: 1.5 },
  md:  { avatar: 40, inner: 20, stroke: 2 },
  lg:  { avatar: 56, inner: 28, stroke: 2.5 },
  xl:  { avatar: 80, inner: 40, stroke: 3 },
}

const dims = computed(() => sizeMap[props.size])

// ============================================================
// 心情 → 渐变映射
// ============================================================
const moodGradient = computed(() => {
  const gradients: Record<AiMood, string> = {
    default:  'linear-gradient(135deg, #3B82F6, #60A5FA, #93C5FD)',
    happy:    'linear-gradient(135deg, #3B82F6, #60A5FA, #818CF8)',
    excited:  'linear-gradient(135deg, #4F46E5, #7C3AED, #A78BFA)',
    worried:  'linear-gradient(135deg, #6366F1, #8B5CF6, #A5B4FC)',
    tired:    'linear-gradient(135deg, #64748B, #94A3B8, #CBD5E1)',
    relaxed:  'linear-gradient(135deg, #0EA5E9, #38BDF8, #7DD3FC)',
  }
  return gradients[props.mood]
})

// ============================================================
// 心情 → 中心图案（SVG inner 区域）
// 抽象几何表达，非写实脸
// ============================================================

interface FaceGeometry {
  leftEye: string   // SVG path d
  rightEye: string
  centerPiece: string
  accent?: string
}

const faceGeometry = computed<FaceGeometry>(() => {
  const s = dims.value.inner
  const cx = s / 2
  const cy = s / 2
  const r = s * 0.16

  // 两眼间距
  const eyeY = cy - s * 0.12
  const eyeGap = s * 0.22

  const geometries: Record<AiMood, FaceGeometry> = {
    // ---- 默认：平静的两个圆 ----
    default: {
      leftEye:  `M ${cx - eyeGap - r} ${eyeY} A ${r} ${r} 0 1 1 ${cx - eyeGap + r} ${eyeY} A ${r} ${r} 0 1 1 ${cx - eyeGap - r} ${eyeY} Z`,
      rightEye: `M ${cx + eyeGap - r} ${eyeY} A ${r} ${r} 0 1 1 ${cx + eyeGap + r} ${eyeY} A ${r} ${r} 0 1 1 ${cx + eyeGap - r} ${eyeY} Z`,
      centerPiece: '',
    },

    // ---- 开心：向上弯的弧线（笑眼） ----
    happy: {
      leftEye:  `M ${cx - eyeGap - r - 1} ${eyeY + 2} Q ${cx - eyeGap} ${eyeY - r - 1} ${cx - eyeGap + r + 1} ${eyeY + 2}`,
      rightEye: `M ${cx + eyeGap - r - 1} ${eyeY + 2} Q ${cx + eyeGap} ${eyeY - r - 1} ${cx + eyeGap + r + 1} ${eyeY + 2}`,
      centerPiece: '',
      accent:   `M ${cx - 3} ${cy + r + 2} Q ${cx} ${cy + r + 4} ${cx + 3} ${cy + r + 2}`, // 微笑
    },

    // ---- 兴奋：略大圆 + 右上角小星点 ----
    excited: {
      leftEye:  `M ${cx - eyeGap - r - 0.5} ${eyeY} A ${r + 0.5} ${r + 0.5} 0 1 1 ${cx - eyeGap + r + 0.5} ${eyeY} A ${r + 0.5} ${r + 0.5} 0 1 1 ${cx - eyeGap - r - 0.5} ${eyeY} Z`,
      rightEye: `M ${cx + eyeGap - r - 0.5} ${eyeY} A ${r + 0.5} ${r + 0.5} 0 1 1 ${cx + eyeGap + r + 0.5} ${eyeY} A ${r + 0.5} ${r + 0.5} 0 1 1 ${cx + eyeGap - r - 0.5} ${eyeY} Z`,
      centerPiece: '',
      accent:   `M ${cx + eyeGap + r + 2} ${eyeY - r - 1} L ${cx + eyeGap + r + 4} ${eyeY - r - 3} M ${cx + eyeGap + r + 2} ${eyeY - r - 3} L ${cx + eyeGap + r + 4} ${eyeY - r - 5}`, // 右上小星
    },

    // ---- 担心：向内微倾 ----
    worried: {
      leftEye:  `M ${cx - eyeGap - r - 1} ${eyeY + 1} Q ${cx - eyeGap} ${eyeY - r - 1} ${cx - eyeGap + r + 1} ${eyeY - 1}`,
      rightEye: `M ${cx + eyeGap - r - 1} ${eyeY - 1} Q ${cx + eyeGap} ${eyeY - r - 1} ${cx + eyeGap + r + 1} ${eyeY + 1}`,
      centerPiece: '',
    },

    // ---- 疲惫：扁椭圆（半闭眼） ----
    tired: {
      leftEye:  `M ${cx - eyeGap - r} ${eyeY} A ${r} ${r * 0.45} 0 1 1 ${cx - eyeGap + r} ${eyeY} A ${r} ${r * 0.45} 0 1 1 ${cx - eyeGap - r} ${eyeY} Z`,
      rightEye: `M ${cx + eyeGap - r} ${eyeY} A ${r} ${r * 0.45} 0 1 1 ${cx + eyeGap + r} ${eyeY} A ${r} ${r * 0.45} 0 1 1 ${cx + eyeGap - r} ${eyeY} Z`,
      centerPiece: '',
    },

    // ---- 放松：更宽间距的柔和圆 ----
    relaxed: {
      leftEye:  `M ${cx - eyeGap - r - 1} ${eyeY} A ${r * 0.85} ${r * 0.85} 0 1 1 ${cx - eyeGap + r - 1} ${eyeY} A ${r * 0.85} ${r * 0.85} 0 1 1 ${cx - eyeGap - r - 1} ${eyeY} Z`,
      rightEye: `M ${cx + eyeGap - r + 1} ${eyeY} A ${r * 0.85} ${r * 0.85} 0 1 1 ${cx + eyeGap + r + 1} ${eyeY} A ${r * 0.85} ${r * 0.85} 0 1 1 ${cx + eyeGap - r + 1} ${eyeY} Z`,
      centerPiece: '',
    },
  }
  return geometries[props.mood]
})

// ============================================================
// 状态：是否有外层脉冲环
// ============================================================
const hasPulseRing = computed(() =>
  props.showPulse || props.status === 'thinking'
)

const statusDotColor = computed(() => {
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
    class="fs-ai-avatar"
    :class="[
      `fs-ai-avatar--${size}`,
      { 'fs-ai-avatar--pulse': hasPulseRing },
      { 'fs-ai-avatar--sleeping': status === 'sleeping' },
    ]"
    :style="{ width: dims.avatar + 'px', height: dims.avatar + 'px' }"
  >
    <!-- 外层脉冲环（thinking 态） -->
    <span
      v-if="hasPulseRing"
      class="fs-ai-avatar__pulse-ring"
    />

    <!-- 主圆形容器 -->
    <svg
      class="fs-ai-avatar__svg"
      :width="dims.avatar"
      :height="dims.avatar"
      :viewBox="`0 0 ${dims.avatar} ${dims.avatar}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 渐变色圆形底 -->
      <defs>
        <linearGradient :id="'avatar-grad-' + size" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="50%" stop-color="#60A5FA" />
          <stop offset="100%" stop-color="#93C5FD" />
        </linearGradient>
      </defs>

      <!-- 底圆 -->
      <circle
        :cx="dims.avatar / 2"
        :cy="dims.avatar / 2"
        :r="dims.avatar / 2 - 1"
        :fill="`url(#avatar-grad-${size})`"
      />

      <!-- 内层几何图案：表情区域 -->
      <g
        :transform="`translate(${(dims.avatar - dims.inner) / 2}, ${(dims.avatar - dims.inner) / 2})`"
        fill="none"
        :stroke="'rgba(255,255,255,0.9)'"
        :stroke-width="dims.stroke * 0.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- 左眼 -->
        <path :d="faceGeometry.leftEye" />
        <!-- 右眼 -->
        <path :d="faceGeometry.rightEye" />
        <!-- 中心装饰 -->
        <path v-if="faceGeometry.centerPiece" :d="faceGeometry.centerPiece" />
        <!-- 辅助装饰（笑容/星点） -->
        <path
          v-if="faceGeometry.accent"
          :d="faceGeometry.accent"
          :stroke="'rgba(255,255,255,0.65)'"
          :stroke-width="dims.stroke * 0.5"
        />
      </g>
    </svg>

    <!-- 状态圆点（右下角） -->
    <span
      v-if="showStatusDot && status !== 'sleeping'"
      class="fs-ai-avatar__status-dot"
      :style="{ background: statusDotColor }"
    />

    <!-- 睡眠态：整体降低饱和度 -->
    <div v-if="status === 'sleeping'" class="fs-ai-avatar__sleep-overlay" />
  </div>
</template>

<style scoped>
/* ============================================================
   FsAiAvatar — FutureSelf AI 头像
   几何抽象风格 · 渐变圆形 · 6 种心情 · 4 种状态
   ============================================================ */

.fs-ai-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--fs-radius-full);
  transition: transform 300ms var(--fs-ease-spring);
}

/* ---- 尺寸 ---- */
.fs-ai-avatar--sm  { /* 32px default */ }
.fs-ai-avatar--md  { /* 40px default */ }
.fs-ai-avatar--lg  { /* 56px default */ }
.fs-ai-avatar--xl  { /* 80px default */ }

/* ---- SVG ---- */
.fs-ai-avatar__svg {
  display: block;
  border-radius: var(--fs-radius-full);
  position: relative;
  z-index: 1;
}

/* ===== 脉冲环（thinking 状态） ===== */
.fs-ai-avatar__pulse-ring {
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 2px solid rgba(59, 130, 246, 0.35);
  animation: avatar-pulse 2s ease-in-out infinite;
  z-index: 0;
}

@keyframes avatar-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.12);
    opacity: 0;
  }
}

/* ===== 状态圆点 ===== */
.fs-ai-avatar__status-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-radius: var(--fs-radius-full);
  border: 2px solid #ffffff;
  z-index: 3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ===== 睡眠态蒙层 ===== */
.fs-ai-avatar__sleep-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.45);
  z-index: 2;
  pointer-events: none;
}

.fs-ai-avatar--sleeping .fs-ai-avatar__svg {
  filter: grayscale(0.5);
}
</style>
