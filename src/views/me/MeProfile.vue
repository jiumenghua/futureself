<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { User } from 'lucide-vue-next'

const store = useAppStore()

const TAG_COLORS = ['#3B82F6','#8B5CF6','#6366F1','#22C55E','#F59E0B','#EC4899','#3B82F6','#22C55E','#6366F1','#F59E0B']

const tags = computed(() => {
  const goals = store.profile?.goals || []
  return goals.map((label, i) => ({
    label,
    color: TAG_COLORS[i % TAG_COLORS.length],
  }))
})
</script>

<template>
  <section class="mp">
    <div class="mp__header">
      <User :size="18" stroke-width="1.75" class="mp__icon" />
      <h3 class="mp__title">Your Profile</h3>
      <span class="mp__sub">FutureSelf 长期了解你的兴趣</span>
    </div>
    <div v-if="tags.length > 0" class="mp__tags">
      <span
        v-for="tag in tags"
        :key="tag.label"
        class="mp__tag"
        :style="{ background: tag.color + '10', color: tag.color, borderColor: tag.color + '22' }"
      >
        {{ tag.label }}
      </span>
    </div>
    <p v-else class="mp__empty">FutureSelf 还在慢慢认识你。去聊聊天吧，它会逐渐了解你的目标和兴趣。</p>
  </section>
</template>

<style scoped>
.mp { max-width: 1100px; margin: 0 auto 32px; }
.mp__header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 18px; }
.mp__icon { color: var(--fs-brand-500); }
.mp__title { font-size: 18px; font-weight: 700; color: var(--fs-neutral-800); }
.mp__sub { font-size: 13px; color: var(--fs-neutral-400); margin-left: 4px; }
.mp__tags { display: flex; flex-wrap: wrap; gap: 8px; }
.mp__tag {
  display: inline-block; padding: 7px 16px; font-size: 13.5px; font-weight: 500;
  border: 1px solid; border-radius: var(--fs-radius-full);
  transition: all 200ms; cursor: default;
}
.mp__tag:hover { transform: translateY(-1px); box-shadow: var(--fs-shadow-sm); }
.mp__empty { font-size: 14px; color: var(--fs-neutral-400); font-style: italic; }
</style>
