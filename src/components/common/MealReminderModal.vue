<script setup lang="ts">
// ============================================================
// MealReminderModal.vue — 吃饭提醒弹窗（演示用模拟弹窗）
// F5 键触发，居中卡片式，含菜品推荐与贴心提示
// 后续正式版本替换为后端定时触发逻辑
// ============================================================

import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChefHat, X, Sparkles, Coffee } from 'lucide-vue-next'

const router = useRouter()

const visible = ref(false)

// ---- 打开弹窗 ----
function open() {
  if (visible.value) return  // 不重复弹出
  visible.value = true
}

// ---- 关闭弹窗 ----
function close() {
  visible.value = false
}

// ---- 跳转 Today 饮食区 ----
function goToDiet() {
  visible.value = false
  router.push('/today')
}

// ---- 全局键盘监听 ----
function onKeyDown(e: KeyboardEvent) {
  // F5 键触发（不拦截输入框内按键）
  if (e.key === 'F5') {
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
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
    <transition name="meal-modal">
      <div v-if="visible" class="mrm-overlay" @click.self="close">
        <div class="mrm-card">
          <!-- 右上角关闭按钮 -->
          <button class="mrm-close" @click="close" aria-label="关闭">
            <X :size="18" stroke-width="2" />
          </button>

          <!-- 头部标题 -->
          <div class="mrm-header">
            <span class="mrm-header-icon">
              <ChefHat :size="22" stroke-width="1.75" />
            </span>
            <h2 class="mrm-title">午餐提醒</h2>
          </div>

          <!-- 问候文案 -->
          <div class="mrm-greeting">
            <p class="mrm-greeting-main">
              <Sparkles :size="14" stroke-width="1.5" class="mrm-greeting-sparkle" />
              到饭点啦～忙了一上午，记得停下来好好吃饭哦
            </p>
            <p class="mrm-greeting-sub">根据你的饮食偏好和今日天气，为你推荐：</p>
          </div>

          <!-- 菜品推荐卡片 -->
          <div class="mrm-recommend">
            <div class="mrm-recommend-top">
              <span class="mrm-recommend-emoji">🍚</span>
              <div class="mrm-recommend-info">
                <p class="mrm-recommend-name">香辣鸡扒饭 + 例汤</p>
                <p class="mrm-recommend-reason">微辣开胃，补充下午备考能量</p>
              </div>
            </div>
            <div class="mrm-recommend-tags">
              <span class="mrm-tag">🌶️ 符合爱吃辣偏好</span>
              <span class="mrm-tag">☀️ 今日天热适配</span>
            </div>
          </div>

          <!-- 贴心提示 -->
          <div class="mrm-tip">
            <Coffee :size="14" stroke-width="1.5" class="mrm-tip-icon" />
            <p>今日气温偏高，饭后记得多喝温水，午休 15 分钟下午状态更好～</p>
          </div>

          <!-- 底部操作 -->
          <div class="mrm-actions">
            <button class="mrm-btn mrm-btn--secondary" @click="close">知道了</button>
            <button class="mrm-btn mrm-btn--primary" @click="goToDiet">查看完整推荐</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
   MealReminderModal — 居中卡片式饭点提醒弹窗
   420px · 毛玻璃 · 大圆角 · 柔和投影
   ============================================================ */

/* 遮罩 */
.mrm-overlay {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(19, 22, 54, 0.18);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* 卡片 */
.mrm-card {
  position: relative;
  width: 420px;
  padding: 32px 30px 26px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 24px;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.04),
    0 12px 56px rgba(19, 22, 54, 0.14);
}

/* 顶部微光 */
.mrm-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2.5px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
  border-radius: 0 0 2px 2px;
  opacity: 0.5;
}

/* 关闭按钮 */
.mrm-close {
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
.mrm-close:hover {
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-600);
}

/* 头部 */
.mrm-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.mrm-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.08));
  color: #d97706;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mrm-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  letter-spacing: -0.02em;
}

/* 问候 */
.mrm-greeting {
  margin-bottom: 18px;
}
.mrm-greeting-main {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--fs-neutral-700);
  line-height: 1.5;
  margin-bottom: 6px;
}
.mrm-greeting-sparkle {
  color: #f59e0b;
  flex-shrink: 0;
}
.mrm-greeting-sub {
  font-size: 13px;
  color: var(--fs-neutral-500);
  margin: 0;
}

/* 菜品推荐卡片 */
.mrm-recommend {
  padding: 16px 18px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.04), rgba(251, 191, 36, 0.06));
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: 14px;
  margin-bottom: 14px;
}
.mrm-recommend-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}
.mrm-recommend-emoji {
  font-size: 28px;
  flex-shrink: 0;
  line-height: 1;
}
.mrm-recommend-info {
  flex: 1;
  min-width: 0;
}
.mrm-recommend-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  margin-bottom: 3px;
}
.mrm-recommend-reason {
  font-size: 13px;
  color: var(--fs-neutral-500);
  line-height: 1.4;
}
.mrm-recommend-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.mrm-tag {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #b45309;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: var(--fs-radius-full);
}

/* 贴心提示 */
.mrm-tip {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 10px 14px;
  background: var(--fs-neutral-50);
  border-radius: 10px;
  margin-bottom: 20px;
}
.mrm-tip-icon {
  color: var(--fs-neutral-400);
  flex-shrink: 0;
  margin-top: 1px;
}
.mrm-tip p {
  margin: 0;
  font-size: 13px;
  color: var(--fs-neutral-500);
  line-height: 1.5;
}

/* 底部按钮 */
.mrm-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.mrm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 0 22px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  border-radius: var(--fs-radius-full);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
}
.mrm-btn--secondary {
  color: var(--fs-neutral-600);
  background: var(--fs-neutral-50);
  border: 1px solid var(--fs-neutral-200);
}
.mrm-btn--secondary:hover {
  background: var(--fs-neutral-100);
  border-color: var(--fs-neutral-300);
}
.mrm-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  flex: 1;
}
.mrm-btn--primary:hover {
  opacity: 0.92;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.25);
  transform: translateY(-1px);
}

/* 过渡动画 */
.meal-modal-enter-active {
  animation: meal-fade-in 220ms var(--fs-ease-out) both;
}
.meal-modal-leave-active {
  animation: meal-fade-out 150ms var(--fs-ease-out) both;
}
.meal-modal-enter-active .mrm-card {
  animation: meal-card-in 280ms var(--fs-ease-spring) both;
}
@keyframes meal-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes meal-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes meal-card-in {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
