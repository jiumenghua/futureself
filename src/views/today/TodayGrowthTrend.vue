<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as echarts from 'echarts'
import { TrendingUp, Sparkles } from 'lucide-vue-next'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { mockGrowthTrend } from '@/mock/today'

const trend = ref<{ date: string; score: number }[]>(mockGrowthTrend)
const analysis = ref<any>(null)

const chartRef = ref<HTMLDivElement>()
const chart = shallowRef<echarts.ECharts>()

onMounted(() => {
  if (trend.value.length === 0) return
  if (!chartRef.value) return
  chart.value = echarts.init(chartRef.value)

  chart.value.setOption({
    grid: { top: 10, right: 16, bottom: 20, left: 36 },
    xAxis: {
      type: 'category',
      data: trend.value.map(d => d.date),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#A1A9B8' },
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#E1E8F2', type: 'dashed' } },
      axisLabel: { fontSize: 10, color: '#A1A9B8' },
    },
    series: [{
      data: trend.value.map(d => d.score),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2.5,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#3B82F6' },
          { offset: 1, color: '#93C5FD' },
        ]),
      },
      itemStyle: {
        color: '#3B82F6',
        borderColor: '#fff',
        borderWidth: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 130, 246, 0.12)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0.01)' },
        ]),
      },
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E1E8F2',
      textStyle: { color: '#3A4054', fontSize: 13 },
      formatter: (params: any) => {
        const p = params[0]
        return `<strong>${p.axisValue}</strong><br/>成长值：<b style="color:#3B82F6">${p.value}</b> 分`
      },
    },
  })
})

const trendMap: Record<string, string> = { up: '↑', down: '↓', stable: '→' }
const trendColorMap: Record<string, string> = { up: '#22C55E', down: '#EF4444', stable: '#94A3B8' }
</script>

<template>
  <section class="growth-trend">
    <div class="growth-trend__card">
      <!-- 左侧：图表 -->
      <div class="growth-trend__left">
        <div class="growth-trend__left-header">
          <TrendingUp :size="18" stroke-width="1.75" class="growth-trend__left-icon" />
          <h3 class="growth-trend__left-title">最近 7 天成长趋势</h3>
        </div>
        <div v-if="trend.length > 0" ref="chartRef" class="growth-trend__chart" />
        <p v-else class="growth-trend__empty">暂无成长数据</p>
      </div>

      <!-- 右侧：AI 分析 -->
      <div v-if="analysis" class="growth-trend__right">
        <div class="growth-trend__ai-header">
          <FsAiAvatar :size="'sm'" :mood="'default'" :show-status-dot="false" />
          <div class="growth-trend__ai-label">
            <Sparkles :size="12" />
            <span>FutureSelf 分析</span>
          </div>
        </div>
        <p class="growth-trend__ai-summary">{{ analysis.summary }}</p>
        <div class="growth-trend__ai-details">
          <div
            v-for="d in analysis.details"
            :key="d.label"
            class="growth-trend__ai-item"
          >
            <span class="growth-trend__ai-item-label">{{ d.label }}</span>
            <span
              class="growth-trend__ai-item-trend"
              :style="{ color: trendColorMap[d.trend] }"
            >
              {{ trendMap[d.trend] }} {{ d.note }}
            </span>
          </div>
        </div>
        <p class="growth-trend__ai-suggestion">{{ analysis.suggestion }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   TodayGrowthTrend — 成长趋势 + AI 分析
   一张大卡片 · 左右分栏
   ============================================================ */

.growth-trend {
  max-width: 1100px;
  margin: 0 auto 32px;
}

.growth-trend__card {
  display: flex;
  gap: 0;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  overflow: hidden;
}

/* ===== 左侧：图表 ===== */
.growth-trend__left {
  flex: 1;
  padding: 24px 28px;
  min-width: 0;
}
.growth-trend__left-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.growth-trend__left-icon { color: var(--fs-brand-500); }
.growth-trend__left-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--fs-neutral-800);
}
.growth-trend__chart {
  width: 100%;
  height: 220px;
}

/* ===== 右侧：AI 分析 ===== */
.growth-trend__right {
  width: 320px;
  padding: 24px 28px;
  background: linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%);
  border-left: 1px solid var(--fs-neutral-100);
  display: flex;
  flex-direction: column;
}
.growth-trend__ai-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.growth-trend__ai-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fs-brand-500);
}
.growth-trend__ai-summary {
  font-size: 14px;
  color: var(--fs-neutral-700);
  line-height: 1.6;
  margin-bottom: 14px;
}
.growth-trend__ai-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
.growth-trend__ai-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.growth-trend__ai-item-label {
  font-size: 13px;
  color: var(--fs-neutral-500);
}
.growth-trend__ai-item-trend {
  font-size: 12.5px;
  font-weight: 600;
}
.growth-trend__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}

.growth-trend__ai-suggestion {
  font-size: 13px;
  color: var(--fs-brand-500);
  line-height: 1.6;
  padding: 12px 14px;
  background: var(--fs-brand-50);
  border-radius: var(--fs-radius-md);
  margin-top: auto;
}
</style>
