<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { getDailyAdvice } from '@/api/today(DeepSeek API)'
import { CalendarCheck, Timer, MessageCircleHeart, TrendingUp, Sparkles } from 'lucide-vue-next'
import { mockQuickActions } from '@/mock/today'

const router = useRouter()
const hero = ref({
  greeting: '你好',
  userName: '思源',
  message: '今天是全新的一天！我注意到你最近在机器人课程上花了很多时间，继续加油💪 记得按时吃早餐，合理安排学习和休息时间。',
  growthScore: 85,
  statusEmoji: '🌟',
  growthStatus: '状态良好',
  streak: 12,
  trend: 'up',
})
const quickActions = ref(mockQuickActions)
const visible = ref(false)

// 尝试从 API 获取 AI 真实建议
async function fetchAiAdvice() {
  try {
    const advice = await getDailyAdvice('user_demo_001')
    if (advice) {
      // 动态更新 hero 的 message 为 AI 生成的建议
      hero.value.message = `${advice.study?.content || ''}\n\n${advice.food?.content || ''}\n\n${advice.emotion?.content || ''}`
      if (advice.summary) {
        hero.value.growthStatus = advice.summary
      }
    }
  } catch {
    // API 不可用时静默降级，保持 mock 数据
  }
}

onMounted(() => {
  requestAnimationFrame(() => { visible.value = true })
  fetchAiAdvice()
})

const iconMap: Record<string, any> = {
  CalendarCheck, Timer, MessageCircleHeart,
}

function handleAction(route?: string) {
  if (route) router.push(route)
}

const trendIcon = hero.value.trend === 'up' ? '↗' : hero.value.trend === 'down' ? '↘' : '→'
const trendClass = hero.value.trend === 'up' ? 'trend-up' : hero.value.trend === 'down' ? 'trend-down' : 'trend-stable'
</script>

<template>
  <section class="hero" :class="{ 'hero--visible': visible }">
    <div class="hero__card">
      <!-- ====== 左侧：AI 角色 ====== -->
      <div class="hero__left">
        <div class="hero__avatar-wrap">
          <!-- 呼吸动画容器 -->
          <div class="hero__avatar-breathe">
            <FsAiAvatar
              :size="'xl'"
              :mood="'happy'"
              :status="'idle'"
              :show-pulse="true"
              :show-status-dot="true"
            />
          </div>
          <!-- 外围柔光 -->
          <div class="hero__avatar-glow" />
        </div>
        <div class="hero__ai-label">
          <Sparkles :size="14" />
          <span>你的 AI 伙伴</span>
        </div>
      </div>

      <!-- ====== 中央：AI 说话 ====== -->
      <div class="hero__center">
        <h2 class="hero__greeting">
          {{ hero.greeting }}，{{ hero.userName }} <span class="hero__wave">👋</span>
        </h2>
        <p class="hero__message">{{ hero.message }}</p>
        <div v-if="quickActions.length > 0" class="hero__actions">
          <button
            v-for="action in quickActions"
            :key="action.id"
            class="hero__action-btn"
            @click="handleAction(action.route)"
          >
            <span class="hero__action-emoji">{{ action.icon }}</span>
            <span>{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- ====== 右侧：成长概览 ====== -->
      <div class="hero__right">
        <div class="hero__stat-main">
          <span class="hero__stat-label">今日成长值</span>
          <div class="hero__stat-score">
            <span class="hero__stat-number">{{ hero.growthScore }}</span>
            <span class="hero__stat-unit">分</span>
          </div>
        </div>
        <div class="hero__stat-list">
          <div class="hero__stat-item">
            <span class="hero__stat-item-label">今日状态</span>
            <span class="hero__stat-item-value">{{ hero.statusEmoji }} {{ hero.growthStatus }}</span>
          </div>
          <div class="hero__stat-item">
            <span class="hero__stat-item-label">连续坚持</span>
            <span class="hero__stat-item-value">{{ hero.streak }} 天</span>
          </div>
          <div class="hero__stat-item">
            <span class="hero__stat-item-label">成长趋势</span>
            <span class="hero__stat-item-value" :class="trendClass">
              {{ trendIcon }} 上升
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   TodayHero — 页面视觉中心
   高度 280px · 三栏布局 · AI 生命动画
   ============================================================ */

.hero {
  max-width: 1100px;
  margin: 0 auto 32px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 500ms var(--fs-ease-out);
}
.hero--visible {
  opacity: 1;
  transform: translateY(0);
}

.hero__card {
  display: flex;
  align-items: stretch;
  min-height: 280px;
  padding: 32px 36px;
  background: linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 50%, #F0F5FF 100%);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: var(--fs-radius-xl);
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.05), 0 8px 32px rgba(59, 130, 246, 0.06);
  position: relative;
  overflow: hidden;
  gap: 32px;
}

/* 顶部微光 */
.hero__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.5;
}

/* ===== 左侧：AI 角色 ===== */
.hero__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-shrink: 0;
  width: 140px;
}
.hero__avatar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero__avatar-breathe {
  animation: hero-breathe 4s ease-in-out infinite;
  position: relative;
  z-index: 1;
}
.hero__avatar-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  animation: hero-glow 3s ease-in-out infinite;
}
.hero__ai-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: var(--fs-brand-500);
  padding: 4px 12px;
  background: var(--fs-brand-50);
  border-radius: var(--fs-radius-full);
}

/* ===== 中央：AI 说话 ===== */
.hero__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}
.hero__greeting {
  font-size: 24px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.hero__wave {
  display: inline-block;
  animation: wave 1.5s ease-in-out infinite;
  transform-origin: 70% 70%;
}
.hero__message {
  font-size: 15px;
  color: var(--fs-neutral-600);
  line-height: 1.75;
  white-space: pre-line;
  margin-bottom: 20px;
  max-width: 540px;
}
.hero__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.hero__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  color: var(--fs-brand-600);
  background: var(--fs-brand-50);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: var(--fs-radius-full);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
}
.hero__action-btn:hover {
  background: var(--fs-brand-100);
  border-color: rgba(59, 130, 246, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}
.hero__action-btn:active {
  transform: scale(0.97);
}

/* ===== 右侧：成长概览 ===== */
.hero__right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  flex-shrink: 0;
  width: 160px;
  padding-left: 24px;
  border-left: 1px solid var(--fs-neutral-100);
}
.hero__stat-main {
  text-align: center;
}
.hero__stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--fs-neutral-400);
  text-transform: none;
  letter-spacing: 0.02em;
}
.hero__stat-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  margin-top: 4px;
}
.hero__stat-number {
  font-size: 48px;
  font-weight: 700;
  color: var(--fs-brand-500);
  line-height: 1;
  letter-spacing: -0.03em;
}
.hero__stat-unit {
  font-size: 14px;
  font-weight: 500;
  color: var(--fs-brand-400);
}
.hero__stat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hero__stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hero__stat-item-label {
  font-size: 12px;
  color: var(--fs-neutral-400);
}
.hero__stat-item-value {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fs-neutral-700);
}
.trend-up    { color: #22C55E !important; }
.trend-down  { color: var(--fs-error-500) !important; }
.trend-stable{ color: var(--fs-neutral-500) !important; }

/* ===== 动画 ===== */
@keyframes hero-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}
@keyframes hero-glow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.08); }
}
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25%      { transform: rotate(14deg); }
  50%      { transform: rotate(0deg); }
  75%      { transform: rotate(-14deg); }
}
</style>
