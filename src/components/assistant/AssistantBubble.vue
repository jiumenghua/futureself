<script setup lang="ts">
defineProps<{ message: string; visible: boolean }>()
</script>

<template>
  <transition name="bubble">
    <div v-if="visible && message" class="ab">
      <div class="ab__inner">{{ message }}</div>
      <div class="ab__tail" />
    </div>
  </transition>
</template>

<style scoped>
.ab {
  position: absolute;
  bottom: calc(100% + 12px);
  right: -8px;
  max-width: 240px;
  z-index: 10;
  pointer-events: none;
}
.ab__inner {
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-700);
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  box-shadow: var(--fs-shadow-md);
  line-height: 1.5;
}
.ab__tail {
  position: absolute;
  bottom: -6px;
  right: 24px;
  width: 12px;
  height: 12px;
  background: var(--fs-neutral-0);
  border-right: 1px solid var(--fs-neutral-200);
  border-bottom: 1px solid var(--fs-neutral-200);
  transform: rotate(45deg);
}

.bubble-enter-active { animation: b-in 300ms var(--fs-ease-spring) both; }
.bubble-leave-active { animation: b-out 200ms var(--fs-ease-out) both; }
@keyframes b-in {
  from { opacity:0; transform:translateY(8px) scale(0.9); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes b-out {
  from { opacity:1; transform:scale(1); }
  to   { opacity:0; transform:scale(0.9); }
}
</style>
