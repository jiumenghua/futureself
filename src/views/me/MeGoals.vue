<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { Target, Sparkles } from 'lucide-vue-next'

const store = useAppStore()
const goals = computed(() => (store.profile?.goals || []).map((title, i) => ({
  id: `g${i}`,
  title,
  color: ['#3B82F6','#22C55E','#8B5CF6','#F59E0B'][i % 4],
})))
</script>

<template>
  <section class="mg">
    <div class="mg__header">
      <Target :size="18" stroke-width="1.75" class="mg__icon" />
      <h3 class="mg__title">Goals</h3>
      <span class="mg__sub">长期目标追踪</span>
    </div>
    <div v-if="goals.length > 0" class="mg__grid">
      <div v-for="goal in goals" :key="goal.id" class="mg__card">
        <h4 class="mg__card-title">{{ goal.title }}</h4>
        <div class="mg__ai-comment">
          <Sparkles :size="11" />
          <span>AI 已在关注这个目标，去聊天分享进展吧</span>
        </div>
      </div>
    </div>
    <p v-else class="mg__empty">还没有目标？去告诉 FutureSelf 你的目标吧，它会帮你一起规划。</p>
  </section>
</template>

<style scoped>
.mg { max-width: 1100px; margin: 0 auto 32px; }
.mg__header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 18px; }
.mg__icon { color: var(--fs-brand-500); }
.mg__title { font-size: 18px; font-weight: 700; color: var(--fs-neutral-800); }
.mg__sub { font-size: 13px; color: var(--fs-neutral-400); margin-left: 4px; }
.mg__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.mg__card {
  padding: 22px 24px; background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200); border-radius: var(--fs-radius-lg);
  transition: all 200ms;
}
.mg__card:hover { box-shadow: var(--fs-shadow-sm); transform: translateY(-1px); }
.mg__card-title { font-size: 15px; font-weight: 600; color: var(--fs-neutral-800); margin-bottom: 10px; }
.mg__ai-comment { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; color: var(--fs-neutral-500); line-height: 1.5; padding-top: 10px; border-top: 1px solid var(--fs-neutral-100); }
.mg__empty { font-size: 14px; color: var(--fs-neutral-400); font-style: italic; }
</style>
