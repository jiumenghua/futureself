<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import DiscoverCapabilityCard from './DiscoverCapabilityCard.vue'
import DietRecommendModal from '@/components/common/DietRecommendModal.vue'
import { Zap } from 'lucide-vue-next'
import { mockCapabilities } from '@/mock/discover'

const router = useRouter()
const appStore = useAppStore()
const capabilities = mockCapabilities

// ---- 饮食推荐弹窗 ----
const showDietModal = ref(false)

function handleSelect(id: string) {
  switch (id) {
    case 'c1': // 智能对话 → FutureSelf 聊天页
      router.push('/FutureSelf')
      break
    case 'c2': // 日程管理 → 成长时间轴
      router.push('/Journey')
      break
    case 'c3': // 成长追踪 → 成长时间轴
      router.push('/Journey')
      break
    case 'c4': // 饮食推荐 → 弹窗
      showDietModal.value = true
      break
    case 'c5': // 学习分析 → Me 页面（滚动到学习画像）
      router.push('/Me')
      setTimeout(() => {
        const el = document.getElementById('growth-profile')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
      break
    case 'c6': // 智能提醒 → 打开通知中心
      appStore.toggleNotificationPanel()
      break
    default:
      break
  }
}
</script>

<template>
  <section class="caps">
    <div class="caps__header">
      <Zap :size="18" stroke-width="1.75" class="caps__header-icon" />
      <h3 class="caps__title">AI 能力中心</h3>
      <span class="caps__subtitle">6 位 AI Agent，主动陪伴你的每一天</span>
    </div>

    <div v-if="capabilities.length > 0" class="caps__grid">
      <DiscoverCapabilityCard
        v-for="(card, i) in capabilities"
        :key="card.id"
        :card="card"
        :delay="120 * i"
        @select="handleSelect"
      />
    </div>
    <p v-else class="caps__empty">暂无可用能力</p>

    <!-- 饮食推荐弹窗 -->
    <DietRecommendModal :visible="showDietModal" @close="showDietModal = false" />
  </section>
</template>

<style scoped>
.caps {
  max-width: 1100px;
  margin: 0 auto 40px;
}

.caps__header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 20px;
}
.caps__header-icon { color: var(--fs-brand-500); }
.caps__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fs-neutral-800);
}
.caps__subtitle {
  font-size: 13px;
  color: var(--fs-neutral-400);
  margin-left: 4px;
}

.caps__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.caps__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}
</style>
