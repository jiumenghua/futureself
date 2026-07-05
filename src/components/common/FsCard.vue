<script setup lang="ts">
interface FsCardProps {
  variant?: 'default' | 'ai' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<FsCardProps>(), {
  variant: 'default',
  padding: 'md',
})
</script>

<template>
  <div
    class="fs-card"
    :class="[
      `fs-card--${variant}`,
      `fs-card--padding-${padding}`,
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
/* ===== Base ===== */
.fs-card {
  background: var(--fs-surface-card);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  transition: all 200ms var(--fs-ease-out);
}

/* ===== Padding ===== */
.fs-card--padding-none { padding: 0; }
.fs-card--padding-sm   { padding: 14px; }
.fs-card--padding-md   { padding: 24px; }
.fs-card--padding-lg   { padding: 32px; }

/* ===== Variant: default (default) ===== */
.fs-card--default {}

/* ===== Variant: AI 辉光 ===== */
.fs-card--ai {
  background: linear-gradient(135deg, #FFFFFF 0%, #FAFBFF 100%);
  border-color: rgba(59, 130, 246, 0.12);
  box-shadow: var(--fs-shadow-ai);
  position: relative;
  overflow: hidden;
}
.fs-card--ai::before {
  content: '';
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.6;
}

/* ===== Variant: Interactive ===== */
.fs-card--interactive {
  cursor: pointer;
}
.fs-card--interactive:hover {
  border-color: var(--fs-neutral-300);
  box-shadow: var(--fs-shadow-sm);
  transform: translateY(-2px);
}
</style>
