<script setup lang="ts">
// ============================================================
// JourneyBrowseStats.vue — 浏览行为统计（纯前端假数据）
// 后续对接真实数据只需替换 browseData 对象
// ============================================================

import { ref, computed, onMounted } from 'vue'
import { BarChart3, Clock, Monitor, Globe } from 'lucide-vue-next'

// ---- 类型定义 ----
interface SiteItem {
  name: string
  category: '学习' | '娱乐'
  duration: string
}

interface DayData {
  studyHours: number
  studyMinutes: number
  playHours: number
  playMinutes: number
  studyRatio: number
  sites: SiteItem[]
}

interface BrowseData {
  today: DayData
  week: DayData
}

// ---- 假数据 ----
const browseData: BrowseData = {
  today: {
    studyHours: 3,
    studyMinutes: 12,
    playHours: 1,
    playMinutes: 30,
    studyRatio: 68,
    sites: [
      { name: 'GitHub',       category: '学习', duration: '1小时12分钟' },
      { name: 'Codeforces',   category: '学习', duration: '58分钟' },
      { name: '牛客竞赛',     category: '学习', duration: '42分钟' },
      { name: 'B站',          category: '娱乐', duration: '1小时30分钟' },
    ],
  },
  week: {
    studyHours: 18,
    studyMinutes: 30,
    playHours: 7,
    playMinutes: 12,
    studyRatio: 72,
    sites: [
      { name: 'GitHub',       category: '学习', duration: '6小时15分钟' },
      { name: '牛客竞赛',     category: '学习', duration: '4小时40分钟' },
      { name: 'Codeforces',   category: '学习', duration: '3小时20分钟' },
      { name: 'B站',          category: '娱乐', duration: '4小时12分钟' },
    ],
  },
}

// ---- 标签切换 ----
type TabKey = 'today' | 'week'
const activeTab = ref<TabKey>('today')
const visible = ref(false)
onMounted(() => requestAnimationFrame(() => { visible.value = true }))

const current = computed(() => browseData[activeTab.value])

function switchTab(key: TabKey) {
  if (activeTab.value === key) return
  activeTab.value = key
}

// ---- 工具函数 ----
function formatDuration(h: number, m: number): string {
  return `${h}小时${m}分钟`
}
</script>

<template>
  <section class="jbs" :class="{ 'jbs--visible': visible }">
    <div class="jbs__card">
      <!-- ====== 标题 + 标签切换 ====== -->
      <div class="jbs__top-bar">
        <div class="jbs__title-row">
          <BarChart3 :size="18" stroke-width="1.75" class="jbs__title-icon" />
          <h3 class="jbs__title">浏览行为统计</h3>
        </div>
        <div class="jbs__tabs">
          <button
            :class="['jbs__tab', { 'jbs__tab--active': activeTab === 'today' }]"
            @click="switchTab('today')"
          >今日</button>
          <button
            :class="['jbs__tab', { 'jbs__tab--active': activeTab === 'week' }]"
            @click="switchTab('week')"
          >本周</button>
        </div>
      </div>

      <!-- 内容区（加 key 触发过渡） -->
      <transition name="jbs-fade" mode="out-in">
        <div :key="activeTab" class="jbs__body">
          <!-- ====== 上半区：双时长卡片 ====== -->
          <div class="jbs__duration-cards">
            <!-- 学习时长 -->
            <div class="jbs__dur-card jbs__dur-card--study">
              <div class="jbs__dur-icon-wrap jbs__dur-icon-wrap--study">
                <Clock :size="18" stroke-width="1.75" />
              </div>
              <div class="jbs__dur-info">
                <span class="jbs__dur-value">
                  {{ formatDuration(current.studyHours, current.studyMinutes) }}
                </span>
                <span class="jbs__dur-label">学习类网站</span>
              </div>
            </div>
            <!-- 娱乐时长 -->
            <div class="jbs__dur-card jbs__dur-card--play">
              <div class="jbs__dur-icon-wrap jbs__dur-icon-wrap--play">
                <Monitor :size="18" stroke-width="1.75" />
              </div>
              <div class="jbs__dur-info">
                <span class="jbs__dur-value">
                  {{ formatDuration(current.playHours, current.playMinutes) }}
                </span>
                <span class="jbs__dur-label">娱乐类网站</span>
              </div>
            </div>
          </div>

          <!-- ====== 中间区：专注度占比进度条 ====== -->
          <div class="jbs__progress-section">
            <div class="jbs__progress-bar-wrap">
              <div class="jbs__progress-bar">
                <div
                  class="jbs__progress-fill"
                  :style="{ width: current.studyRatio + '%' }"
                />
              </div>
            </div>
            <p class="jbs__progress-label">
              学习占比 <strong>{{ current.studyRatio }}%</strong>
            </p>
          </div>

          <!-- ====== 下半区：高频网站排行 ====== -->
          <div class="jbs__sites-section">
            <h4 class="jbs__sites-title">
              <Globe :size="14" stroke-width="1.75" />
              {{ activeTab === 'today' ? '今日高频网站' : '本周高频网站' }}
            </h4>
            <ul class="jbs__sites-list">
              <li v-for="(site, i) in current.sites" :key="i" class="jbs__site-row">
                <span class="jbs__site-rank">{{ i + 1 }}</span>
                <span class="jbs__site-name">{{ site.name }}</span>
                <span
                  :class="['jbs__site-tag', site.category === '学习' ? 'jbs__site-tag--study' : 'jbs__site-tag--play']"
                >{{ site.category }}</span>
                <span class="jbs__site-dur">{{ site.duration }}</span>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
/* ---- Section ---- */
.jbs {
  max-width: 1100px;
  margin: 0 auto 24px;
  opacity: 0;
  transform: translateY(12px);
  transition: all 450ms var(--fs-ease-out);
}
.jbs--visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---- Card ---- */
.jbs__card {
  padding: 28px 32px;
  background: linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 50%, #F0F5FF 100%);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.04), 0 4px 20px rgba(59, 130, 246, 0.05);
}

/* ---- 顶部标题栏 ---- */
.jbs__top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.jbs__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.jbs__title-icon {
  color: var(--fs-brand-500);
}
.jbs__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.01em;
}

/* ---- 标签切换 ---- */
.jbs__tabs {
  display: flex;
  background: var(--fs-neutral-100);
  border-radius: 10px;
  padding: 3px;
}
.jbs__tab {
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-500);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
  font-family: var(--fs-font-sans);
}
.jbs__tab--active {
  background: #fff;
  color: var(--fs-brand-600);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.jbs__tab:hover:not(.jbs__tab--active) {
  color: var(--fs-neutral-700);
}

/* ---- 内容过渡 ---- */
.jbs-fade-enter-active,
.jbs-fade-leave-active {
  transition: all 200ms var(--fs-ease-out);
}
.jbs-fade-enter-from,
.jbs-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ---- 时长卡片 ---- */
.jbs__duration-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}
.jbs__dur-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid transparent;
}
.jbs__dur-card--study {
  background: rgba(59, 130, 246, 0.06);
  border-color: rgba(59, 130, 246, 0.12);
}
.jbs__dur-card--play {
  background: rgba(148, 163, 184, 0.06);
  border-color: rgba(148, 163, 184, 0.15);
}
.jbs__dur-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.jbs__dur-icon-wrap--study {
  background: rgba(59, 130, 246, 0.12);
  color: var(--fs-brand-600);
}
.jbs__dur-icon-wrap--play {
  background: rgba(148, 163, 184, 0.12);
  color: var(--fs-neutral-500);
}
.jbs__dur-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.jbs__dur-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.jbs__dur-card--play .jbs__dur-value {
  color: var(--fs-neutral-600);
}
.jbs__dur-label {
  font-size: 12px;
  color: var(--fs-neutral-400);
  font-weight: 500;
}

/* ---- 进度条 ---- */
.jbs__progress-section {
  margin-bottom: 22px;
}
.jbs__progress-bar-wrap {
  margin-bottom: 8px;
}
.jbs__progress-bar {
  height: 8px;
  background: rgba(148, 163, 184, 0.15);
  border-radius: 10px;
  overflow: hidden;
}
.jbs__progress-fill {
  height: 100%;
  background: var(--fs-ai-gradient);
  border-radius: 10px;
  transition: width 350ms var(--fs-ease-out);
}
.jbs__progress-label {
  font-size: 12.5px;
  color: var(--fs-neutral-500);
}
.jbs__progress-label strong {
  color: var(--fs-brand-600);
  font-weight: 600;
}

/* ---- 高频网站 ---- */
.jbs__sites-section {
  /* no extra wrapper needed */
}
.jbs__sites-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--fs-neutral-600);
  margin-bottom: 12px;
}
.jbs__sites-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.jbs__site-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  transition: background 150ms;
}
.jbs__site-row:hover {
  background: rgba(255, 255, 255, 0.95);
}
.jbs__site-rank {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-400);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.jbs__site-row:nth-child(1) .jbs__site-rank {
  background: rgba(59, 130, 246, 0.1);
  color: var(--fs-brand-500);
}
.jbs__site-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--fs-neutral-800);
  min-width: 0;
  flex-shrink: 0;
  width: 100px;
}
.jbs__site-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}
.jbs__site-tag--study {
  background: rgba(59, 130, 246, 0.08);
  color: var(--fs-brand-600);
}
.jbs__site-tag--play {
  background: rgba(148, 163, 184, 0.1);
  color: var(--fs-neutral-500);
}
.jbs__site-dur {
  margin-left: auto;
  font-size: 13px;
  color: var(--fs-neutral-500);
  font-weight: 500;
  white-space: nowrap;
}
</style>
