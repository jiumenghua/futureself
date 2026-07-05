<script setup lang="ts">
interface FsLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'default' | 'ai'
}

withDefaults(defineProps<FsLoadingProps>(), {
  size: 'md',
  variant: 'default',
})
</script>

<template>
  <div class="fs-loading" :class="[`fs-loading--${size}`, `fs-loading--${variant}`]">
    <!-- AI 专属加载动画 -->
    <div v-if="variant === 'ai'" class="fs-loading__ai">
      <div class="fs-loading__ai-ring" />
      <div class="fs-loading__ai-core" />
    </div>

    <!-- 默认加载动画 -->
    <div v-else class="fs-loading__dots">
      <span class="fs-loading__dot" />
      <span class="fs-loading__dot" />
      <span class="fs-loading__dot" />
    </div>

    <p v-if="text" class="fs-loading__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.fs-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

/* ===== 默认：三个跳动点 ===== */
.fs-loading__dots {
  display: flex;
  gap: 5px;
}
.fs-loading__dot {
  border-radius: var(--fs-radius-full);
  background: var(--fs-brand-400);
  animation: loading-bounce 1.4s ease-in-out infinite both;
}
.fs-loading--sm .fs-loading__dot { width: 6px; height: 6px; }
.fs-loading--md .fs-loading__dot { width: 8px; height: 8px; }
.fs-loading--lg .fs-loading__dot { width: 10px; height: 10px; }

.fs-loading__dot:nth-child(2) { animation-delay: 0.2s; }
.fs-loading__dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes loading-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1; }
}

/* ===== AI 专属：环 + 核心 ===== */
.fs-loading__ai {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fs-loading--sm .fs-loading__ai { width: 24px; height: 24px; }
.fs-loading--md .fs-loading__ai { width: 36px; height: 36px; }
.fs-loading--lg .fs-loading__ai { width: 48px; height: 48px; }

.fs-loading__ai-ring {
  position: absolute;
  inset: 0;
  border-radius: var(--fs-radius-full);
  border: 2px solid rgba(59, 130, 246, 0.15);
  border-top-color: var(--fs-brand-500);
  animation: ai-ring-spin 1s linear infinite;
}
.fs-loading__ai-core {
  width: 35%;
  height: 35%;
  border-radius: var(--fs-radius-full);
  background: var(--fs-brand-500);
  animation: ai-core-pulse 1.5s ease-in-out infinite;
}
@keyframes ai-ring-spin { to { transform: rotate(360deg); } }
@keyframes ai-core-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.3); opacity: 1; }
}

/* ===== 文字 ===== */
.fs-loading__text {
  font-size: 13px;
  color: var(--fs-neutral-500);
  font-weight: 500;
}
</style>
