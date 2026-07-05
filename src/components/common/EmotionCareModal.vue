<script setup lang="ts">
// ============================================================
// EmotionCareModal.vue — 情绪关怀弹窗（演示用模拟弹窗）
// F4 键触发，居中卡片式，含状态感知与情绪陪伴文案
// 后续正式版本替换为真实窗口行为检测触发
// ============================================================

import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { Heart, X, Sparkles } from 'lucide-vue-next'

const store = useAppStore()

const visible = ref(false)

// ---- 打开弹窗 ----
function open() {
  if (visible.value) return  // 演示用模拟逻辑：不重复弹出
  visible.value = true
}

// ---- 关闭弹窗 ----
function close() {
  visible.value = false
}

// ---- 点击「有点烦躁，想休息一下」 ----
function handleRest() {
  visible.value = false
  // 触发悬浮气泡
  store.triggerEmotionBubble('那就深呼吸 3 次，站起来活动 2 分钟，回来状态会更好～')
}

// ---- 点击「我没事，继续学习」 ----
function handleContinue() {
  visible.value = false
}

// ---- 全局键盘监听 ----
function onKeyDown(e: KeyboardEvent) {
  // F4 键触发（不拦截浏览器开发者工具 F4）
  if (e.key === 'F4') {
    e.preventDefault()
    open()
  }
  // ESC 关闭
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <transition name="emotion-modal">
      <div v-if="visible" class="ecm-overlay" @click.self="close">
        <div class="ecm-card">
          <!-- 右上角关闭按钮 -->
          <button class="ecm-close" @click="close" aria-label="关闭">
            <X :size="18" stroke-width="2" />
          </button>

          <!-- 头部标题区 -->
          <div class="ecm-header">
            <span class="ecm-header-icon">
              <Heart :size="22" stroke-width="1.75" />
            </span>
            <h2 class="ecm-title">状态小提醒</h2>
          </div>

          <!-- 主文案区 -->
          <div class="ecm-body">
            <p class="ecm-body-main">
              <Sparkles :size="14" stroke-width="1.5" class="ecm-body-sparkle" />
              看你刚才来回切换了好多次页面，是不是有点静不下心、没法集中注意力呀？
            </p>
            <p class="ecm-body-sub">不用硬撑着逼自己专注，累了就停下来歇一小会儿～</p>
          </div>

          <!-- 状态反馈选项区 -->
          <div class="ecm-actions">
            <button class="ecm-btn ecm-btn--primary" @click="handleRest">
              有点烦躁，想休息一下
            </button>
            <button class="ecm-btn ecm-btn--secondary" @click="handleContinue">
              我没事，继续学习
            </button>
          </div>

          <!-- 底部补充提示 -->
          <p class="ecm-tip">真正的高效不是一直紧绷，张弛有度才能走得更稳更远</p>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
   EmotionCareModal — 居中卡片式情绪关怀弹窗
   440px · 毛玻璃 · 大圆角 · 柔和投影
   样式与 MealReminderModal 完全统一
   ============================================================ */

/* 遮罩 */
.ecm-overlay {
  position: fixed;
  inset: 0;
  z-index: 10060;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(19, 22, 54, 0.18);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* 卡片 */
.ecm-card {
  position: relative;
  width: 440px;
  padding: 32px 30px 26px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 24px;
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.04),
    0 12px 56px rgba(19, 22, 54, 0.14);
}

/* 顶部微光（柔紫调，传递温暖感） */
.ecm-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2.5px;
  background: linear-gradient(90deg, #a78bfa, #c4b5fd, #a78bfa);
  border-radius: 0 0 2px 2px;
  opacity: 0.5;
}

/* 关闭按钮 */
.ecm-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-full);
  color: var(--fs-neutral-400);
  cursor: pointer;
  transition: all 150ms;
}
.ecm-close:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-600);
}

/* 头部 */
.ecm-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.ecm-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(167, 139, 250, 0.08));
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ecm-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
}

/* 主文案 */
.ecm-body {
  margin-bottom: 22px;
}
.ecm-body-main {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--fs-neutral-700);
  line-height: 1.6;
  margin-bottom: 8px;
}
.ecm-body-sparkle {
  color: #a78bfa;
  flex-shrink: 0;
  margin-top: 3px;
}
.ecm-body-sub {
  font-size: 13.5px;
  color: var(--fs-neutral-500);
  line-height: 1.6;
  margin: 0;
  padding-left: 4px;
}

/* 按钮区 */
.ecm-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.ecm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  border-radius: var(--fs-radius-full);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
  flex: 1;
}
.ecm-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: none;
}
.ecm-btn--primary:hover {
  opacity: 0.92;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
  transform: translateY(-1px);
}
.ecm-btn--secondary {
  color: var(--fs-neutral-600);
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-200);
}
.ecm-btn--secondary:hover {
  background: var(--fs-neutral-100);
  border-color: var(--fs-neutral-300);
}

/* 底部提示 */
.ecm-tip {
  margin: 0;
  font-size: 12.5px;
  color: var(--fs-neutral-400);
  text-align: center;
  line-height: 1.5;
}

/* 过渡动画 */
.emotion-modal-enter-active {
  animation: emotion-fade-in 220ms var(--fs-ease-out) both;
}
.emotion-modal-leave-active {
  animation: emotion-fade-out 150ms var(--fs-ease-out) both;
}
.emotion-modal-enter-active .ecm-card {
  animation: emotion-card-in 280ms var(--fs-ease-spring) both;
}
@keyframes emotion-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes emotion-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes emotion-card-in {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
