<script setup lang="ts">
import { computed } from 'vue'

interface FsProgressProps {
  value: number       // 0–100
  variant?: 'default' | 'ai' | 'success'
  size?: 'sm' | 'md'
  showLabel?: boolean
  animated?: boolean
  label?: string
}

const props = withDefaults(defineProps<FsProgressProps>(), {
  variant: 'default',
  size: 'md',
  showLabel: false,
  animated: false,
})

const clampedValue = computed(() => Math.max(0, Math.min(100, props.value)))

const barGradient = computed(() => {
  if (props.variant === 'ai') return 'var(--fs-ai-gradient)'
  if (props.variant === 'success') return 'linear-gradient(135deg, #22C55E, #4ADE80)'
  return 'linear-gradient(135deg, #3B82F6, #60A5FA)'
})
</script>

<template>
  <div class="fs-progress" :class="`fs-progress--${size}`">
    <!-- Label -->
    <div v-if="showLabel || label" class="fs-progress__header">
      <span v-if="label" class="fs-progress__label">{{ label }}</span>
      <span v-if="showLabel" class="fs-progress__value">{{ clampedValue }}%</span>
    </div>

    <!-- 轨道 -->
    <div class="fs-progress__track">
      <div
        class="fs-progress__bar"
        :class="{ 'fs-progress__bar--animated': animated }"
        :style="{
          width: clampedValue + '%',
          background: barGradient,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.fs-progress {
  width: 100%;
}

.fs-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.fs-progress__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-600);
}
.fs-progress__value {
  font-size: 12px;
  font-weight: 600;
  color: var(--fs-neutral-500);
}

/* Track */
.fs-progress__track {
  width: 100%;
  background: var(--fs-neutral-200);
  border-radius: var(--fs-radius-full);
  overflow: hidden;
}
.fs-progress--sm .fs-progress__track { height: 4px; }
.fs-progress--md .fs-progress__track { height: 6px; }

/* Bar */
.fs-progress__bar {
  height: 100%;
  border-radius: var(--fs-radius-full);
  transition: width 500ms var(--fs-ease-out);
  position: relative;
}
.fs-progress__bar--animated::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: progress-shine 2s ease-in-out infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
