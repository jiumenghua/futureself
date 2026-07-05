<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import {
  Calendar, Sprout, Compass, MessageCircleHeart, User, Sparkles
} from 'lucide-vue-next'

const route = useRoute()
const store = useAppStore()

const navItems = [
  { id: 'today',    label: 'Today',    icon: Calendar,           route: '/today' },
  { id: 'journey',  label: 'Journey',  icon: Sprout,             route: '/journey' },
  { id: 'discover', label: 'Discover', icon: Compass,            route: '/discover' },
  { id: 'chat',     label: 'FutureSelf',icon: MessageCircleHeart,route: '/chat' },
  { id: 'me',       label: 'Me',       icon: User,               route: '/me' },
]

function isActive(routePath: string) {
  return route.path === routePath
}
</script>

<template>
  <aside class="sidebar">
    <!-- ==================== Logo 区域 ==================== -->
    <div class="sidebar__brand">
      <div class="sidebar__logo">
        <div class="sidebar__logo-icon">
          <Sparkles :size="20" stroke-width="2.5" />
        </div>
        <span class="sidebar__logo-text">FutureSelf</span>
      </div>
      <p class="sidebar__logo-sub">Your AI Companion</p>
    </div>

    <!-- ==================== 导航菜单 ==================== -->
    <nav class="sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.id"
        :to="item.route"
        class="sidebar__nav-item"
        :class="{ 'sidebar__nav-item--active': isActive(item.route) }"
      >
        <component :is="item.icon" :size="20" stroke-width="1.75" class="sidebar__nav-icon" />
        <span class="sidebar__nav-label">{{ item.label }}</span>

        <!-- FutureSelf 菜单的未读标记 -->
        <span
          v-if="item.id === 'chat' && store.unreadInsightCount > 0"
          class="sidebar__nav-badge"
        >
          {{ store.unreadInsightCount }}
        </span>
      </router-link>
    </nav>

    <!-- ==================== 底部：版本号 ==================== -->
    <div class="sidebar__footer">
      <div class="sidebar__version">
        <span class="sidebar__version-dot" />
        FutureSelf v1.0
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ============================================================
   Sidebar — 全局侧边导航
   宽度：240px（CSS 变量 --fs-sidebar-width）
   ============================================================ */

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--fs-sidebar-width);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 14px 20px;
  background: var(--fs-neutral-0);
  border-right: 1px solid var(--fs-neutral-200);
  z-index: 100;
  user-select: none;
}

/* ===== Brand / Logo ===== */
.sidebar__brand {
  padding: 0 10px;
  margin-bottom: 32px;
}
.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sidebar__logo-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fs-ai-gradient);
  border-radius: var(--fs-radius-md);
  color: #ffffff;
  flex-shrink: 0;
}
.sidebar__logo-text {
  font-size: 19px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.03em;
}
.sidebar__logo-sub {
  margin-top: 6px;
  padding-left: 44px;
  font-size: 11.5px;
  font-weight: 400;
  color: var(--fs-neutral-400);
  letter-spacing: 0.02em;
}

/* ===== 导航 ===== */
.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 10px;
  font-size: 15px;
  font-weight: 500;
  color: var(--fs-neutral-600);
  border-radius: var(--fs-radius-md);
  text-decoration: none;
  position: relative;
  transition:
    background 150ms var(--fs-ease-out),
    color 150ms var(--fs-ease-out),
    padding-left 250ms var(--fs-ease-spring);
}
.sidebar__nav-item:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-800);
  padding-left: 14px;
}
.sidebar__nav-item--active {
  background: var(--fs-brand-50);
  color: var(--fs-brand-600);
  font-weight: 600;
}
.sidebar__nav-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--fs-brand-500);
  border-radius: 0 3px 3px 0;
}
.sidebar__nav-item--active:hover {
  padding-left: 10px; /* 激活态不复用位移效果 */
}
.sidebar__nav-icon {
  flex-shrink: 0;
  transition: color 150ms var(--fs-ease-out);
}
.sidebar__nav-label {
  white-space: nowrap;
}

/* 未读标记 */
.sidebar__nav-badge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: var(--fs-brand-500);
  border-radius: var(--fs-radius-full);
  padding: 0 6px;
  line-height: 1;
}

/* ===== 底部 ===== */
.sidebar__footer {
  padding: 16px 10px 0;
  border-top: 1px solid var(--fs-neutral-200);
}
.sidebar__version {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 500;
  color: var(--fs-neutral-400);
}
.sidebar__version-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--fs-radius-full);
  background: #22C55E;
  box-shadow: 0 0 5px rgba(34, 197, 94, 0.35);
  flex-shrink: 0;
}
</style>
