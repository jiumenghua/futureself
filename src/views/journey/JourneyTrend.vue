<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue'
import * as echarts from 'echarts'
import { TrendingUp, Sparkles } from 'lucide-vue-next'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { mockJourneyTrend } from '@/mock/journey'

const growthTrend = mockJourneyTrend
const trendAnalysis: any = null

const chartRef = ref<HTMLDivElement>()

onMounted(() => {
  if (!chartRef.value) return
  const c = echarts.init(chartRef.value)
  c.setOption({
    grid: { top: 8, right: 14, bottom: 18, left: 34 },
    xAxis: { type:'category', data:growthTrend.map(d=>d.date), axisLine:{show:false}, axisTick:{show:false}, axisLabel:{fontSize:11,color:'#A1A9B8'} },
    yAxis: { type:'value', min:60, max:100, splitNumber:4, axisLine:{show:false}, axisTick:{show:false}, splitLine:{lineStyle:{color:'#E1E8F2',type:'dashed'}}, axisLabel:{fontSize:10,color:'#A1A9B8'} },
    series: [{
      data:growthTrend.map(d=>d.score), type:'line', smooth:true, symbol:'circle', symbolSize:6,
      lineStyle:{ width:2.5, color: new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#3B82F6'},{offset:1,color:'#93C5FD'}]) },
      itemStyle:{ color:'#3B82F6', borderColor:'#fff', borderWidth:2 },
      areaStyle:{ color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(59,130,246,0.1)'},{offset:1,color:'rgba(59,130,246,0.01)'}]) },
    }],
    tooltip: { trigger:'axis', backgroundColor:'#fff', borderColor:'#E1E8F2', textStyle:{color:'#3A4054',fontSize:13} },
  })
})
</script>

<template>
  <section class="tr">
    <div class="tr__card">
      <div class="tr__left">
        <div class="tr__left-hd"><TrendingUp :size="18" stroke-width="1.75" class="tr__left-icon" /><h3>最近 7 天成长趋势</h3></div>
        <div ref="chartRef" class="tr__chart" />
      </div>
      <div v-if="trendAnalysis" class="tr__right">
        <div class="tr__ai-hd"><FsAiAvatar :size="'sm'" :show-status-dot="false" /><span class="tr__ai-badge"><Sparkles :size="11"/><span>AI 分析</span></span></div>
        <p class="tr__ai-text">{{ trendAnalysis.summary }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tr { max-width: 1100px; margin: 0 auto 32px; }
.tr__card { display:flex; gap:0; background:var(--fs-neutral-0); border:1px solid var(--fs-neutral-200); border-radius:var(--fs-radius-lg); overflow:hidden; }
.tr__left { flex:1; padding:22px 26px; min-width:0; }
.tr__left-hd { display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:16px; font-weight:700; color:var(--fs-neutral-800); }
.tr__left-icon { color:var(--fs-brand-500); }
.tr__chart { width:100%; height:200px; }
.tr__right { width:300px; padding:22px 24px; background:linear-gradient(180deg,#FAFBFF 0%,#FFFFFF 100%); border-left:1px solid var(--fs-neutral-100); display:flex; flex-direction:column; }
.tr__ai-hd { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.tr__ai-badge { display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:600; color:var(--fs-brand-500); }
.tr__ai-text { font-size:13.5px; color:var(--fs-neutral-600); line-height:1.7; }
</style>
