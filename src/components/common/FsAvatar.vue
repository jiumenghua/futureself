<script setup lang="ts">
import { computed } from 'vue'

interface FsAvatarProps {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy' | 'ai' | 'none'
  isAI?: boolean
}

const props = withDefaults(defineProps<FsAvatarProps>(), {
  size: 'md',
  status: 'none',
  isAI: false,
})

const sizeMap: Record<string, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 72,
}

const avatarSize = computed(() => sizeMap[props.size])
const fontSize = computed(() => Math.round(avatarSize.value * 0.4) + 'px')
const initials = computed(() => props.name.charAt(0).toUpperCase())

const statusColor = computed(() => {
  const colors: Record<string, string> = {
    online:  '#22C55E',
    offline: '#94A3B8',
    busy:    '#EF4444',
    ai:      '#3B82F6',
  }
  return colors[props.status] || 'transparent'
})
</script>

<template>
  <div
    class="fs-avatar"
    :class="`fs-avatar--${size}`"
    :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"
  >
    <!-- 图片模式 -->
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="fs-avatar__img"
    />

    <!-- 文字模式 -->
    <span
      v-else
      class="fs-avatar__text"
      :class="{ 'fs-avatar__text--ai': isAI }"
      :style="{ fontSize }"
    >
      {{ initials }}
    </span>

    <!-- 状态点 -->
    <span
      v-if="status !== 'none'"
      class="fs-avatar__status"
      :class="`fs-avatar__status--${status}`"
      :style="{ background: statusColor }"
    />
  </div>
</template>

<style scoped>
.fs-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--fs-radius-full);
  flex-shrink: 0;
  overflow: hidden;
  background: var(--fs-neutral-200);
}

.fs-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fs-avatar__text {
  font-weight: 600;
  color: var(--fs-neutral-600);
  line-height: 1;
  user-select: none;
}
.fs-avatar__text--ai {
  color: #ffffff;
  background: var(--fs-ai-gradient);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 状态点 */
.fs-avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: var(--fs-radius-full);
  border: 2px solid #ffffff;
}
.fs-avatar--xs .fs-avatar__status { width: 7px; height: 7px; }
.fs-avatar--sm .fs-avatar__status { width: 8px; height: 8px; }
.fs-avatar--xl .fs-avatar__status { width: 14px; height: 14px; border-width: 3px; }
</style>
