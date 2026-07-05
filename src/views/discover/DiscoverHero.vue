<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Sparkles, Play } from 'lucide-vue-next'

const router = useRouter()

const discoverHero = {
  title: '发现更多可能',
  description: 'FutureSelf 正在不断成长中，更多能力即将上线。',
  primaryAction: '开始探索',
}

const visible = ref(false)
onMounted(() => requestAnimationFrame(() => { visible.value = true }))
</script>

<template>
  <section class="d-hero" :class="{ 'd-hero--visible': visible }">
    <div class="d-hero__card">
      <!-- 左侧：AI 形象 -->
      <div class="d-hero__left">
        <div class="d-hero__avatar-wrap">
          <div class="d-hero__avatar-breathe">
            <FsAiAvatar :size="'xl'" :mood="'happy'" :show-pulse="true" :show-status-dot="true" />
          </div>
          <div class="d-hero__avatar-glow" />
        </div>
        <div class="d-hero__ai-badge">
          <Sparkles :size="13" />
          <span>AI Capability Center</span>
        </div>
      </div>

      <!-- 右侧：介绍 -->
      <div class="d-hero__right">
        <h2 class="d-hero__title">{{ discoverHero.title }}</h2>
        <p class="d-hero__desc">{{ discoverHero.description }}</p>
        <div class="d-hero__actions">
          <button class="d-hero__btn d-hero__btn--primary" @click="router.push('/FutureSelf')">
            <Play :size="16" />
            <span>{{ discoverHero.primaryAction }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.d-hero {
  max-width: 1100px;
  margin: 0 auto 40px;
  opacity: 0;
  transform: translateY(16px);
  transition: all 500ms var(--fs-ease-out);
}
.d-hero--visible { opacity: 1; transform: translateY(0); }

.d-hero__card {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 40px 48px;
  background: linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 50%, #F0F5FF 100%);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: var(--fs-radius-xl);
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.04), 0 8px 32px rgba(59, 130, 246, 0.05);
  position: relative;
  overflow: hidden;
}
.d-hero__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.4;
}

/* 左侧 AI */
.d-hero__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.d-hero__avatar-wrap {
  position: relative;
  display: flex;
}
.d-hero__avatar-breathe {
  animation: d-breathe 4s ease-in-out infinite;
  position: relative;
  z-index: 1;
}
.d-hero__avatar-glow {
  position: absolute;
  inset: -24px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  animation: d-glow 3s ease-in-out infinite;
}
.d-hero__ai-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--fs-brand-500);
  padding: 5px 14px;
  background: var(--fs-brand-50);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: var(--fs-radius-full);
}

/* 右侧内容 */
.d-hero__right {
  flex: 1;
  min-width: 0;
}
.d-hero__title {
  font-size: 26px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}
.d-hero__desc {
  font-size: 15.5px;
  color: var(--fs-neutral-600);
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 540px;
}
.d-hero__actions {
  display: flex;
  gap: 12px;
}
.d-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  border-radius: var(--fs-radius-full);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
}
.d-hero__btn--primary {
  color: #fff;
  background: var(--fs-ai-gradient);
  border: none;
}
.d-hero__btn--primary:hover {
  opacity: 0.92;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
  transform: translateY(-1px);
}
.d-hero__btn--secondary {
  color: var(--fs-neutral-700);
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
}
.d-hero__btn--secondary:hover {
  background: var(--fs-neutral-50);
  border-color: var(--fs-neutral-300);
}

@keyframes d-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.04); }
}
@keyframes d-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%      { opacity: 0.9; transform: scale(1.08); }
}
</style>
