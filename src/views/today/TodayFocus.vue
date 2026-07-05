<script setup lang="ts">
import { Eye } from 'lucide-vue-next'
import { mockFocusAreas } from '@/mock/today'

const areas = mockFocusAreas
</script>

<template>
  <section class="focus">
    <!-- 标题 -->
    <div class="focus__header">
      <Eye :size="18" stroke-width="1.75" class="focus__header-icon" />
      <h3 class="focus__title">AI 今天重点关注</h3>
    </div>

    <!-- 四张卡片 -->
    <div v-if="areas.length > 0" class="focus__grid">
      <div
        v-for="area in areas"
        :key="area.id"
        class="focus__card"
        :style="{ borderTopColor: area.color }"
      >
        <div class="focus__card-top">
          <span class="focus__card-icon">{{ area.icon }}</span>
          <span
            class="focus__card-label"
            :style="{ color: area.color }"
          >
            {{ area.label }}
          </span>
        </div>
        <h4 class="focus__card-title">{{ area.title }}</h4>
        <p class="focus__card-detail">{{ area.detail }}</p>

        <!-- 进度条（如果有） -->
        <div v-if="area.progress !== undefined" class="focus__progress-wrap">
          <div class="focus__progress-track">
            <div
              class="focus__progress-bar"
              :style="{
                width: area.progress + '%',
                background: area.color,
              }"
            />
          </div>
          <span class="focus__progress-text">{{ area.progress }}%</span>
        </div>
      </div>
    </div>
    <p v-else class="focus__empty">暂无重点关注</p>
  </section>
</template>

<style scoped>
/* ============================================================
   TodayFocus — AI 今天重点关注
   四张横向卡片
   ============================================================ */

.focus {
  max-width: 1100px;
  margin: 0 auto 32px;
}

/* ===== Header ===== */
.focus__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
.focus__header-icon {
  color: var(--fs-brand-500);
}
.focus__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.01em;
}

/* ===== 卡片网格 ===== */
.focus__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

/* ===== 单卡片 ===== */
.focus__card {
  padding: 20px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-top: 3px solid var(--fs-brand-500);
  border-radius: var(--fs-radius-lg);
  transition: all 200ms var(--fs-ease-out);
}
.focus__card:hover {
  box-shadow: var(--fs-shadow-sm);
  transform: translateY(-1px);
}

.focus__card-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.focus__card-icon {
  font-size: 18px;
}
.focus__card-label {
  font-size: 12px;
  font-weight: 600;
}
.focus__card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--fs-neutral-800);
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}
.focus__card-detail {
  font-size: 13px;
  color: var(--fs-neutral-600);
  line-height: 1.55;
}

/* 进度条 */
.focus__progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}
.focus__progress-track {
  flex: 1;
  height: 5px;
  background: var(--fs-neutral-200);
  border-radius: var(--fs-radius-full);
  overflow: hidden;
}
.focus__progress-bar {
  height: 100%;
  border-radius: var(--fs-radius-full);
  transition: width 600ms var(--fs-ease-out);
}
.focus__progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--fs-neutral-500);
}

.focus__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}
</style>
