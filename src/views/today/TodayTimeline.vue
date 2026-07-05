<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { mockTimelineEntries } from '@/mock/today'

const entries = mockTimelineEntries

function typeClass(type: string): string {
  return `timeline__dot--${type}`
}
</script>

<template>
  <section class="timeline-section">
    <!-- 标题 -->
    <div class="timeline-section__header">
      <Clock :size="18" stroke-width="1.75" class="timeline-section__header-icon" />
      <h3 class="timeline-section__title">今天的时间线</h3>
    </div>

    <!-- 时间轴 -->
    <div v-if="entries.length > 0" class="timeline">
      <div
        v-for="(entry, i) in entries"
        :key="entry.id"
        class="timeline__item"
        :style="{ animationDelay: i * 80 + 'ms' }"
      >
        <!-- 左侧时间 -->
        <div class="timeline__time">
          <span class="timeline__time-text">{{ entry.time }}</span>
        </div>

        <!-- 中间节点 + 线 -->
        <div class="timeline__node-col">
          <div class="timeline__dot" :class="typeClass(entry.type)">
            {{ entry.icon }}
          </div>
          <div v-if="i < entries.length - 1" class="timeline__line" />
        </div>

        <!-- 右侧内容 -->
        <div class="timeline__content">
          <h4 class="timeline__content-title">{{ entry.title }}</h4>
          <p class="timeline__content-desc">{{ entry.description }}</p>
        </div>
      </div>
    </div>
    <p v-else class="timeline-section__empty">暂无时间线</p>
  </section>
</template>

<style scoped>
/* ============================================================
   TodayTimeline — 今天的时间轴
   ============================================================ */

.timeline-section {
  max-width: 1100px;
  margin: 0 auto 32px;
}

/* ===== Header ===== */
.timeline-section__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.timeline-section__header-icon { color: var(--fs-brand-500); }
.timeline-section__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.01em;
}

/* ===== 时间轴 ===== */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline__item {
  display: flex;
  gap: 16px;
  animation: timeline-in 400ms var(--fs-ease-out) both;
  opacity: 0;
}

/* ===== 时间 ===== */
.timeline__time {
  width: 52px;
  flex-shrink: 0;
  padding-top: 2px;
}
.timeline__time-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--fs-neutral-500);
  font-variant-numeric: tabular-nums;
}

/* ===== 节点 + 线 ===== */
.timeline__node-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 36px;
}
.timeline__dot {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--fs-radius-full);
  background: var(--fs-neutral-100);
  border: 2px solid var(--fs-neutral-200);
  font-size: 15px;
  flex-shrink: 0;
  z-index: 1;
}
.timeline__dot--reminder  { border-color: rgba(59, 130, 246, 0.3); background: #EFF6FF; }
.timeline__dot--suggestion{ border-color: rgba(245, 158, 11, 0.3); background: #FFF9EB; }
.timeline__dot--event     { border-color: rgba(34, 197, 94, 0.3);  background: #EDFCF5; }
.timeline__dot--summary   { border-color: rgba(139, 92, 246, 0.3); background: #F5F0FF; }

.timeline__line {
  width: 2px;
  flex: 1;
  min-height: 32px;
  background: var(--fs-neutral-200);
  margin: 4px 0;
}

/* ===== 内容 ===== */
.timeline__content {
  flex: 1;
  padding: 4px 0 28px;
  min-width: 0;
}
.timeline__content-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--fs-neutral-800);
  margin-bottom: 3px;
}
.timeline__content-desc {
  font-size: 13.5px;
  color: var(--fs-neutral-600);
  line-height: 1.5;
}

.timeline-section__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}

@keyframes timeline-in {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
