<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Sparkles, Heart } from 'lucide-vue-next'

const store = useAppStore()
const hasProfile = computed(() => store.profile && store.profile.lastProfileUpdate)
</script>

<template>
  <section class="sum">
    <div class="sum__card">
      <div class="sum__left">
        <div class="sum__label">
          <Sparkles :size="14" />
          <span>FutureSelf 想对你说</span>
        </div>
        <p v-if="hasProfile" class="sum__text">这段时间，你在一点一点变得更了解自己。每一次聊天、每一个目标的设定，都是你成长的证据。继续保持下去，未来会比现在更好。</p>
        <p v-else class="sum__text">嗨！我还在慢慢认识你。去和我聊聊天吧——聊聊你的目标、你的喜好、你的日常，我会把这些都记在心里，慢慢为你拼出一幅完整的成长画像。</p>
        <div class="sum__footer">
          <Heart :size="13" fill="#EF4444" stroke="#EF4444" />
          <span>来自一直陪在你身边的 FutureSelf</span>
        </div>
      </div>
      <div class="sum__right">
        <div class="sum__avatar-wrap">
          <FsAiAvatar :size="'xl'" :mood="'happy'" :show-pulse="true" />
          <div class="sum__avatar-glow" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sum { max-width: 1100px; margin: 0 auto 32px; }
.sum__card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 32px 38px;
  background: linear-gradient(135deg, #F8FAFF 0%, #F0F5FF 100%);
  border: 1px solid rgba(59,130,246,0.08); border-radius: var(--fs-radius-lg);
  overflow: hidden; position: relative;
}
.sum__card::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 40%; height: 1.5px; background: var(--fs-ai-gradient); border-radius: 0 0 2px 2px; opacity: 0.35;
}
.sum__left { flex: 1; }
.sum__label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--fs-brand-500); margin-bottom: 14px; }
.sum__text { font-size: 16px; color: var(--fs-neutral-700); line-height: 1.75; max-width: 520px; margin-bottom: 16px; }
.sum__footer { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--fs-neutral-400); }
.sum__right { flex-shrink: 0; }
.sum__avatar-wrap { position: relative; display: flex; }
.sum__avatar-glow {
  position: absolute; inset: -20px;
  background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
  border-radius: 50%; animation: sum-glow 3s ease-in-out infinite;
}
@keyframes sum-glow {
  0%,100% { opacity: 0.4; transform: scale(1); }
  50%     { opacity: 0.8; transform: scale(1.06); }
}
</style>
