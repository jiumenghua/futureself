<script setup lang="ts">
interface FsBadgeProps {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  dot?: boolean
}

withDefaults(defineProps<FsBadgeProps>(), {
  variant: 'default',
  size: 'sm',
  dot: false,
})
</script>

<template>
  <span
    class="fs-badge"
    :class="[
      `fs-badge--${variant}`,
      `fs-badge--${size}`,
      { 'fs-badge--dot': dot },
    ]"
  >
    <span v-if="dot" class="fs-badge__dot" />
    <span v-if="!dot"><slot /></span>
  </span>
</template>

<style scoped>
.fs-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: var(--fs-radius-full);
  line-height: 1;
  white-space: nowrap;
}

/* Sizes */
.fs-badge--sm { height: 18px; padding: 0 6px; font-size: 10px; min-width: 18px; }
.fs-badge--md { height: 22px; padding: 0 8px; font-size: 11.5px; min-width: 22px; }

/* Dot only */
.fs-badge--dot { width: 8px; height: 8px; min-width: 8px; padding: 0; }
.fs-badge--dot.fs-badge--md { width: 10px; height: 10px; min-width: 10px; }

/* Variants */
.fs-badge--default { background: var(--fs-neutral-200); color: var(--fs-neutral-600); }
.fs-badge--brand   { background: var(--fs-brand-100);   color: var(--fs-brand-600); }
.fs-badge--success { background: var(--fs-success-50);  color: var(--fs-success-700); }
.fs-badge--warning { background: var(--fs-warning-50);  color: var(--fs-warning-700); }
.fs-badge--error   { background: var(--fs-error-50);    color: var(--fs-error-700); }

/* Dot colors */
.fs-badge--default .fs-badge__dot,
.fs-badge--default.fs-badge--dot { background: var(--fs-neutral-400); }
.fs-badge--brand .fs-badge__dot,
.fs-badge--brand.fs-badge--dot   { background: var(--fs-brand-500); }
.fs-badge--success .fs-badge__dot,
.fs-badge--success.fs-badge--dot { background: var(--fs-success-500); }
.fs-badge--warning .fs-badge__dot,
.fs-badge--warning.fs-badge--dot { background: var(--fs-warning-500); }
.fs-badge--error .fs-badge__dot,
.fs-badge--error.fs-badge--dot   { background: var(--fs-error-500); }

.fs-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--fs-radius-full);
}
</style>
