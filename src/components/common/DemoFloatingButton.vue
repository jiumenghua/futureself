<script setup lang="ts">
// ============================================================
// DemoFloatingButton.vue — 答辩演示全局悬浮按钮
// 右下角常驻，点击展开面板一键触发全部主动交互演示
// 纯前端模拟触发，不调用后端接口
// ============================================================

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useChatStore } from '@/stores/chatStore'
import { Sparkles, Heart, Coffee, MessageCircle } from 'lucide-vue-next'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()

// ---- 面板开关 ----
const panelOpen = ref(false)

function togglePanel() {
  panelOpen.value = !panelOpen.value
}

function closePanel() {
  panelOpen.value = false
}

// ---- 按钮1：触发情绪关怀气泡 ----
function triggerEmotionCare() {
  closePanel()
  appStore.triggerEmotionBubble('我感受到你现在情绪很低落，别硬扛，有什么心事都可以和我说')
}

// ---- 按钮2：触发久坐学习提醒气泡 ----
function triggerSedentaryRemind() {
  closePanel()
  appStore.triggerProactiveBubble(
    '你已经连续学习45分钟啦，起身拉伸一下，喝点水放松片刻吧',
    undefined,
    'sedentary_remind'
  )
}

// ---- 按钮3：AI主动发起聊天 ----
async function triggerAiChat() {
  closePanel()
  await router.push('/FutureSelf')
  // 等待路由跳转和页面渲染
  setTimeout(() => {
    const msg: { id: string; role: 'ai'; content: string; timestamp: string } = {
      id: 'demo_ai_' + Date.now(),
      role: 'ai',
      content: '哈喽，看你今天学习时长不少，要不要和我聊聊今天的学习收获？',
      timestamp: new Date().toISOString(),
    }
    chatStore.messages.push(msg)
  }, 500)
}

// ---- 点击面板外部关闭 ----
function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('dfb-popover-overlay')) {
    closePanel()
  }
}
</script>

<template>
  <!-- 面板外遮罩（仅面板打开时显示，点击关闭） -->
  <Teleport to="body">
    <div
      v-if="panelOpen"
      class="dfb-popover-overlay"
      @click="onOverlayClick"
    />

    <!-- 面板 + 按钮容器 -->
    <div class="dfb-root">
      <!-- Popover 面板 -->
      <transition name="dfb-panel">
        <div v-if="panelOpen" class="dfb-panel">
          <div class="dfb-panel__header">
            <Sparkles :size="14" stroke-width="1.5" />
            <span>演示主动陪伴</span>
          </div>

          <p class="dfb-panel__note">答辩演示专用，一键体验AI主动陪伴能力</p>

          <div class="dfb-panel__actions">
            <!-- 按钮1：情绪关怀 -->
            <button class="dfb-action" @click="triggerEmotionCare">
              <span class="dfb-action__icon dfb-action__icon--emotion">
                <Heart :size="16" stroke-width="1.75" />
              </span>
              <div class="dfb-action__text">
                <span class="dfb-action__label">触发情绪关怀</span>
                <span class="dfb-action__desc">弹出情绪关怀悬浮气泡</span>
              </div>
            </button>

            <!-- 按钮2：久坐提醒 -->
            <button class="dfb-action" @click="triggerSedentaryRemind">
              <span class="dfb-action__icon dfb-action__icon--sedentary">
                <Coffee :size="16" stroke-width="1.75" />
              </span>
              <div class="dfb-action__text">
                <span class="dfb-action__label">触发久坐提醒</span>
                <span class="dfb-action__desc">弹出久坐提醒 + 双按钮气泡</span>
              </div>
            </button>

            <!-- 按钮3：AI主动搭讪 -->
            <button class="dfb-action" @click="triggerAiChat">
              <span class="dfb-action__icon dfb-action__icon--chat">
                <MessageCircle :size="16" stroke-width="1.75" />
              </span>
              <div class="dfb-action__text">
                <span class="dfb-action__label">AI主动发起聊天</span>
                <span class="dfb-action__desc">跳转聊天页 + 自动搭讪消息</span>
              </div>
            </button>
          </div>
        </div>
      </transition>

      <!-- 主悬浮按钮 -->
      <button
        class="dfb-btn"
        :class="{ 'dfb-btn--active': panelOpen }"
        @click="togglePanel"
      >
        <Sparkles :size="18" stroke-width="1.5" />
        <span class="dfb-btn__text">演示主动陪伴</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
/* ===== 容器 ===== */
.dfb-root {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

/* ===== 遮罩层 ===== */
.dfb-popover-overlay {
  position: fixed;
  inset: 0;
  z-index: 9997;
  background: transparent;
}

/* ===== 主按钮 ===== */
.dfb-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  background: var(--fs-ai-gradient);
  border: none;
  border-radius: 22px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  transition: all 250ms var(--fs-ease-out);
  white-space: nowrap;
}
.dfb-btn:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 28px rgba(59, 130, 246, 0.4);
}
.dfb-btn--active {
  transform: scale(0.96);
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.2);
}
.dfb-btn__text {
  font-size: 13px;
  letter-spacing: 0.01em;
}

/* ===== Popover 面板 ===== */
.dfb-panel {
  width: 300px;
  background: #fff;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(19, 22, 54, 0.14);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dfb-panel__header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--fs-neutral-800);
}
.dfb-panel__header :deep(svg) {
  color: var(--fs-brand-500);
}
.dfb-panel__note {
  font-size: 11.5px;
  color: var(--fs-neutral-400);
  line-height: 1.5;
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--fs-neutral-100);
}

/* ===== 功能按钮列表 ===== */
.dfb-panel__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dfb-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-150);
  border-radius: 10px;
  cursor: pointer;
  transition: all 180ms var(--fs-ease-out);
  text-align: left;
  font-family: var(--fs-font-sans);
}
.dfb-action:hover {
  background: rgba(59, 130, 246, 0.04);
  border-color: rgba(59, 130, 246, 0.15);
  transform: translateX(2px);
}

.dfb-action__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dfb-action__icon--emotion {
  background: rgba(239, 68, 68, 0.08);
  color: #EF4444;
}
.dfb-action__icon--sedentary {
  background: rgba(245, 158, 11, 0.08);
  color: #F59E0B;
}
.dfb-action__icon--chat {
  background: rgba(59, 130, 246, 0.08);
  color: var(--fs-brand-500);
}

.dfb-action__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dfb-action__label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--fs-neutral-800);
}
.dfb-action__desc {
  font-size: 11.5px;
  color: var(--fs-neutral-400);
  line-height: 1.4;
}

/* ===== 面板进出动画 ===== */
.dfb-panel-enter-active {
  transition: all 250ms var(--fs-ease-out);
}
.dfb-panel-leave-active {
  transition: all 180ms var(--fs-ease-in);
}
.dfb-panel-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
.dfb-panel-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.97);
}
</style>
