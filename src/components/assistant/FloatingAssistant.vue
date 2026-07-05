<script setup lang="ts">
// ============================================================
// FloatingAssistant.vue — FutureSelf 全局悬浮 AI 伙伴
// 主协调器：组合 Avatar、Panel、ContextMenu
// 负责拖拽、停靠、面板展开
//
// 设计理念：
// - 永远存在，永不消失
// - 不主动打扰用户
// - 可自由拖拽到任意位置
// - 靠近边缘自动停靠（Edge Dock Mode）
// ============================================================

import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssistantStore, BALL_SIZE } from '@/stores/assistantStore'
import { useAppStore } from '@/stores/appStore'
import { useDragController } from '@/hooks/useDragController'
import { useDockController } from '@/hooks/useDockController'
import { reportBehavior } from '@/api/behavior(DeepSeek API)'
import AssistantAvatar from './AssistantAvatar.vue'
import AssistantPanel from './AssistantPanel.vue'
import AssistantBubble from './AssistantBubble.vue'
import AssistantContextMenu from './AssistantContextMenu.vue'

const router = useRouter()
const DEFAULT_USER_ID = 'user_demo_001'

// ---- Store & Controllers ----
const store = useAssistantStore()
const appStore = useAppStore()
const { begin, move, end, hasMoved } = useDragController()
const { onHoverEnter, onHoverLeave, onPanelClosed } = useDockController()

// ============================================================
// 演示用：F3/F4 快捷键触发气泡（纯前端模拟，用于录屏演示）
// F2 已改为真实久坐行为上报（见下方 onKeyDown）
// ============================================================
const demoBubbleMessage = ref('')
const showDemoBubble = ref(false)
const demoBubbleRoute = ref<string | null>(null)
let demoBubbleTimer: ReturnType<typeof setTimeout> | null = null

function triggerDemoBubble(message: string, route?: string) {
  demoBubbleMessage.value = message
  demoBubbleRoute.value = route || null
  showDemoBubble.value = true
  if (demoBubbleTimer) clearTimeout(demoBubbleTimer)
  demoBubbleTimer = setTimeout(() => {
    showDemoBubble.value = false
  }, 30000)  // 30 秒自动消失
}

function handleDemoBubbleClick() {
  if (demoBubbleRoute.value) {
    showDemoBubble.value = false
    if (demoBubbleTimer) clearTimeout(demoBubbleTimer)
    router.push(demoBubbleRoute.value)
  }
}

// ---- 久坐提醒「再学10分钟」推迟 ----
function handleSedentaryDefer() {
  appStore.setSedentaryDefer(10 * 60)  // 10 分钟 = 600 秒
  appStore.dismissProactiveBubble()
}

// 全局键盘监听（页面销毁时自动解绑）
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'F2') {
    e.preventDefault()
    // F2: 演示触发久坐行为上报
    reportBehavior(DEFAULT_USER_ID, 'sedentary_45min')
  } else if (e.key === 'F3') {
    e.preventDefault()
    triggerDemoBubble('看你忙了一会儿啦，要不要和我聊聊最近的状态？', '/chat')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  if (demoBubbleTimer) clearTimeout(demoBubbleTimer)
})

// ---- 饭点气泡点击 → 跳转 Today ----
function handleBubbleClick() {
  appStore.dismissMealBubble()
  router.push('/today')
}

// ---- 面板关闭时触发延迟缩回 ----
watch(() => store.isOpen, (isOpen, wasOpen) => {
  if (!isOpen && wasOpen) {
    onPanelClosed()
  }
})

// ---- 头像上的 pointerdown ----
function handleAvatarPointerDown(e: PointerEvent) {
  if (e.button === 2) return // 右键不触发拖拽
  if (e.button === 0) {
    e.preventDefault()
    begin(e)
  }
}

// ---- 拖拽 overlay 事件 ----
function handleOverlayMove(e: PointerEvent) {
  move(e)
}

function handleOverlayUp(e: PointerEvent) {
  end()
}

// ---- 点击 / 双击 ----
function handleAvatarClick() {
  if (hasMoved()) return
  store.togglePanel()
}

function handleAvatarDblClick() {
  if (hasMoved()) return
  store.toggleDock()
}

// ---- 右键 ----
function handleAvatarContextMenu(e: MouseEvent) {
  e.preventDefault()
  store.showContextMenu = true
  store.contextMenuPos = { x: e.clientX, y: e.clientY }
}

// ---- 计算样式 ----
const wrapperStyle = computed(() => ({
  left: store.cssLeft + 'px',
  top: store.position.y + 'px',
  transition: store.shouldAnimate
    ? 'left 300ms cubic-bezier(0.65, 0, 0.35, 1)'
    : 'none',
}))

// 面板对齐方向
const stageAlign = computed(() => {
  const ballCenter = store.position.x + BALL_SIZE / 2
  return ballCenter < window.innerWidth / 2 ? 'left' : 'right'
})
</script>

<template>
  <Teleport to="body">
    <!-- ========== 右键菜单 ========== -->
    <AssistantContextMenu />

    <!-- ========== 拖拽遮罩层（仅在拖拽时渲染） ========== -->
    <div
      v-if="store.isDragging"
      class="fa-drag-overlay"
      @pointermove="handleOverlayMove"
      @pointerup="handleOverlayUp"
      @pointercancel="handleOverlayUp"
      @contextmenu.prevent
    />

    <!-- ========== 悬浮助手容器 ========== -->
    <div
      class="fa-wrapper"
      :class="{
        'fa-wrapper--dragging': store.isDragging,
        'fa-wrapper--docked': store.isDocked,
      }"
      :style="wrapperStyle"
      @mouseenter="onHoverEnter"
      @mouseleave="onHoverLeave"
    >
      <div
        class="fa-stage"
        :class="{
          'fa-stage--align-left': stageAlign === 'left',
          'fa-stage--align-right': stageAlign === 'right',
        }"
      >
        <!-- 快捷面板 -->
        <transition name="panel">
          <div v-if="store.isOpen" class="fa-panel-wrap">
            <AssistantPanel />
          </div>
        </transition>

        <!-- 饭点提醒气泡 -->
        <div
          v-if="appStore.showMealBubble && appStore.mealBubbleMessage"
          class="fa-meal-bubble"
          @click.stop="handleBubbleClick"
        >
          <span class="fa-meal-bubble__text">{{ appStore.mealBubbleMessage }}</span>
          <span class="fa-meal-bubble__hint">点击查看详情 →</span>
        </div>

        <!-- 演示用：快捷键触发气泡（F2/F3）— 左弹出，渐变蓝背景 -->
        <div
          v-if="showDemoBubble && demoBubbleMessage"
          class="fa-demo-bubble"
          @click.stop="handleDemoBubbleClick"
        >
          <!-- 尾部箭头指向右侧悬浮球 -->
          <div class="fa-demo-bubble__arrow" />
          <span class="fa-demo-bubble__text">{{ demoBubbleMessage }}</span>
          <span v-if="demoBubbleRoute" class="fa-demo-bubble__hint">点击和我聊天 →</span>
        </div>

        <!-- 演示用：情绪关怀气泡（F4 →「想休息一下」触发）— 渐变蓝左弹出 -->
        <div
          v-if="appStore.showEmotionBubble && appStore.emotionBubbleMessage"
          class="fa-emotion-bubble"
        >
          <button class="fa-bubble-close" @click.stop="appStore.dismissEmotionBubble()" aria-label="关闭">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="fa-emotion-bubble__arrow" />
          <span class="fa-emotion-bubble__text">{{ appStore.emotionBubbleMessage }}</span>
        </div>

        <!-- 主动轮询气泡（后台通知驱动）— 渐变蓝左弹出 -->
        <div
          v-if="appStore.showProactiveBubble && appStore.proactiveBubbleMessage"
          class="fa-emotion-bubble"
        >
          <button class="fa-bubble-close" @click.stop="appStore.dismissProactiveBubble()" aria-label="关闭">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div class="fa-emotion-bubble__arrow" />
          <span class="fa-emotion-bubble__text">{{ appStore.proactiveBubbleMessage }}</span>
          <!-- 久坐提醒专用底部按钮 -->
          <div
            v-if="appStore.proactiveNotifyType === 'sedentary_remind'"
            class="fa-sedentary-bubble__actions"
          >
            <button class="fa-sedentary-bubble__btn fa-sedentary-bubble__btn--defer" @click.stop="handleSedentaryDefer()">
              再学10分钟
            </button>
            <button class="fa-sedentary-bubble__btn fa-sedentary-bubble__btn--dismiss" @click.stop="appStore.dismissProactiveBubble()">
              知道了
            </button>
          </div>
        </div>

        <!-- 悬浮头像球 -->
        <AssistantAvatar
          :is-hovering="store.isHovering && !store.isDragging"
          :is-open="store.isOpen"
          :is-dragging="store.isDragging"
          :unread-count="0"
          @pointerdown="handleAvatarPointerDown"
          @click="handleAvatarClick"
          @dblclick="handleAvatarDblClick"
          @contextmenu="handleAvatarContextMenu"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ============================================================
   FloatingAssistant — 悬浮助手容器样式
   ============================================================ */

/* ---- 拖拽全局遮罩层 ---- */
.fa-drag-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  cursor: grabbing;
  background: transparent;
  /* 遮罩层捕获所有事件，确保拖拽不丢失 */
}

/* ---- 主容器 ---- */
.fa-wrapper {
  position: fixed;
  z-index: 9999;
  /* transition 由 JS 动态设置（left + dock 动画） */
}

.fa-wrapper--dragging {
  z-index: 10000;
}

/* ---- 内容区域 ---- */
.fa-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fa-stage--align-left {
  align-items: flex-start;
}

.fa-stage--align-right {
  align-items: flex-end;
}

/* ---- 面板容器 ---- */
.fa-panel-wrap {
  margin-bottom: 4px;
}

/* ============================================================
   面板过渡动画
   ============================================================ */
.panel-enter-active {
  animation: panel-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.panel-leave-active {
  animation: panel-out 180ms var(--fs-ease-out) both;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes panel-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(6px);
  }
}

/* 饭点提醒气泡（保持原有样式不变） */
.fa-meal-bubble {
  position: absolute;
  bottom: calc(100% + 10px);
  right: -8px;
  max-width: 260px;
  z-index: 20;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(19, 22, 54, 0.12);
  cursor: pointer;
  pointer-events: auto;
  animation: meal-bubble-in 350ms var(--fs-ease-spring) both;
}
.fa-meal-bubble__text {
  display: block;
  font-size: 13px; font-weight: 500; color: var(--fs-neutral-700);
  line-height: 1.5; margin-bottom: 6px;
}
.fa-meal-bubble__hint {
  font-size: 11px; color: var(--fs-brand-500); font-weight: 500;
}

/* ============================================================
   演示用气泡：左弹出 + 渐变蓝背景 + 白色文字（用于录屏）
   ============================================================ */
.fa-demo-bubble {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 52px;           /* 从悬浮球左侧弹出 */
  width: 320px;
  z-index: 21;
  padding: 18px 20px;
  /* 品牌渐变蓝：左浅右深，柔和线性过渡 */
  background: linear-gradient(135deg, #4A90D9 0%, #3B6FB5 40%, #2D5A9E 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 6px 28px rgba(45, 90, 158, 0.28);
  cursor: pointer;
  pointer-events: auto;
  animation: demo-bubble-in 350ms var(--fs-ease-spring) both;
}
.fa-demo-bubble__arrow {
  position: absolute;
  right: -8px;
  bottom: 18px;
  width: 0; height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #3466A8;  /* 箭头颜色匹配右侧背景，指向悬浮球 */
}
.fa-demo-bubble__text {
  display: block;
  font-size: 14.5px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1.6;
  margin-bottom: 8px;
}
.fa-demo-bubble__hint {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}
@keyframes demo-bubble-in {
  from { opacity:0; transform:translateX(8px) scale(0.92); }
  to   { opacity:1; transform:translateX(0) scale(1); }
}

/* ============================================================
   情绪 / 主动通知气泡 — 渐变蓝左弹出 + 白色文字（共用样式）
   ============================================================ */
.fa-emotion-bubble {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 52px;
  width: 300px;
  z-index: 21;
  padding: 18px 32px 18px 20px;
  background: linear-gradient(135deg, #4A90D9 0%, #3B6FB5 40%, #2D5A9E 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 6px 28px rgba(45, 90, 158, 0.28);
  cursor: default;
  pointer-events: auto;
  animation: emotion-bubble-in 350ms var(--fs-ease-spring) both;
}
/* 通用关闭按钮 */
.fa-bubble-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 150ms;
  padding: 0;
}
.fa-bubble-close:hover {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}
.fa-emotion-bubble__arrow {
  position: absolute;
  right: -8px;
  bottom: 18px;
  width: 0; height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #3466A8;
}
.fa-emotion-bubble__text {
  display: block;
  font-size: 14.5px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1.6;
}
@keyframes emotion-bubble-in {
  from { opacity:0; transform:translateX(8px) scale(0.92); }
  to   { opacity:1; transform:translateX(0) scale(1); }
}

/* ============================================================
   久坐提醒气泡底部按钮
   ============================================================ */
.fa-sedentary-bubble__actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  justify-content: flex-end;
}
.fa-sedentary-bubble__btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.fa-sedentary-bubble__btn:hover {
  background: rgba(255, 255, 255, 0.28);
}
.fa-sedentary-bubble__btn--dismiss {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
.fa-sedentary-bubble__btn--defer {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
