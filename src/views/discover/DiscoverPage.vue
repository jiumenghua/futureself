<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import DiscoverHero from './DiscoverHero.vue'
import DiscoverCapabilities from './DiscoverCapabilities.vue'
import DiscoverLearning from './DiscoverLearning.vue'
import DiscoverComingSoon from './DiscoverComingSoon.vue'
import DiscoverBrand from './DiscoverBrand.vue'

const store = useAppStore()

onMounted(() => {
  store.setPageMeta({
    title: 'Discover',
    subtitle: 'Explore what FutureSelf can do for you',
  })
})
</script>

<template>
  <div class="discover-page">
    <!-- ① Hero -->
    <DiscoverHero />

    <!-- ② AI 能力中心 (2×3 grid) -->
    <DiscoverCapabilities />

    <!-- ③ FutureSelf 正在学习 -->
    <DiscoverLearning />

    <!-- ④ Coming Soon -->
    <DiscoverComingSoon />

    <!-- ⑤ 品牌底部 -->
    <DiscoverBrand />
  </div>
</template>

<style scoped>
.discover-page {
  width: 100%;
  padding-top: 4px;
  animation: page-in 400ms var(--fs-ease-out) both;
}
@keyframes page-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
