<script setup lang="ts">
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Heart } from 'lucide-vue-next'

const brandMessage = { title: 'FutureSelf', quote: '成长不是今天突然变优秀，而是每天比昨天更进一步。' }
</script>

<template>
  <section class="brand">
    <div class="brand__card">
      <div class="brand__left">
        <h2 class="brand__title">{{ brandMessage.title }}</h2>
        <p class="brand__quote">"{{ brandMessage.quote }}"</p>
        <div class="brand__heart">
          <Heart :size="14" fill="#EF4444" stroke="#EF4444" />
          <span>Made with care</span>
        </div>
      </div>
      <div class="brand__right">
        <div class="brand__avatar-wrap">
          <FsAiAvatar :size="'xl'" :mood="'happy'" :show-pulse="true" />
          <div class="brand__avatar-glow" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brand {
  max-width: 1100px;
  margin: 0 auto 48px;
}
.brand__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36px 42px;
  background: linear-gradient(135deg, #F8FAFF 0%, #F0F5FF 100%);
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: var(--fs-radius-lg);
  position: relative;
  overflow: hidden;
}
.brand__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 1.5px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.35;
}

.brand__left {
  flex: 1;
}
.brand__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}
.brand__quote {
  font-size: 17px;
  font-weight: 500;
  color: var(--fs-neutral-600);
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 16px;
}
.brand__heart {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--fs-neutral-400);
}

.brand__right { flex-shrink: 0; }
.brand__avatar-wrap {
  position: relative;
  display: flex;
}
.brand__avatar-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
  border-radius: 50%;
  animation: brand-glow 3s ease-in-out infinite;
}

@keyframes brand-glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%      { opacity: 0.8; transform: scale(1.06); }
}
</style>
