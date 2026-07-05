<script setup lang="ts">
// ============================================================
// MeGrowthProfile.vue — AI 成长档案
// FutureSelf 对你的了解 — 展示型卡片，非输入型
// 数据来源：GET /api/profile（MongoDB）
// ============================================================

import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { Brain, School, BookOpen, GraduationCap, Target, BookMarked, UtensilsCrossed, BrainCircuit, Sparkles, Clock } from 'lucide-vue-next'

const store = useAppStore()
const profile = computed(() => store.profile)
const hasProfile = computed(() => profile.value && profile.value.lastProfileUpdate)

// ---- 计算相对时间 ----
const relativeTime = computed(() => {
  if (!profile.value?.lastProfileUpdate) return ''
  const now = Date.now()
  const updated = new Date(profile.value.lastProfileUpdate).getTime()
  const diffMs = now - updated
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '刚刚更新'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay}天前`
})
</script>

<template>
  <section class="mgp" id="growth-profile">
    <!-- ====== 头部 ====== -->
    <div class="mgp__header">
      <div class="mgp__header-left">
        <Brain :size="20" stroke-width="1.75" class="mgp__header-icon" />
        <div>
          <h2 class="mgp__title">FutureSelf 对你的了解</h2>
          <p class="mgp__subtitle">以下内容由 FutureSelf 根据与你的聊天持续更新。</p>
        </div>
      </div>
      <div v-if="hasProfile" class="mgp__header-right">
        <Clock :size="13" stroke-width="1.75" />
        <span>更新于 {{ relativeTime }}</span>
      </div>
    </div>

    <!-- ====== 空状态：尚未建立档案 ====== -->
    <div v-if="!hasProfile" class="mgp__empty">
      <Sparkles :size="32" stroke-width="1.5" class="mgp__empty-icon" />
      <p class="mgp__empty-title">FutureSelf 还在慢慢认识你。</p>
      <p class="mgp__empty-desc">去和 FutureSelf 聊聊天吧，它会逐渐了解你的学校、专业、目标、习惯和偏好，在这里为你建立一份专属成长档案。</p>
    </div>

    <!-- ====== 主体内容 ====== -->
    <div v-else class="mgp__body">

      <!-- 第一行：当前身份（三列卡片） -->
      <div class="mgp__identity-row">
        <div class="mgp__identity-card">
          <div class="mgp__identity-icon-wrap">
            <School :size="18" stroke-width="1.5" />
          </div>
          <span class="mgp__identity-label">学校</span>
          <span class="mgp__identity-value">{{ profile?.school || '—' }}</span>
        </div>
        <div class="mgp__identity-card">
          <div class="mgp__identity-icon-wrap">
            <BookOpen :size="18" stroke-width="1.5" />
          </div>
          <span class="mgp__identity-label">专业</span>
          <span class="mgp__identity-value">{{ profile?.major || '—' }}</span>
        </div>
        <div class="mgp__identity-card">
          <div class="mgp__identity-icon-wrap">
            <GraduationCap :size="18" stroke-width="1.5" />
          </div>
          <span class="mgp__identity-label">年级</span>
          <span class="mgp__identity-value">{{ profile?.grade || '—' }}</span>
        </div>
      </div>

      <!-- 第二行：成长目标 + 学习画像 + 饮食画像 -->
      <div class="mgp__grid-3">
        <!-- 成长目标 -->
        <div class="mgp__panel">
          <div class="mgp__panel-hd">
            <Target :size="15" stroke-width="1.75" class="mgp__panel-icon mgp__panel-icon--amber" />
            <span>成长目标</span>
          </div>
          <div v-if="profile?.goals?.length" class="mgp__tags">
            <span v-for="goal in profile.goals" :key="goal" class="mgp__tag">{{ goal }}</span>
          </div>
          <p v-else class="mgp__hint">去和 FutureSelf 聊聊你的目标吧</p>
        </div>

        <!-- 学习画像 -->
        <div class="mgp__panel">
          <div class="mgp__panel-hd">
            <BookMarked :size="15" stroke-width="1.75" class="mgp__panel-icon mgp__panel-icon--blue" />
            <span>学习画像</span>
          </div>
          <ul v-if="profile?.studyProfile?.length" class="mgp__list">
            <li v-for="(item, i) in profile.studyProfile" :key="i">{{ item }}</li>
          </ul>
          <p v-else class="mgp__hint">还未了解你的学习习惯</p>
        </div>

        <!-- 饮食画像 -->
        <div class="mgp__panel">
          <div class="mgp__panel-hd">
            <UtensilsCrossed :size="15" stroke-width="1.75" class="mgp__panel-icon mgp__panel-icon--green" />
            <span>饮食画像</span>
          </div>
          <ul v-if="profile?.foodProfile?.length" class="mgp__list">
            <li v-for="(item, i) in profile.foodProfile" :key="i">{{ item }}</li>
          </ul>
          <p v-else class="mgp__hint">还未了解你的饮食偏好</p>
        </div>
      </div>

      <!-- 第三行：性格画像 + AI 最近的新发现 -->
      <div class="mgp__grid-2">
        <!-- 性格画像 -->
        <div class="mgp__panel">
          <div class="mgp__panel-hd">
            <BrainCircuit :size="15" stroke-width="1.75" class="mgp__panel-icon mgp__panel-icon--purple" />
            <span>性格画像</span>
          </div>
          <ul v-if="profile?.personalityProfile?.length" class="mgp__list">
            <li v-for="(item, i) in profile.personalityProfile" :key="i">{{ item }}</li>
          </ul>
          <p v-else class="mgp__hint">还未了解你的性格特点</p>
        </div>

        <!-- AI 最近的新发现 -->
        <div class="mgp__discoveries">
          <div class="mgp__discoveries-hd">
            <Sparkles :size="15" stroke-width="1.75" />
            <span>AI 最近的新发现</span>
          </div>
          <ul v-if="profile?.recentDiscoveries?.length" class="mgp__discoveries-list">
            <li v-for="(item, i) in profile.recentDiscoveries" :key="i">
              <span class="mgp__discoveries-check">✔</span>
              {{ item }}
            </li>
          </ul>
          <p v-else class="mgp__hint mgp__hint--discoveries">继续聊天，AI 会不断有新的发现</p>
          <div class="mgp__discoveries-ft">
            <p v-if="hasProfile" class="mgp__discoveries-time">更新时间：{{ relativeTime }}</p>
            <p class="mgp__discoveries-note">FutureSelf 会持续成长，对你的了解也会不断更新。</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.mgp {
  max-width: 1100px;
  margin: 0 auto 32px;
  padding: 28px 32px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-xl);
}

/* ---- 头部 ---- */
.mgp__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--fs-neutral-100);
}
.mgp__header-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.mgp__header-icon {
  color: var(--fs-brand-500);
  margin-top: 2px;
  flex-shrink: 0;
}
.mgp__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.01em;
  margin: 0;
}
.mgp__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--fs-neutral-400);
}
.mgp__header-right {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--fs-neutral-400);
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

/* ---- 主体 ---- */
.mgp__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ---- 身份卡片行 ---- */
.mgp__identity-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.mgp__identity-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 16px;
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-150);
  border-radius: var(--fs-radius-lg);
}
.mgp__identity-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--fs-radius-md);
  background: var(--fs-brand-50);
  color: var(--fs-brand-500);
  display: flex;
  align-items: center;
  justify-content: center;
}
.mgp__identity-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--fs-neutral-400);
}
.mgp__identity-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--fs-neutral-700);
  text-align: center;
}

/* ---- 通用面板 ---- */
.mgp__panel {
  padding: 16px 18px;
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-150);
  border-radius: var(--fs-radius-lg);
}
.mgp__panel-hd {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--fs-neutral-700);
}
.mgp__panel-icon { flex-shrink: 0; }
.mgp__panel-icon--amber { color: #f59e0b; }
.mgp__panel-icon--blue  { color: #3b82f6; }
.mgp__panel-icon--green { color: #22c55e; }
.mgp__panel-icon--purple { color: #8b5cf6; }

/* ---- 标签 ---- */
.mgp__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.mgp__tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--fs-brand-600);
  background: var(--fs-brand-50);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: var(--fs-radius-full);
}

/* ---- 列表 ---- */
.mgp__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mgp__list li {
  position: relative;
  padding-left: 14px;
  font-size: 13px;
  color: var(--fs-neutral-600);
  line-height: 1.5;
}
.mgp__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--fs-neutral-300);
}

/* ---- 网格 ---- */
.mgp__grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.mgp__grid-2 {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 12px;
}

/* ---- AI 新发现卡片 ---- */
.mgp__discoveries {
  padding: 18px 20px;
  background: rgba(59, 130, 246, 0.04);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: var(--fs-radius-lg);
}
.mgp__discoveries-hd {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--fs-brand-600);
}
.mgp__discoveries-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mgp__discoveries-list li {
  font-size: 13.5px;
  color: var(--fs-neutral-700);
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.mgp__discoveries-check {
  color: var(--fs-brand-500);
  font-weight: 600;
  flex-shrink: 0;
}
.mgp__discoveries-ft {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(59, 130, 246, 0.1);
}
.mgp__discoveries-time {
  font-size: 12px;
  color: var(--fs-neutral-400);
  margin: 0;
}
.mgp__discoveries-note {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--fs-neutral-400);
  font-style: italic;
}

/* ---- 空状态 ---- */
.mgp__empty {
  text-align: center;
  padding: 48px 24px;
}
.mgp__empty-icon {
  color: var(--fs-brand-300);
  margin-bottom: 16px;
}
.mgp__empty-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--fs-neutral-500);
  margin: 0 0 8px;
}
.mgp__empty-desc {
  font-size: 14px;
  color: var(--fs-neutral-400);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* ---- 占位提示 ---- */
.mgp__hint {
  font-size: 13px;
  color: var(--fs-neutral-400);
  font-style: italic;
  margin: 0;
  padding: 8px 0;
}
.mgp__hint--discoveries {
  color: rgba(59, 130, 246, 0.5);
}

/* ---- 响应式 ---- */
@media (max-width: 900px) {
  .mgp__grid-3,
  .mgp__identity-row {
    grid-template-columns: 1fr;
  }
  .mgp__grid-2 {
    grid-template-columns: 1fr;
  }
  .mgp__header {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
