<script setup lang="ts">
// ============================================================
// NotificationCenter.vue — 通知中心下拉面板
// 毛玻璃风格，点击铃铛展开，收纳所有 AI 主动提醒
// ============================================================

import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { Check, BellOff } from 'lucide-vue-next'

const store = useAppStore()
const router = useRouter()

// ---- 类型标签配置 ----
const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  study:   { label: '学习', bg: 'rgba(59,130,246,0.08)',  text: 'var(--fs-brand-600)' },
  diet:    { label: '饮食', bg: 'rgba(34,197,94,0.08)',   text: '#16a34a' },
  schedule:{ label: '日程', bg: 'rgba(245,158,11,0.08)',   text: '#d97706' },
  growth:  { label: '成长', bg: 'rgba(168,85,247,0.08)',   text: '#9333ea' },
}

// ---- 相对时间格式化 ----
function relativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return '刚刚'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} 分钟前`
  const hour = Math.floor(min / 60)
  if (hour < 24) {
    const d = new Date(iso)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `今天 ${hh}:${mm}`
  }
  const d = new Date(iso)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

// ---- 已排序的通知列表 ----
const sortedNotifications = computed(() =>
  [...store.notifications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
)

// ---- 点击单条：展开/跳转 ----
function handleItemClick(item: (typeof store.notifications)[0]) {
  // 标记已读
  if (!item.isRead) store.markNotificationRead(item._id)
  // 有关联路径则跳转
  if (item.relatedPath) {
    store.closeNotificationPanel()
    router.push(item.relatedPath)
  }
}

// ---- 点击外部关闭 ----
function onOverlayClick() {
  store.closeNotificationPanel()
}

// ---- Escape 关闭 ----
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.isNotificationPanelOpen) {
    store.closeNotificationPanel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  store.loadNotifications()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <!-- 透明遮罩（点击关闭） -->
    <transition name="nc-fade">
      <div v-if="store.isNotificationPanelOpen" class="nc-overlay" @click="onOverlayClick" />
    </transition>

    <!-- 面板本体 -->
    <transition name="nc-slide">
      <div v-if="store.isNotificationPanelOpen" class="nc-panel">
        <!-- 头部 -->
        <div class="nc-hd">
          <h3 class="nc-title">消息提醒</h3>
          <button
            v-if="store.unreadNotificationCount > 0"
            class="nc-read-all"
            @click="store.markAllNotificationsRead()"
          >
            <Check :size="14" /> 全部已读
          </button>
        </div>

        <!-- 列表 -->
        <div class="nc-list">
          <!-- 加载中 -->
          <div v-if="store.isLoadingNotifications" class="nc-empty">加载中…</div>

          <!-- 空状态 -->
          <div v-else-if="!sortedNotifications.length" class="nc-empty">
            <BellOff :size="28" stroke-width="1.5" />
            <p>暂无新提醒</p>
            <span>AI 推送的提醒会出现在这里</span>
          </div>

          <!-- 通知条目 -->
          <template v-else>
            <div
              v-for="item in sortedNotifications"
              :key="item._id"
              class="nc-item"
              :class="{ 'nc-item--unread': !item.isRead }"
              @click="handleItemClick(item)"
            >
              <!-- 类型标签 -->
              <span class="nc-item-tag" :style="{ background: typeConfig[item.type]?.bg, color: typeConfig[item.type]?.text }">
                {{ typeConfig[item.type]?.label || item.type }}
              </span>
              <!-- 标题 -->
              <p class="nc-item-title">{{ item.title }}</p>
              <!-- 内容（2行截断） -->
              <p v-if="item.content" class="nc-item-content">{{ item.content }}</p>
              <!-- 时间 -->
              <span class="nc-item-time">{{ relativeTime(item.createdAt) }}</span>
              <!-- 未读圆点 -->
              <span v-if="!item.isRead" class="nc-item-dot" />
            </div>
          </template>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ===== 遮罩 ===== */
.nc-overlay {
  position: fixed; inset: 0; z-index: 10050;
}
.nc-fade-enter-active { transition: opacity 150ms var(--fs-ease-out); }
.nc-fade-leave-active { transition: opacity 120ms var(--fs-ease-out); }
.nc-fade-enter-from, .nc-fade-leave-to { opacity: 0; }

/* ===== 面板 ===== */
.nc-panel {
  position: fixed;
  top: 62px;          /* 紧贴 TopBar 下沿（高度 72px） */
  right: 140px;       /* 对齐铃铛图标位置 */
  width: 340px;
  max-height: 520px;
  z-index: 10051;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.04),
    0 12px 48px rgba(19, 22, 54, 0.13);
  overflow: hidden;
}

/* 动画 */
.nc-slide-enter-active { animation: nc-in 220ms var(--fs-ease-spring); }
.nc-slide-leave-active { animation: nc-out 150ms var(--fs-ease-out); }
.nc-slide-enter-from, .nc-slide-leave-to { opacity: 0; }
@keyframes nc-in {
  from { opacity:0; transform:translateY(-10px) scale(0.95); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes nc-out {
  from { opacity:1; transform:translateY(0) scale(1); }
  to   { opacity:0; transform:translateY(-8px) scale(0.96); }
}

/* ===== 头部 ===== */
.nc-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px 12px; border-bottom: 1px solid var(--fs-neutral-100);
  flex-shrink: 0;
}
.nc-title {
  font-size: 15px; font-weight: 700; color: var(--fs-neutral-800);
}
.nc-read-all {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 12px; font-size: 12px; font-weight: 500; font-family: var(--fs-font-sans);
  color: var(--fs-brand-500); background: var(--fs-brand-50);
  border: none; border-radius: var(--fs-radius-full); cursor: pointer;
  transition: all 120ms;
}
.nc-read-all:hover { background: var(--fs-brand-100); }

/* ===== 列表 ===== */
.nc-list {
  flex: 1; overflow-y: auto; padding: 6px 0;
}
.nc-list::-webkit-scrollbar { width: 4px; }
.nc-list::-webkit-scrollbar-thumb { background: var(--fs-neutral-200); border-radius: 2px; }

/* 空状态 */
.nc-empty {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 40px 20px; text-align: center;
  color: var(--fs-neutral-400);
}
.nc-empty p { font-size: 14px; font-weight: 500; color: var(--fs-neutral-500); margin: 0; }
.nc-empty span { font-size: 12px; }

/* ===== 条目 ===== */
.nc-item {
  position: relative;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 120ms;
  border-bottom: 1px solid var(--fs-neutral-50);
}
.nc-item:last-child { border-bottom: none; }
.nc-item:hover { background: var(--fs-neutral-50); }
.nc-item--unread { background: rgba(59, 130, 246, 0.02); }
.nc-item--unread:hover { background: var(--fs-neutral-50); }

.nc-item-tag {
  display: inline-block; padding: 2px 8px;
  font-size: 11px; font-weight: 600; border-radius: var(--fs-radius-xs);
  margin-bottom: 6px;
}
.nc-item-title {
  font-size: 14px; font-weight: 600; color: var(--fs-neutral-800);
  margin-bottom: 4px; line-height: 1.35;
}
.nc-item-content {
  font-size: 13px; color: var(--fs-neutral-500); line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; margin-bottom: 6px;
}
.nc-item-time {
  font-size: 11px; color: var(--fs-neutral-400);
}
.nc-item-dot {
  position: absolute; top: 16px; right: 16px;
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--fs-brand-500);
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.4);
}
</style>
