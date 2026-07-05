<script setup lang="ts">
// ============================================================
// TodayDiet.vue — 今日饮食推荐卡片
// 展示 AI 生成的三餐推荐，含菜品、理由、天气适配
// ============================================================

import { ref, onMounted, computed } from 'vue'
import { getTodayDiet, generateDiet, type TodayDietResponse } from '@/api/diet(DeepSeek API)'
import { ChefHat, RefreshCw, Sun, CloudRain, Snowflake, Wind } from 'lucide-vue-next'

const DEFAULT_USER_ID = 'user_demo_001'

// ============================================================
// 演示用：早午餐静态菜品推荐（贴合高校食堂场景）
// ============================================================
const DEMO_DIET_DATA: TodayDietResponse = {
  date: new Date().toISOString().slice(0, 10),
  weather: '晴，32°C',
  meals: {
    breakfast: { foodContent: '青菜瘦肉粥 + 茶叶蛋（清淡养胃，上午学习不容易犯困）', weatherNote: '今日天热，早餐宜清淡', generatedAt: new Date().toISOString() },
    lunch: { foodContent: '香辣鸡扒饭 + 例汤（微辣开胃，补充下午备考能量）', weatherNote: '午餐可适当吃些有食欲的', generatedAt: new Date().toISOString() },
  },
}

const dietData = ref<TodayDietResponse | null>(DEMO_DIET_DATA)
const isLoading = ref(false)
const isGenerating = ref(false)

const mealTypes = [
  { key: 'breakfast', label: '早餐', emoji: '🥐', time: '07:30' },
  { key: 'lunch',     label: '午餐', emoji: '🍚', time: '12:00' },
  { key: 'dinner',    label: '晚餐', emoji: '🌙', time: '18:00' },
]

const hasAnyMeal = computed(() => {
  if (!dietData.value) return false
  return Object.keys(dietData.value.meals).length > 0
})

async function load() {
  isLoading.value = true
  try {
    const apiData = await getTodayDiet(DEFAULT_USER_ID)
    if (apiData && Object.keys(apiData.meals).length > 0) {
      dietData.value = apiData
    }
    // 演示用：API 无数据时保留 DEMO_DIET_DATA
  } catch { /* 保留演示数据 */ }
  isLoading.value = false
}

async function handleGenerate() {
  isGenerating.value = true
  await generateDiet(DEFAULT_USER_ID)
  await load()
  isGenerating.value = false
}

function parseRecommendations(foodContent: string): Array<{ name: string; reason: string }> {
  if (!foodContent) return []
  // 解析 "菜品（理由）；菜品（理由）" 格式
  return foodContent.split('；').filter(Boolean).map((item) => {
    const match = item.match(/^(.+?)（(.+?)）$/)
    if (match) return { name: match[1].trim(), reason: match[2].trim() }
    return { name: item.trim(), reason: '' }
  })
}

onMounted(load)
</script>

<template>
  <section class="td">
    <!-- 头部 -->
    <div class="td__header">
      <div class="td__header-left">
        <ChefHat :size="18" stroke-width="1.75" class="td__icon" />
        <h3 class="td__title">今日饮食推荐</h3>
        <span v-if="!isLoading" class="td__badge">{{ hasAnyMeal ? 'AI 已推荐' : '尚未生成' }}</span>
      </div>
      <button class="td__refresh" :disabled="isGenerating" @click="handleGenerate">
        <RefreshCw :size="14" :class="{ 'animate-spin': isGenerating }" />
        <span>{{ isGenerating ? '生成中…' : '刷新推荐' }}</span>
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="isLoading" class="td__loading">正在加载饮食推荐…</div>

    <!-- 餐次卡片 -->
    <div v-else class="td__meals">
      <div v-for="meal in mealTypes" :key="meal.key" class="td__meal-card">
        <div class="td__meal-hd">
          <span class="td__meal-emoji">{{ meal.emoji }}</span>
          <span class="td__meal-label">{{ meal.label }}</span>
          <span class="td__meal-time">{{ meal.time }}</span>
        </div>

        <!-- 有推荐 -->
        <div v-if="dietData?.meals[meal.key]" class="td__meal-body">
          <div v-for="(rec, i) in parseRecommendations(dietData.meals[meal.key].foodContent)" :key="i" class="td__rec">
            <span class="td__rec-dot" />
            <span class="td__rec-name">{{ rec.name }}</span>
            <span v-if="rec.reason" class="td__rec-reason">— {{ rec.reason }}</span>
          </div>
        </div>

        <!-- 无推荐 -->
        <div v-else class="td__meal-empty">等待 AI 推荐…</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.td { max-width: 1100px; margin: 0 auto 32px; }

.td__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.td__header-left { display: flex; align-items: center; gap: 8px; }
.td__icon { color: #f59e0b; }
.td__title { font-size: 18px; font-weight: 700; color: var(--fs-neutral-800); }
.td__badge {
  padding: 2px 10px; font-size: 11px; font-weight: 600;
  color: var(--fs-brand-500); background: var(--fs-brand-50);
  border-radius: var(--fs-radius-full);
}

.td__refresh {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; font-size: 12.5px; font-weight: 600; font-family: var(--fs-font-sans);
  color: var(--fs-brand-500); background: var(--fs-brand-50);
  border: none; border-radius: var(--fs-radius-full); cursor: pointer; transition: all 150ms;
}
.td__refresh:hover:not(:disabled) { background: var(--fs-brand-100); }
.td__refresh:disabled { opacity: 0.6; cursor: default; }

.td__loading { text-align:center; padding:32px; font-size:14px; color:var(--fs-neutral-400); }

/* 餐次卡片 */
.td__meals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 900px) { .td__meals { grid-template-columns: 1fr; } }

.td__meal-card {
  padding: 16px 18px; background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200); border-radius: var(--fs-radius-lg);
}
.td__meal-hd { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.td__meal-emoji { font-size: 18px; }
.td__meal-label { font-size: 14px; font-weight: 700; color: var(--fs-neutral-700); }
.td__meal-time { font-size: 11px; color: var(--fs-neutral-400); margin-left: auto; }

.td__meal-body { display: flex; flex-direction: column; gap: 6px; }
.td__rec { display: flex; align-items: flex-start; gap: 6px; font-size: 13px; line-height: 1.5; }
.td__rec-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #f59e0b;
  flex-shrink: 0; margin-top: 6px;
}
.td__rec-name { font-weight: 600; color: var(--fs-neutral-700); white-space: nowrap; }
.td__rec-reason { color: var(--fs-neutral-500); }

.td__meal-empty { padding: 12px 0; font-size: 13px; color: var(--fs-neutral-400); text-align: center; }

.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
