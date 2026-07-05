<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
import TodayHero from './TodayHero.vue'
import TodayUpcoming from './TodayUpcoming.vue'
import TodayDiet from './TodayDiet.vue'
import TodayFeed from './TodayFeed.vue'
import TodayFocus from './TodayFocus.vue'
import TodayTimeline from './TodayTimeline.vue'
import TodayGrowthTrend from './TodayGrowthTrend.vue'
import TodayMessage from './TodayMessage.vue'

const store = useAppStore()
store.setPageMeta({ title: '今日成长指南' })
</script>

<template>
  <div class="today-page">
    <!-- ① AI Hero -->
    <TodayHero />

    <!-- ② 近期提醒 -->
    <TodayUpcoming />

    <!-- ②.⑤ 今日饮食推荐 -->
    <TodayDiet />

    <!-- ③ FutureSelf Feed -->
    <TodayFeed />

    <!-- ③ AI 重点关注 -->
    <TodayFocus />

    <!-- ④ 时间轴 -->
    <TodayTimeline />

    <!-- ⑤ 成长趋势 -->
    <TodayGrowthTrend />

    <!-- ⑥ 今日寄语 -->
    <TodayMessage />
  </div>
</template>

<style scoped>
.today-page {
  width: 100%;
  padding-top: 4px;
  animation: page-in 400ms var(--fs-ease-out) both;
}

@keyframes page-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
