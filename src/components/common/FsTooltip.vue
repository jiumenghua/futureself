<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

interface FsTooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

withDefaults(defineProps<FsTooltipProps>(), {
  position: 'top',
  delay: 300,
})

const visible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function show() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  showTimer = setTimeout(() => { visible.value = true }, 300)
}
function hide() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  hideTimer = setTimeout(() => { visible.value = false }, 100)
}

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <div
    class="fs-tooltip-wrapper"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <transition name="tooltip">
      <div
        v-if="visible && text"
        class="fs-tooltip"
        :class="`fs-tooltip--${position}`"
        role="tooltip"
      >
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fs-tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.fs-tooltip {
  position: absolute;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  background: var(--fs-neutral-800);
  border-radius: var(--fs-radius-sm);
  white-space: nowrap;
  pointer-events: none;
  z-index: 500;
  line-height: 1.4;
}

/* Positions */
.fs-tooltip--top {
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}
.fs-tooltip--bottom {
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}
.fs-tooltip--left {
  right: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}
.fs-tooltip--right {
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}

/* Arrow */
.fs-tooltip::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}
.fs-tooltip--top::after {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--fs-neutral-800);
}
.fs-tooltip--bottom::after {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid var(--fs-neutral-800);
}

/* Transition */
.tooltip-enter-active { transition: all 150ms var(--fs-ease-out); }
.tooltip-leave-active { transition: all 100ms var(--fs-ease-out); }
.tooltip-enter-from,
.tooltip-leave-to { opacity: 0; transform: translateX(-50%) translateY(2px); }
</style>
