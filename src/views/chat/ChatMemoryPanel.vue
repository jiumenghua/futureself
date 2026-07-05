<script setup lang="ts">
// ============================================================
// ChatMemoryPanel.vue — 右侧「FutureSelf 对你的了解」面板
// 展示成长档案 + AI 记忆，数据来自 appStore.profile
// ============================================================

import { ref, onMounted, watch, computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { getMemories, type AiMemoryItem } from '@/api/user'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Brain, Sparkles, School, BookOpen, GraduationCap, Target, BookMarked, UtensilsCrossed, BrainCircuit, Clock } from 'lucide-vue-next'

const store = useAppStore()
const profile = computed(() => store.profile)
const hasProfile = computed(() => profile.value && profile.value.lastProfileUpdate)

// ---- 相对时间 ----
const relativeTime = computed(() => {
  if (!profile.value?.lastProfileUpdate) return ''
  const now = Date.now()
  const updated = new Date(profile.value.lastProfileUpdate).getTime()
  const diffMin = Math.floor((now - updated) / 60000)
  if (diffMin < 1) return '刚刚更新'
  if (diffMin < 60) return `${diffMin}分钟前`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}小时前`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay}天前`
})

// ---- AI 记忆 ----
const rawMemories = ref<AiMemoryItem[]>([])
const isLoading = ref(false)

const CATEGORY_META: Record<string, { icon: string; color: string; label: string }> = {
  habit:       { icon: '🔄', color: '#3B82F6', label: '习惯' },
  preference:  { icon: '❤️', color: '#EC4899', label: '偏好' },
  achievement: { icon: '⭐', color: '#F59E0B', label: '成就' },
  concern:     { icon: '📌', color: '#22C55E', label: '关注' },
}

interface GroupedMemory {
  category: string
  icon: string
  color: string
  label: string
  items: string[]
}

const groupedMemories = computed<GroupedMemory[]>(() => {
  const groups: Record<string, string[]> = {}
  for (const m of rawMemories.value) {
    const cat = m.category || 'preference'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(m.tag)
  }
  return Object.entries(groups).map(([cat, items]) => {
    const meta = CATEGORY_META[cat] || CATEGORY_META.preference
    return { category: cat, ...meta, items }
  })
})

async function loadMemories() {
  isLoading.value = true
  try { rawMemories.value = await getMemories('user_demo_001') }
  catch { rawMemories.value = [] }
  finally { isLoading.value = false }
}

onMounted(loadMemories)
watch(() => store.profileVersion, loadMemories)
</script>

<template>
  <aside class="memory">
    <!-- ====== 头部 ====== -->
    <div class="memory__header">
      <div class="memory__header-top">
        <FsAiAvatar :size="'sm'" :mood="'happy'" :show-status-dot="true" />
        <div>
          <h4 class="memory__title">FutureSelf 对你的了解</h4>
        </div>
      </div>
      <p class="memory__sub">这些是我在陪伴中逐渐了解到的</p>
    </div>

    <!-- ====== 成长档案内容 ====== -->
    <div class="memory__body">

      <!-- 当前身份 -->
      <div v-if="hasProfile" class="mp-section">
        <div class="mp-section-hd">
          <School :size="13" stroke-width="1.5" />
          <span>当前身份</span>
        </div>
        <div class="mp-identity-row">
          <span class="mp-identity-tag">{{ profile?.school || '—' }}</span>
          <span class="mp-identity-tag">{{ profile?.major || '—' }}</span>
          <span class="mp-identity-tag">{{ profile?.grade || '—' }}</span>
        </div>
      </div>

      <!-- 成长目标 -->
      <div v-if="profile?.goals?.length" class="mp-section">
        <div class="mp-section-hd">
          <Target :size="13" stroke-width="1.5" />
          <span>成长目标</span>
        </div>
        <div class="mp-tags">
          <span v-for="goal in profile.goals" :key="goal" class="mp-tag">{{ goal }}</span>
        </div>
      </div>

      <!-- 学习画像 -->
      <div v-if="profile?.studyProfile?.length" class="mp-section">
        <div class="mp-section-hd">
          <BookMarked :size="13" stroke-width="1.5" />
          <span>学习画像</span>
        </div>
        <ul class="mp-list">
          <li v-for="(item, i) in profile.studyProfile" :key="i">{{ item }}</li>
        </ul>
      </div>

      <!-- 饮食画像 -->
      <div v-if="profile?.foodProfile?.length" class="mp-section">
        <div class="mp-section-hd">
          <UtensilsCrossed :size="13" stroke-width="1.5" />
          <span>饮食画像</span>
        </div>
        <ul class="mp-list">
          <li v-for="(item, i) in profile.foodProfile" :key="i">{{ item }}</li>
        </ul>
      </div>

      <!-- 性格画像 -->
      <div v-if="profile?.personalityProfile?.length" class="mp-section">
        <div class="mp-section-hd">
          <BrainCircuit :size="13" stroke-width="1.5" />
          <span>性格画像</span>
        </div>
        <ul class="mp-list">
          <li v-for="(item, i) in profile.personalityProfile" :key="i">{{ item }}</li>
        </ul>
      </div>

      <!-- AI 最近的新发现 -->
      <div v-if="profile?.recentDiscoveries?.length" class="mp-section mp-section--discoveries">
        <div class="mp-section-hd mp-section-hd--brand">
          <Sparkles :size="13" stroke-width="1.5" />
          <span>AI 最近的新发现</span>
        </div>
        <ul class="mp-discoveries-list">
          <li v-for="(item, i) in profile.recentDiscoveries" :key="i">
            <span class="mp-check">✔</span>
            {{ item }}
          </li>
        </ul>
        <p v-if="relativeTime" class="mp-update-time">
          <Clock :size="11" stroke-width="1.5" />
          更新于 {{ relativeTime }}
        </p>
      </div>

      <!-- ====== AI 记忆标签 ====== -->
      <div class="mp-divider" />
      <div v-if="isLoading" class="memory__loading">加载中…</div>
      <div v-for="mem in groupedMemories" :key="mem.category" class="mp-section">
        <div class="mp-section-hd">
          <span class="mp-section-emoji">{{ mem.icon }}</span>
          <span :style="{ color: mem.color }">{{ mem.label }}</span>
        </div>
        <div class="mp-tags">
          <span
            v-for="item in mem.items" :key="item"
            class="mp-tag"
            :style="{ background: mem.color + '10', color: mem.color, borderColor: mem.color + '20' }"
          >{{ item }}</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!isLoading && !hasProfile && groupedMemories.length === 0" class="memory__empty">
        <Sparkles :size="20" stroke-width="1.5" style="color:var(--fs-brand-300);margin-bottom:8px;" />
        <p>FutureSelf 还在慢慢认识你。</p>
        <p class="memory__empty-sub">去聊聊天吧，它会逐渐了解你。</p>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="memory__footnote">
      <Brain :size="13" stroke-width="1.5" />
      <span>陪你的第 42 天，越来越了解你了</span>
    </div>
  </aside>
</template>

<style scoped>
.memory {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--fs-neutral-200);
  background: linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%);
  flex-shrink: 0;
  overflow-y: auto;
}

/* ---- 头部 ---- */
.memory__header {
  padding: 20px 18px 14px;
  border-bottom: 1px solid var(--fs-neutral-100);
  flex-shrink: 0;
}
.memory__header-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.memory__title { font-size: 15px; font-weight: 700; color: var(--fs-neutral-800); letter-spacing: -0.01em; }
.memory__sub { font-size: 12px; color: var(--fs-neutral-400); padding-left: 42px; }

/* ---- 主体滚动区 ---- */
.memory__body {
  flex: 1;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

/* ---- 通用小节 ---- */
.mp-section {
  /* 无额外 wrapper */
}
.mp-section--discoveries {
  padding: 12px 14px;
  background: rgba(59, 130, 246, 0.04);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: var(--fs-radius-md);
}
.mp-section-hd {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--fs-neutral-600);
}
.mp-section-hd--brand { color: var(--fs-brand-600); }
.mp-section-emoji { font-size: 13px; }

/* ---- 当前身份 ---- */
.mp-identity-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.mp-identity-tag {
  display: inline-block;
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--fs-brand-600);
  background: var(--fs-brand-50);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: var(--fs-radius-sm);
}

/* ---- 标签组 ---- */
.mp-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.mp-tag {
  display: inline-block;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid;
  border-radius: var(--fs-radius-sm);
}

/* ---- 画像列表 ---- */
.mp-list {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 5px;
}
.mp-list li {
  position: relative; padding-left: 12px;
  font-size: 12px; color: var(--fs-neutral-600); line-height: 1.5;
}
.mp-list li::before {
  content: ''; position: absolute; left: 0; top: 7px;
  width: 4px; height: 4px; border-radius: 50%; background: var(--fs-neutral-300);
}

/* ---- AI 新发现 ---- */
.mp-discoveries-list {
  list-style: none; margin: 0; padding: 0;
  display: flex; flex-direction: column; gap: 7px;
}
.mp-discoveries-list li {
  font-size: 12px; color: var(--fs-neutral-700); line-height: 1.5;
  display: flex; align-items: flex-start; gap: 6px;
}
.mp-check { color: var(--fs-brand-500); font-weight: 600; flex-shrink: 0; font-size: 11px; }
.mp-update-time {
  margin: 8px 0 0; font-size: 10.5px; color: var(--fs-neutral-400);
  display: flex; align-items: center; gap: 3px;
}

/* ---- 分割线 ---- */
.mp-divider {
  height: 1px;
  background: var(--fs-neutral-100);
  margin: 2px 0;
}

.memory__loading { text-align: center; font-size: 12px; color: var(--fs-neutral-400); padding: 12px; }
.memory__empty {
  text-align: center; font-size: 12px; color: var(--fs-neutral-400); padding: 16px 0;
  display: flex; flex-direction: column; align-items: center;
}
.memory__empty p { margin: 0; }
.memory__empty-sub { font-size: 11px; color: var(--fs-neutral-300); margin-top: 4px !important; }

/* ---- 底部 ---- */
.memory__footnote {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 12px 14px; font-size: 11px; color: var(--fs-neutral-400);
  border-top: 1px solid var(--fs-neutral-100); flex-shrink: 0;
}
</style>
