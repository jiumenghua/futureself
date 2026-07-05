<script setup lang="ts">
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Brain, Sparkles } from 'lucide-vue-next'
import { mockLearnedTags } from '@/mock/discover'

const learnedTags = mockLearnedTags
const learningStats: any = null

const categoryColors: Record<string, string> = {
  study:    '#3B82F6',
  life:     '#22C55E',
  interest: '#8B5CF6',
  goal:     '#F59E0B',
  food:     '#EC4899',
  emotion:  '#6366F1',
}

const categoryLabels: Record<string, string> = {
  study: '学习', life: '生活', interest: '兴趣', goal: '目标', food: '饮食', emotion: '情绪',
}
</script>

<template>
  <section class="learn">
    <div class="learn__card">
      <!-- 头部 -->
      <div class="learn__top">
        <div class="learn__top-left">
          <FsAiAvatar :size="'sm'" :mood="'default'" :show-pulse="true" />
          <div>
            <h3 class="learn__title">FutureSelf 正在学习关于你的一切</h3>
            <p class="learn__sub">深入了解你的习惯、偏好和目标，让陪伴越来越贴心</p>
          </div>
        </div>
        <div v-if="learningStats" class="learn__stats">
          <div class="learn__stat">
            <span class="learn__stat-num">{{ learningStats.studyHours }}</span>
            <span class="learn__stat-label">学习小时</span>
          </div>
          <div class="learn__stat">
            <span class="learn__stat-num">{{ learningStats.courseCount }}</span>
            <span class="learn__stat-label">课程</span>
          </div>
          <div class="learn__stat">
            <span class="learn__stat-num">{{ learningStats.activeDays }}</span>
            <span class="learn__stat-label">活跃天数</span>
          </div>
        </div>
      </div>

      <!-- 标签云 -->
      <div v-if="learnedTags.length > 0" class="learn__tags">
        <span
          v-for="tag in learnedTags"
          :key="tag.label"
          class="learn__tag"
          :style="{ background: categoryColors[tag.category] + '12', color: categoryColors[tag.category], borderColor: categoryColors[tag.category] + '22' }"
        >
          {{ tag.label }}
        </span>
      </div>
      <p v-else class="learn__empty">暂无学习数据</p>

      <!-- 底部说明 -->
      <div class="learn__footnote">
        <Sparkles :size="13" />
        <span>这些标签会随着你的日常行为自动更新</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learn {
  max-width: 1100px;
  margin: 0 auto 40px;
}
.learn__card {
  padding: 28px 32px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
}

/* 顶部 */
.learn__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}
.learn__top-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.learn__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  margin-bottom: 4px;
}
.learn__sub {
  font-size: 13px;
  color: var(--fs-neutral-500);
}

/* 统计 */
.learn__stats {
  display: flex;
  gap: 24px;
  flex-shrink: 0;
}
.learn__stat {
  text-align: center;
}
.learn__stat-num {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--fs-brand-500);
  letter-spacing: -0.02em;
}
.learn__stat-label {
  font-size: 11.5px;
  color: var(--fs-neutral-400);
}

/* 标签 */
.learn__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.learn__tag {
  display: inline-block;
  padding: 5px 12px;
  font-size: 12.5px;
  font-weight: 500;
  border: 1px solid;
  border-radius: var(--fs-radius-full);
  transition: transform 150ms;
}
.learn__tag:hover {
  transform: scale(1.04);
}
.learn__empty {
  text-align: center;
  padding: 24px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}

/* 底部 */
.learn__footnote {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--fs-neutral-400);
  padding-top: 16px;
  border-top: 1px solid var(--fs-neutral-100);
}
</style>
