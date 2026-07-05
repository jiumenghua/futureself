<script setup lang="ts">
import { X } from 'lucide-vue-next'

interface FsTagProps {
  variant?: 'default' | 'brand' | 'success' | 'warning'
  size?: 'sm' | 'md'
  closable?: boolean
}

withDefaults(defineProps<FsTagProps>(), {
  variant: 'default',
  size: 'sm',
  closable: false,
})

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <span
    class="fs-tag"
    :class="[
      `fs-tag--${variant}`,
      `fs-tag--${size}`,
    ]"
  >
    <slot />
    <button
      v-if="closable"
      class="fs-tag__close"
      @click.stop="emit('close')"
    >
      <X :size="size === 'sm' ? 11 : 12" />
    </button>
  </span>
</template>

<style scoped>
.fs-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  border-radius: var(--fs-radius-sm);
  white-space: nowrap;
  user-select: none;
}

.fs-tag--sm { height: 24px; padding: 0 8px; font-size: 12px; }
.fs-tag--md { height: 28px; padding: 0 10px; font-size: 13px; }

.fs-tag--default { background: var(--fs-neutral-100); color: var(--fs-neutral-600); }
.fs-tag--brand   { background: var(--fs-brand-50);    color: var(--fs-brand-600); }
.fs-tag--success { background: var(--fs-success-50);  color: var(--fs-success-700); }
.fs-tag--warning { background: var(--fs-warning-50);  color: var(--fs-warning-700); }

.fs-tag__close {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  border-radius: 2px;
  transition: opacity 100ms;
}
.fs-tag__close:hover { opacity: 0.8; }
</style>
