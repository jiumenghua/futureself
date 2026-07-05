import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/today',
  },
  {
    path: '/today',
    name: 'Today',
    component: () => import('@/views/today/TodayPage.vue'),
    meta: { title: '今天', icon: 'Calendar' },
  },
  {
    path: '/journey',
    name: 'Journey',
    component: () => import('@/views/journey/JourneyPage.vue'),
    meta: { title: '成长', icon: 'TrendingUp' },
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/discover/DiscoverPage.vue'),
    meta: { title: '探索', icon: 'Compass' },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/ChatPage.vue'),
    meta: { title: 'FutureSelf', icon: 'MessageCircle' },
  },
  {
    path: '/FutureSelf',
    name: 'FutureSelf',
    component: () => import('@/views/chat/ChatPage.vue'),
    meta: { title: 'FutureSelf', icon: 'MessageCircle' },
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/views/me/MePage.vue'),
    meta: { title: '我的', icon: 'User' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
