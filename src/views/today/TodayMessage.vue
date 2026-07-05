<script setup lang="ts">
import { computed } from 'vue'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Heart } from 'lucide-vue-next'

const mockTodayMessage = computed(() => ({
  quote: '每一天，都是遇见更好自己的新旅程。',
  author: 'FutureSelf',
}))
</script>

<template>
  <section class="message">
    <div class="message__card">
      <div class="message__left">
        <p class="message__quote">"{{ mockTodayMessage.quote }}"</p>
        <div class="message__author">
          <Heart :size="13" fill="#EF4444" stroke="#EF4444" />
          <span>{{ mockTodayMessage.author }}</span>
        </div>
      </div>
      <div class="message__right">
        <div class="message__avatar-wrap">
          <FsAiAvatar :size="'lg'" :mood="'happy'" :show-status-dot="false" />
          <div class="message__avatar-glow" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   TodayMessage — 今日寄语
   页面底部 · 温暖收尾
   ============================================================ */

.message {
  max-width: 1100px;
  margin: 0 auto 40px;
}

.message__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 36px;
  background: linear-gradient(135deg, #F8FAFF 0%, #F0F5FF 100%);
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: var(--fs-radius-lg);
  position: relative;
  overflow: hidden;
}

/* 顶部微光 */
.message__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 1.5px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.4;
}

/* ===== 左侧文字 ===== */
.message__left {
  flex: 1;
}
.message__quote {
  font-size: 20px;
  font-weight: 600;
  color: var(--fs-neutral-700);
  line-height: 1.5;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
  max-width: 520px;
}
.message__author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-500);
}

/* ===== 右侧 AI 形象 ===== */
.message__right {
  flex-shrink: 0;
}
.message__avatar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.message__avatar-glow {
  position: absolute;
  inset: -16px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: message-glow 3s ease-in-out infinite;
}

@keyframes message-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.8; transform: scale(1.05); }
}
</style>
