<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { ChartNoAxesColumn } from 'lucide-vue-next'

const store = useAppStore()

interface StatDisplay { id: string; label: string; value: string | number; unit?: string; icon: string }

const stats = computed<StatDisplay[]>(() => {
  const score = store.profile?.growthScore || 0
  const goals = store.profile?.goals?.length || 0
  const discoveries = store.profile?.recentDiscoveries?.length || 0
  return [
    { id: 's1', label: '成长值', value: score, unit: '分', icon: '📚' },
    { id: 's2', label: '成长目标', value: goals, unit: '个', icon: '✅' },
    { id: 's3', label: 'AI 发现', value: discoveries, unit: '条', icon: '🔥' },
  ]
})
</script>

<template>
  <section class="ms">
    <div class="ms__header">
      <ChartNoAxesColumn :size="18" stroke-width="1.75" class="ms__icon" />
      <h3 class="ms__title">成长数据</h3>
    </div>
    <div class="ms__grid">
      <div v-for="stat in stats" :key="stat.id" class="ms__card">
        <span class="ms__card-icon">{{ stat.icon }}</span>
        <div class="ms__card-value">
          <span class="ms__card-num">{{ stat.value }}</span>
          <span v-if="stat.unit" class="ms__card-unit">{{ stat.unit }}</span>
        </div>
        <span class="ms__card-label">{{ stat.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ms { max-width: 1100px; margin: 0 auto 32px; }
.ms__header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 18px; }
.ms__icon { color: var(--fs-brand-500); }
.ms__title { font-size: 18px; font-weight: 700; color: var(--fs-neutral-800); }
.ms__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.ms__card {
  padding: 22px 18px; text-align: center;
  background: var(--fs-neutral-0); border: 1px solid var(--fs-neutral-200); border-radius: var(--fs-radius-lg);
  transition: all 200ms;
}
.ms__card:hover { box-shadow: var(--fs-shadow-sm); transform: translateY(-1px); }
.ms__card-icon { font-size: 26px; display: block; margin-bottom: 10px; }
.ms__card-value { display: flex; align-items: baseline; justify-content: center; gap: 3px; margin-bottom: 4px; }
.ms__card-num { font-size: 28px; font-weight: 700; color: var(--fs-neutral-800); letter-spacing: -0.02em; }
.ms__card-unit { font-size: 13px; color: var(--fs-neutral-400); }
.ms__card-label { font-size: 12px; color: var(--fs-neutral-500); }
</style>
