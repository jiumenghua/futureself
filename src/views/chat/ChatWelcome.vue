<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Sparkles, ChevronRight } from 'lucide-vue-next'

const store = useAppStore()

const emit = defineEmits<{ send: [prompt: string] }>()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6)  return '夜深了'
  if (h < 9)  return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  if (h < 22) return '晚上好'
  return '夜深了'
})

const displayName = computed(() => store.user?.name || '同学')

// 建议 chips 是 UI 提示词，所有用户相同
const suggestionChips = [
  { id: 's1', icon: '📚', label: '帮我规划学习', prompt: '帮我规划一下今天的学习计划吧' },
  { id: 's2', icon: '🍚', label: '今天吃什么', prompt: '今天中午吃什么好呢？' },
  { id: 's3', icon: '❤️', label: '最近状态怎么样', prompt: '帮我看看最近的状态怎么样' },
  { id: 's4', icon: '📅', label: '看看今天安排', prompt: '今天有什么安排？' },
]

function clickChip(prompt: string) {
  emit('send', prompt)
}
</script>

<template>
  <div class="welcome">
    <!-- AI 头像 -->
    <div class="welcome__avatar-wrap">
      <div class="welcome__avatar-breathe">
        <FsAiAvatar :size="'lg'" :mood="'happy'" :show-pulse="true" />
      </div>
      <div class="welcome__avatar-glow" />
    </div>

    <!-- 问候 -->
    <h2 class="welcome__greeting">{{ greeting }}，{{ displayName }} 👋</h2>
    <p class="welcome__sub">
      今天下午有《自动控制原理》，你已经连续 5 天完成学习计划了。
      今天想一起完成目标吗？
    </p>

    <!-- 建议按钮 -->
    <div class="welcome__chips">
      <button
        v-for="chip in suggestionChips"
        :key="chip.id"
        class="welcome__chip"
        @click="clickChip(chip.prompt)"
      >
        <span class="welcome__chip-icon">{{ chip.icon }}</span>
        <span class="welcome__chip-label">{{ chip.label }}</span>
        <ChevronRight :size="14" class="welcome__chip-arrow" />
      </button>
    </div>

    <!-- 底部提示 -->
    <div class="welcome__footnote">
      <Sparkles :size="12" />
      <span>AI 已准备好，随时陪你聊聊</span>
    </div>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 32px;
  text-align: center;
  animation: welcome-in 500ms var(--fs-ease-out) both;
}

/* AI 形象 */
.welcome__avatar-wrap {
  position: relative;
  margin-bottom: 24px;
}
.welcome__avatar-breathe {
  position: relative;
  z-index: 1;
  animation: welcome-breathe 4s ease-in-out infinite;
}
.welcome__avatar-glow {
  position: absolute;
  inset: -22px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  animation: welcome-glow 3s ease-in-out infinite;
}

/* 问候 */
.welcome__greeting {
  font-size: 24px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.welcome__sub {
  font-size: 14.5px;
  color: var(--fs-neutral-600);
  line-height: 1.6;
  max-width: 420px;
  margin-bottom: 28px;
}

/* 建议按钮 */
.welcome__chips {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 380px;
  max-width: 100%;
}
.welcome__chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-md);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
  font-family: var(--fs-font-sans);
  text-align: left;
}
.welcome__chip:hover {
  border-color: rgba(59, 130, 246, 0.2);
  background: var(--fs-brand-50);
  transform: translateY(-1px);
  box-shadow: var(--fs-shadow-sm);
}
.welcome__chip-icon { font-size: 18px; flex-shrink: 0; }
.welcome__chip-label { flex: 1; font-size: 13.5px; font-weight: 500; color: var(--fs-neutral-700); }
.welcome__chip-arrow { color: var(--fs-neutral-400); flex-shrink: 0; transition: transform 150ms; }
.welcome__chip:hover .welcome__chip-arrow { transform: translateX(2px); color: var(--fs-brand-500); }

/* 底部提示 */
.welcome__footnote {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 32px;
  font-size: 12px;
  color: var(--fs-neutral-400);
}

@keyframes welcome-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes welcome-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
@keyframes welcome-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.8; transform: scale(1.08); }
}
</style>
