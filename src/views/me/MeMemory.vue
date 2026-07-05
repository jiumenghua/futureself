<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { getMemories, type AiMemoryItem } from '@/api/user'
import { Brain, Heart, Clock, Star, Calendar } from 'lucide-vue-next'

const store = useAppStore()
const memories = ref<AiMemoryItem[]>([])
const isLoading = ref(false)

const typeMeta: Record<string, { icon: any; color: string; label: string }> = {
  habit:      { icon: Clock,   color: '#3B82F6', label: '习惯' },
  preference: { icon: Heart,   color: '#EC4899', label: '偏好' },
  achievement:{ icon: Star,    color: '#F59E0B', label: '成就' },
  concern:    { icon: Calendar,color: '#22C55E', label: '关注' },
}

async function loadMemories() {
  isLoading.value = true
  try {
    memories.value = await getMemories('user_demo_001')
  } catch { memories.value = [] }
  finally { isLoading.value = false }
}

onMounted(loadMemories)
watch(() => store.profileVersion, loadMemories)
</script>

<template>
  <section class="mm">
    <div class="mm__header">
      <Brain :size="18" stroke-width="1.75" class="mm__icon" />
      <h3 class="mm__title">Memory</h3>
      <span class="mm__sub">FutureSelf 记住的关于你的一切</span>
    </div>
    <div v-if="isLoading" class="mm__loading">加载中…</div>
    <div v-else-if="memories.length > 0" class="mm__grid">
      <div
        v-for="mem in memories"
        :key="mem.id"
        class="mm__card"
        :style="{ borderLeftColor: (typeMeta[mem.category] || typeMeta.preference).color }"
      >
        <div class="mm__card-top">
          <component :is="(typeMeta[mem.category] || typeMeta.preference).icon" :size="14" :style="{ color: (typeMeta[mem.category] || typeMeta.preference).color }" />
          <span class="mm__card-type" :style="{ color: (typeMeta[mem.category] || typeMeta.preference).color }">
            {{ (typeMeta[mem.category] || typeMeta.preference).label }}
          </span>
        </div>
        <p class="mm__card-content">{{ mem.tag }}</p>
        <span v-if="mem.updatedAt" class="mm__card-date">{{ new Date(mem.updatedAt).toLocaleDateString('zh-CN') }}</span>
      </div>
    </div>
    <p v-else class="mm__empty">FutureSelf 还在慢慢认识你。去和它聊聊天吧。</p>
  </section>
</template>

<style scoped>
.mm { max-width: 1100px; margin: 0 auto 32px; }
.mm__header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 18px; }
.mm__icon { color: var(--fs-brand-500); }
.mm__title { font-size: 18px; font-weight: 700; color: var(--fs-neutral-800); }
.mm__sub { font-size: 13px; color: var(--fs-neutral-400); margin-left: 4px; }
.mm__loading { text-align: center; font-size: 14px; color: var(--fs-neutral-400); padding: 24px; }
.mm__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.mm__card {
  padding: 16px 18px; background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200); border-left: 3px solid var(--fs-brand-500);
  border-radius: var(--fs-radius-md);
  transition: all 200ms;
}
.mm__card:hover { box-shadow: var(--fs-shadow-sm); transform: translateY(-1px); }
.mm__card-top { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
.mm__card-type { font-size: 11.5px; font-weight: 600; }
.mm__card-content { font-size: 13px; color: var(--fs-neutral-600); line-height: 1.55; }
.mm__card-date { display: block; margin-top: 8px; font-size: 11px; color: var(--fs-neutral-400); }
.mm__empty { font-size: 14px; color: var(--fs-neutral-400); font-style: italic; }
</style>
