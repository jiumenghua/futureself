<script setup lang="ts">
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { Layers } from 'lucide-vue-next'
import { mockJourneyDimensions } from '@/mock/journey'

const dimensions = mockJourneyDimensions
const trendIcon: Record<string, any> = { up: TrendingUp, down: TrendingDown, stable: Minus }
const trendColorMap: Record<string, string> = { up: '#22C55E', down: '#EF4444', stable: '#F59E0B' }
</script>

<template>
  <section class="dim">
    <div class="dim__header">
      <Layers :size="18" stroke-width="1.75" class="dim__icon" />
      <h3 class="dim__title">成长维度</h3>
    </div>
    <div v-if="dimensions.length > 0" class="dim__grid">
      <div v-for="d in dimensions" :key="d.id" class="dim__card" :style="{ borderTopColor: d.color }">
        <div class="dim__top">
          <span class="dim__emoji">{{ d.icon }}</span>
          <span class="dim__label">{{ d.label }}</span>
        </div>
        <div class="dim__score-row">
          <span class="dim__score" :style="{ color: d.color }">{{ d.score }}</span>
          <component :is="trendIcon[d.trend]" :size="18" :style="{ color: trendColorMap[d.trend] }" />
        </div>
        <p class="dim__comment">{{ d.aiComment }}</p>
      </div>
    </div>
    <p v-else class="dim__empty">暂无数据</p>
  </section>
</template>

<style scoped>
.dim { max-width: 1100px; margin: 0 auto 32px; }
.dim__header { display:flex; align-items:baseline; gap:8px; margin-bottom:18px; }
.dim__icon { color:var(--fs-brand-500); }
.dim__title { font-size:18px; font-weight:700; color:var(--fs-neutral-800); }
.dim__grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.dim__card {
  padding:22px 20px; background:var(--fs-neutral-0); border:1px solid var(--fs-neutral-200);
  border-top:3px solid var(--fs-brand-500); border-radius:var(--fs-radius-lg);
  transition: all 200ms;
}
.dim__card:hover { box-shadow:var(--fs-shadow-sm); transform:translateY(-1px); }
.dim__top { display:flex; align-items:center; gap:7px; margin-bottom:14px; }
.dim__emoji { font-size:20px; }
.dim__label { font-size:14px; font-weight:600; color:var(--fs-neutral-700); }
.dim__score-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:11px; }
.dim__score { font-size:32px; font-weight:700; letter-spacing:-0.03em; }
.dim__comment { font-size:12.5px; color:var(--fs-neutral-500); line-height:1.55; padding-top:10px; border-top:1px solid var(--fs-neutral-100); }
.dim__empty { text-align:center; padding:48px 0; font-size:14px; color:var(--fs-neutral-400); }
</style>
