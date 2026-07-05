<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import MeHero from './MeHero.vue'
import MeProfile from './MeProfile.vue'
import MeGoals from './MeGoals.vue'
import MeMemory from './MeMemory.vue'
import MeStats from './MeStats.vue'
import MeSummary from './MeSummary.vue'
import MeSettings from './MeSettings.vue'
import MeGrowthProfile from './MeGrowthProfile.vue'
import MeCalendarSettings from './MeCalendarSettings.vue'
import MeDietSettings from './MeDietSettings.vue'

const store = useAppStore()

onMounted(() => {
  store.setPageMeta({
    title: 'Me',
    subtitle: 'Everything FutureSelf knows about you',
  })
})
</script>

<template>
  <div class="me-page">
    <MeHero />
    <MeProfile />
    <MeGrowthProfile />
    <MeCalendarSettings />
    <MeDietSettings />
    <MeGoals />
    <MeMemory />
    <MeStats />
    <MeSummary />
    <MeSettings />
  </div>
</template>

<style scoped>
.me-page {
  width: 100%;
  padding-top: 4px;
  animation: page-in 400ms var(--fs-ease-out) both;
}
@keyframes page-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
