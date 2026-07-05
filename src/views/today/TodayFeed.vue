<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, ChevronRight } from 'lucide-vue-next'
import { mockFeedItems } from '@/mock/today'

const router = useRouter()
const items = ref<any[]>(mockFeedItems)
const visibleItems = ref<Set<string>>(new Set())

onMounted(() => {
  // 卡片依次淡入
  items.value.forEach((item, i) => {
    setTimeout(() => {
      visibleItems.value.add(item.id)
      // 触发响应式更新
      visibleItems.value = new Set(visibleItems.value)
    }, 150 + i * 100)
  })
})

function handleAction(item: any) {
  if (item.actionRoute) router.push(item.actionRoute)
}

const typeColors: Record<string, string> = {
  learning:   '#3B82F6',
  life:       '#EC4899',
  emotion:    '#8B5CF6',
  suggestion: '#F59E0B',
  summary:    '#22C55E',
}
</script>

<template>
  <section class="feed">
    <!-- 标题 -->
    <div class="feed__header">
      <div class="feed__header-left">
        <Sparkles :size="18" stroke-width="1.75" class="feed__header-icon" />
        <h3 class="feed__title">FutureSelf 今天想告诉你</h3>
      </div>
      <span class="feed__count">{{ items.length }} 条新发现</span>
    </div>

    <!-- 信息流 -->
    <div v-if="items.length > 0" class="feed__list">
      <article
        v-for="item in items"
        :key="item.id"
        class="feed__item"
        :class="{ 'feed__item--visible': visibleItems.has(item.id) }"
        @click="handleAction(item)"
      >
        <!-- 左侧图标 -->
        <div
          class="feed__item-icon"
          :style="{ background: typeColors[item.type] + '14', color: typeColors[item.type] }"
        >
          {{ item.icon }}
        </div>

        <!-- 内容 -->
        <div class="feed__item-body">
          <div class="feed__item-meta">
            <span
              class="feed__item-type"
              :style="{ color: typeColors[item.type] }"
            >
              {{ item.type === 'learning' ? '学习' : item.type === 'life' ? '生活' : item.type === 'emotion' ? '情绪' : item.type === 'suggestion' ? '建议' : '总结' }}
            </span>
            <span class="feed__item-time">{{ item.time }}</span>
          </div>
          <h4 class="feed__item-title">{{ item.title }}</h4>
          <p class="feed__item-text">{{ item.content }}</p>
          <button class="feed__item-action" @click.stop="handleAction(item)">
            <span>{{ item.actionLabel }}</span>
            <ChevronRight :size="14" />
          </button>
        </div>
      </article>
    </div>
    <p v-else class="feed__empty">暂无动态</p>
  </section>
</template>

<style scoped>
/* ============================================================
   TodayFeed — FutureSelf 今天想告诉你
   AI 朋友圈风格信息流
   ============================================================ */

.feed {
  max-width: 1100px;
  margin: 0 auto 32px;
}

/* ===== Header ===== */
.feed__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.feed__header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.feed__header-icon {
  color: var(--fs-brand-500);
}
.feed__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.01em;
}
.feed__count {
  font-size: 13px;
  color: var(--fs-neutral-400);
  font-weight: 500;
}

/* ===== 列表 ===== */
.feed__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ===== 单项 ===== */
.feed__item {
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  cursor: pointer;
  transition: all 250ms var(--fs-ease-out);
  opacity: 0;
  transform: translateY(12px);
}
.feed__item--visible {
  opacity: 1;
  transform: translateY(0);
}
.feed__item:hover {
  border-color: rgba(59, 130, 246, 0.15);
  box-shadow: var(--fs-shadow-sm);
  transform: translateY(-1px);
}

/* 图标 */
.feed__item-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--fs-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

/* 内容 */
.feed__item-body {
  flex: 1;
  min-width: 0;
}
.feed__item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}
.feed__item-type {
  font-size: 11.5px;
  font-weight: 600;
}
.feed__item-time {
  font-size: 11.5px;
  color: var(--fs-neutral-400);
}
.feed__item-title {
  font-size: 15.5px;
  font-weight: 600;
  color: var(--fs-neutral-800);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}
.feed__item-text {
  font-size: 13.5px;
  color: var(--fs-neutral-600);
  line-height: 1.55;
  max-width: 100%;
  margin-bottom: 10px;
}
.feed__item-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  color: var(--fs-brand-500);
  background: var(--fs-brand-50);
  border: none;
  border-radius: var(--fs-radius-sm);
  cursor: pointer;
  transition: all 150ms;
}
.feed__item-action:hover {
  background: var(--fs-brand-100);
}

.feed__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 14px;
  color: var(--fs-neutral-400);
}
</style>
