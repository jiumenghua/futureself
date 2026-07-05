<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import type { Component } from 'vue'

interface FsButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: Component
  iconPosition?: 'left' | 'right'
  block?: boolean
}

const props = withDefaults(defineProps<FsButtonProps>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconPosition: 'left',
  block: false,
})

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    class="fs-btn"
    :class="[
      `fs-btn--${variant}`,
      `fs-btn--${size}`,
      {
        'fs-btn--block': block,
        'fs-btn--loading': loading,
        'fs-btn--disabled': disabled,
      },
    ]"
    :disabled="isDisabled"
  >
    <!-- Loading spinner -->
    <Loader2 v-if="loading" :size="size === 'xs' ? 14 : 16" class="fs-btn__spinner" />

    <!-- 左侧图标 -->
    <component
      v-else-if="icon && iconPosition === 'left'"
      :is="icon"
      :size="size === 'xs' ? 14 : size === 'sm' ? 15 : 17"
      class="fs-btn__icon"
    />

    <span v-if="!loading" class="fs-btn__text"><slot /></span>

    <!-- 右侧图标 -->
    <component
      v-if="!loading && icon && iconPosition === 'right'"
      :is="icon"
      :size="size === 'xs' ? 14 : size === 'sm' ? 15 : 17"
      class="fs-btn__icon"
    />
  </button>
</template>

<style scoped>
/* ============================================================
   FsButton — 全局按钮组件
   ============================================================ */

.fs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: var(--fs-font-sans);
  font-weight: 600;
  border: none;
  border-radius: var(--fs-radius-md);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
  white-space: nowrap;
  user-select: none;
  position: relative;
  overflow: hidden;
}
.fs-btn:active:not(:disabled) {
  transform: scale(0.97);
}
.fs-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* ===== Sizes ===== */
.fs-btn--xs { height: 28px; padding: 0 12px; font-size: 12px; border-radius: var(--fs-radius-sm); }
.fs-btn--sm { height: 36px; padding: 0 16px; font-size: 14px; }
.fs-btn--md { height: 44px; padding: 0 24px; font-size: 15px; }
.fs-btn--lg { height: 52px; padding: 0 32px; font-size: 17px; }

/* ===== Block ===== */
.fs-btn--block { width: 100%; }

/* ===== Primary ===== */
.fs-btn--primary {
  color: #ffffff;
  background: var(--fs-ai-gradient);
}
.fs-btn--primary:hover:not(:disabled) {
  opacity: 0.92;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
  transform: translateY(-1px);
}

/* ===== Secondary ===== */
.fs-btn--secondary {
  color: var(--fs-neutral-700);
  background: var(--fs-neutral-100);
  border: 1px solid var(--fs-neutral-200);
}
.fs-btn--secondary:hover:not(:disabled) {
  background: var(--fs-neutral-200);
}

/* ===== Ghost ===== */
.fs-btn--ghost {
  color: var(--fs-neutral-600);
  background: transparent;
}
.fs-btn--ghost:hover:not(:disabled) {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-800);
}

/* ===== Danger ===== */
.fs-btn--danger {
  color: #ffffff;
  background: var(--fs-error-500);
}
.fs-btn--danger:hover:not(:disabled) {
  background: #DC2626;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

/* ===== Loading spinner ===== */
.fs-btn__spinner {
  animation: btn-spin 0.8s linear infinite;
}
@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

/* ===== Icon ===== */
.fs-btn__icon {
  flex-shrink: 0;
}
.fs-btn__text {
  line-height: 1;
}
</style>
