<script setup lang="ts">
// ============================================================
// TodayUpcoming.vue — 近期提醒卡片
// 演示用：从日历考试数据中筛选未来 7 天内的事件
// ============================================================

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, ArrowRight, Calendar } from 'lucide-vue-next'

const router = useRouter()

// ============================================================
// 演示用：期末考试静态数据（与 CalendarView 数据源一致）
// ============================================================
const DEMO_EXAMS = [
  { date: '2026-07-02', title: '高等数学期末考', description: '09:00-11:00 东教 2-101' },
  { date: '2026-07-04', title: '大学物理期末考', description: '14:30-16:30 西教 3-205' },
  { date: '2026-07-06', title: '数字电路期末考', description: '09:00-11:00 东教 1-302' },
  { date: '2026-07-08', title: '自动控制原理期末考', description: '14:30-16:30 综合楼 4-108' },
  { date: '2026-07-10', title: '单片机原理期末考', description: '09:00-11:00 实验楼 2-301' },
  { date: '2026-07-12', title: '大学英语期末考', description: '14:30-16:30 东教 2-403' },
] as const

/** 未来 7 天内（含今天）的考试事件，按日期升序排列 */
const upcomingEvents = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  return DEMO_EXAMS
    .filter((exam) => {
      const examDate = new Date(exam.date + 'T00:00:00')
      return examDate >= today && examDate <= sevenDaysLater
    })
    .map((exam) => {
      const examDate = new Date(exam.date + 'T00:00:00')
      const diffDays = Math.floor((examDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
      let countdown: string
      if (diffDays === 0) countdown = '今天'
      else if (diffDays === 1) countdown = '明天'
      else if (diffDays === 2) countdown = '后天'
      else countdown = `${diffDays} 天后`
      return {
        _id: exam.date,
        type: 'exam' as const,
        title: exam.title,
        description: exam.description,
        countdown,
        route: '/journey',
      }
    })
})

const typeLabel: Record<string, string> = { study: '学习提醒', diet: '饮食建议', schedule: '日程提醒', exam: '考试', competition: '竞赛', custom: '自定义' }
const typeColor: Record<string, string> = {
  study: 'bg-blue-50 text-blue-600 border-blue-200',
  diet: 'bg-amber-50 text-amber-600 border-amber-200',
  schedule: 'bg-purple-50 text-purple-600 border-purple-200',
  exam: 'bg-red-50 text-red-600 border-red-200',
  competition: 'bg-amber-50 text-amber-600 border-amber-200',
  custom: 'bg-slate-50 text-slate-600 border-slate-200',
}
</script>

<template>
  <div class="tu-card">
    <div class="tu-card__hd">
      <h3 class="tu-card__title"><Calendar :size="16" stroke-width="1.75" /> 近期提醒</h3>
      <button class="tu-card__all" @click="router.push('/journey')">查看全部 <ArrowRight :size="14" /></button>
    </div>

    <!-- 未来 7 天考试事件 -->
    <div v-if="upcomingEvents.length > 0" class="tu-card__list">
      <div v-for="ev in upcomingEvents" :key="ev._id" class="tu-card__item" @click="router.push(ev.route)">
        <div class="tu-card__item-left">
          <span class="tu-card__tag" :class="typeColor[ev.type] || typeColor.custom">
            {{ typeLabel[ev.type] || ev.type }}
          </span>
          <div class="tu-card__info">
            <span class="tu-card__name">{{ ev.title }}</span>
            <span v-if="ev.description" class="tu-card__desc">{{ ev.description }}</span>
          </div>
        </div>
        <div class="tu-card__item-right">
          <Clock :size="12" stroke-width="1.5" />
          <span class="tu-card__countdown">{{ ev.countdown }}</span>
        </div>
      </div>
    </div>

    <!-- 未来 7 天无事件 -->
    <div v-else class="tu-card__empty">未来 7 天暂无考试安排 🎉</div>
  </div>
</template>

<style scoped>
.tu-card {
  max-width: 1100px; margin: 0 auto 24px;
  padding: 20px 24px; background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200); border-radius: var(--fs-radius-lg);
}
.tu-card__hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.tu-card__title { display:flex; align-items:center; gap:8px; font-size:16px; font-weight:700; color:var(--fs-neutral-700); }
.tu-card__all { display:inline-flex; align-items:center; gap:4px; font-size:12.5px; font-weight:500; font-family:var(--fs-font-sans); color:var(--fs-brand-500); background:none; border:none; cursor:pointer; }
.tu-card__empty { text-align:center; padding:16px; font-size:13px; color:var(--fs-neutral-400); }
.tu-card__list { display:flex; flex-direction:column; gap:8px; }
.tu-card__item {
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 12px; background:var(--fs-neutral-50); border-radius:var(--fs-radius-md);
  cursor:pointer; transition: background 150ms;
}
.tu-card__item:hover { background:var(--fs-neutral-100); }
.tu-card__item-left { display:flex; align-items:center; gap:10px; min-width:0; }
.tu-card__tag { font-size:10.5px; font-weight:600; padding:1px 8px; border-radius:var(--fs-radius-xs); border:1px solid; flex-shrink:0; }
.tu-card__info { display:flex; flex-direction:column; min-width:0; gap:1px; }
.tu-card__name { font-size:13.5px; font-weight:500; color:var(--fs-neutral-700); white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.tu-card__desc { font-size:11.5px; color:var(--fs-neutral-400); white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.tu-card__item-right { display:flex; align-items:center; gap:4px; flex-shrink:0; color:var(--fs-neutral-500); }
.tu-card__countdown { font-size:12.5px; font-weight:500; }
</style>
