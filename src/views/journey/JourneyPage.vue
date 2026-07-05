<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import CalendarView from '@/components/calendar/CalendarView.vue'
import JourneyBrowseStats from './JourneyBrowseStats.vue'
import JourneyHero from './JourneyHero.vue'
import JourneyDimensions from './JourneyDimensions.vue'
import JourneyTrend from './JourneyTrend.vue'
import JourneyTimeline from './JourneyTimeline.vue'
import JourneySuggestion from './JourneySuggestion.vue'
import JourneyBadges from './JourneyBadges.vue'

const store = useAppStore()
onMounted(() => store.setPageMeta({ title: 'Journey', subtitle: 'Every day makes a better you' }))
</script>

<template>
  <div class="journey-page">
    <!-- 成长日历（新增） -->
    <CalendarView />
    <!-- 浏览行为统计 -->
    <JourneyBrowseStats />
    <!-- 原有模块 -->
    <JourneyHero />
    <JourneyDimensions />
    <JourneyTrend />
    <JourneyTimeline />
    <JourneySuggestion />
    <JourneyBadges />
  </div>
</template>

<style scoped>
.journey-page { width:100%; padding-top:4px; animation: page-in 400ms var(--fs-ease-out) both; display:flex; flex-direction:column; gap:24px; }
@keyframes page-in { from{opacity:0;} to{opacity:1;} }
</style>
