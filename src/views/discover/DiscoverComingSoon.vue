<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { mockComingSoonItems } from '@/mock/discover'

const comingSoonItems = mockComingSoonItems

function getCardStyle(index: number) {
  return { animationDelay: (300 + index * 120) + 'ms' }
}
</script>

<template>
  <section class="soon">
    <div class="soon__header">
      <Clock :size="18" stroke-width="1.75" class="soon__header-icon" />
      <h3 class="soon__title">Coming Soon</h3>
      <span class="soon__subtitle">更多 AI 能力，正在开发中</span>
    </div>

    <div v-if="comingSoonItems.length > 0" class="soon__grid">
      <div
        v-for="(item, i) in comingSoonItems"
        :key="item.id"
        class="soon__card"
        :style="getCardStyle(i)"
      >
        <span class="soon__card-badge">Coming Soon</span>
        <span class="soon__card-icon">{{ item.icon }}</span>
        <h4 class="soon__card-title">{{ item.title }}</h4>
        <p class="soon__card-desc">{{ item.description }}</p>
      </div>
    </div>
    <p v-else class="soon__empty">更多功能即将上线</p>
  </section>
</template>

<style scoped>
.soon {
  max-width: 1100px;
  margin: 0 auto 40px;
}
.soon__header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 20px;
}
.soon__header-icon { color: var(--fs-neutral-400); }
.soon__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fs-neutral-800);
}
.soon__subtitle {
  font-size: 13px;
  color: var(--fs-neutral-400);
  margin-left: 4px;
}

.soon__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.soon__card {
  position: relative;
  padding: 24px;
  background: var(--fs-neutral-50);
  border: 1px dashed var(--fs-neutral-300);
  border-radius: var(--fs-radius-lg);
  animation: soon-in 400ms var(--fs-ease-out) both;
  opacity: 0;
}
.soon__card-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--fs-neutral-400);
  padding: 4px 10px;
  background: var(--fs-neutral-100);
  border-radius: var(--fs-radius-full);
  letter-spacing: 0.03em;
}
.soon__card-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 14px;
  opacity: 0.5;
}
.soon__card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--fs-neutral-500);
  margin-bottom: 6px;
}
.soon__card-desc {
  font-size: 13px;
  color: var(--fs-neutral-400);
  line-height: 1.5;
}

.soon__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}

@keyframes soon-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
