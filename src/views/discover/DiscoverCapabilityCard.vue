<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'

export interface CapabilityCard {
  id: string
  icon: string
  title: string
  description: string
  agentLabel: string
  color: string
}

const props = defineProps<{ card: CapabilityCard; delay: number }>()
const emit = defineEmits<{ select: [id: string] }>()

const rippleStyle = ref<Record<string, string>>({})
const showRipple = ref(false)

function onClick() {
  emit('select', props.card.id)
}

function onMouseDown(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  rippleStyle.value = {
    width: size + 'px',
    height: size + 'px',
    left: (e.clientX - rect.left - size / 2) + 'px',
    top: (e.clientY - rect.top - size / 2) + 'px',
  }
  showRipple.value = true
  setTimeout(() => { showRipple.value = false }, 600)
}
</script>

<template>
  <article
    class="cc-card"
    :style="{
      animationDelay: delay + 'ms',
      borderTopColor: card.color + '33',
    }"
    @mousedown="onMouseDown"
    @click="onClick"
  >
    <!-- Ripple -->
    <span
      v-if="showRipple"
      class="cc-card__ripple"
      :style="[rippleStyle, { background: card.color + '18' }]"
    />

    <!-- 图标 -->
    <div class="cc-card__icon-wrap" :style="{ background: card.color + '12' }">
      <span class="cc-card__icon">{{ card.icon }}</span>
    </div>

    <!-- 内容 -->
    <h3 class="cc-card__title">{{ card.title }}</h3>
    <p class="cc-card__desc">{{ card.description }}</p>

    <!-- 底部 Agent 标签 -->
    <div class="cc-card__footer">
      <span class="cc-card__agent" :style="{ color: card.color }">
        {{ card.agentLabel }}
      </span>
      <ChevronRight :size="15" :style="{ color: card.color }" />
    </div>
  </article>
</template>

<style scoped>
.cc-card {
  position: relative;
  padding: 24px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-top: 3px solid transparent;
  border-radius: var(--fs-radius-lg);
  cursor: pointer;
  overflow: hidden;
  transition: all 250ms var(--fs-ease-out);
  animation: cc-in 400ms var(--fs-ease-out) both;
  opacity: 0;
}
.cc-card:hover {
  border-color: rgba(59, 130, 246, 0.12);
  box-shadow: var(--fs-shadow-sm);
  transform: translateY(-2px);
}
.cc-card:active {
  transform: scale(0.985);
}

/* Ripple */
.cc-card__ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms ease-out;
  pointer-events: none;
  z-index: 0;
}
@keyframes ripple {
  to { transform: scale(2); opacity: 0; }
}

/* 图标 */
.cc-card__icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--fs-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}
.cc-card__icon {
  font-size: 24px;
}

/* 内容 */
.cc-card__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
}
.cc-card__desc {
  font-size: 13.5px;
  color: var(--fs-neutral-600);
  line-height: 1.6;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}

/* Footer */
.cc-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}
.cc-card__agent {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

@keyframes cc-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
