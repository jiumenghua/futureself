<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAssistantStore } from '@/stores/assistantStore'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { X, ArrowRight, Clock } from 'lucide-vue-next'

const store = useNotificationStore()
const router = useRouter()
const assistantStore = useAssistantStore()

const visible = computed(() => store.visible && store.active !== null)
const notif = computed(() => store.active)

// ---- 悬浮助手联动 ----
watch(visible, (v) => {
  if (v) {
    assistantStore.status = 'thinking'
  } else {
    assistantStore.status = 'idle'
  }
})

// ---- 操作 ----
function handlePrimary() {
  if (notif.value?.primaryRoute) {
    router.push(notif.value.primaryRoute)
  }
  store.primaryAction()
}

function handleSecondary() {
  store.secondaryAction()
}

function handleClose() {
  store.dismiss()
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal" @after-leave="() => {}">
      <div v-if="visible && notif" class="nm-overlay">
        <div class="nm-card">
          <!-- 关闭按钮 -->
          <button class="nm-close" @click="handleClose" aria-label="关闭">
            <X :size="16" stroke-width="2" />
          </button>

          <!-- 左侧：AI 头像 -->
          <div class="nm-left">
            <div class="nm-avatar-wrap">
              <div class="nm-avatar-breathe">
                <FsAiAvatar
                  :size="'lg'"
                  :mood="notif.mood"
                  :status="'insight'"
                  :show-pulse="true"
                  :show-status-dot="false"
                />
              </div>
              <div class="nm-avatar-glow" />
            </div>
            <div class="nm-avatar-emoji">{{ notif.icon }}</div>
          </div>

          <!-- 右侧：内容 -->
          <div class="nm-right">
            <!-- 标题区 -->
            <div class="nm-header">
              <span class="nm-header-badge">FutureSelf 想提醒你</span>
            </div>

            <!-- 标题 -->
            <h3 class="nm-title">{{ notif.title }}</h3>

            <!-- 消息 -->
            <p class="nm-message">{{ notif.message }}</p>

            <!-- 按钮 -->
            <div class="nm-actions">
              <button class="nm-btn nm-btn--primary" @click="handlePrimary">
                <span>{{ notif.primaryLabel }}</span>
                <ArrowRight :size="15" />
              </button>
              <button class="nm-btn nm-btn--secondary" @click="handleSecondary">
                <Clock :size="14" />
                <span>{{ notif.secondaryLabel }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
   NotificationModal — AI 主动提醒弹窗
   右下角浮现 · 420×240 · 毛玻璃 · 蓝白
   ============================================================ */

.nm-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.nm-card {
  position: relative;
  display: flex;
  gap: 20px;
  width: 440px;
  min-height: 200px;
  padding: 28px 30px;
  margin: 0 24px 100px 0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 24px;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.06),
    0 8px 48px rgba(19, 22, 54, 0.14);
  pointer-events: auto;
}

/* 顶部微光 */
.nm-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 40px;
  right: 40px;
  height: 2px;
  background: var(--fs-ai-gradient);
  border-radius: 0 0 2px 2px;
  opacity: 0.4;
}

/* 关闭 */
.nm-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--fs-neutral-100);
  color: var(--fs-neutral-400);
  border-radius: var(--fs-radius-full);
  cursor: pointer;
  transition: all 150ms;
  z-index: 1;
}
.nm-close:hover {
  background: var(--fs-neutral-200);
  color: var(--fs-neutral-600);
}

/* ===== 左侧 ===== */
.nm-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 80px;
}
.nm-avatar-wrap {
  position: relative;
  display: flex;
}
.nm-avatar-breathe {
  position: relative;
  z-index: 1;
  animation: nm-breathe 3s ease-in-out infinite;
}
.nm-avatar-glow {
  position: absolute;
  inset: -14px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  animation: nm-glow 2.5s ease-in-out infinite;
}
.nm-avatar-emoji {
  font-size: 20px;
  line-height: 1;
}

/* ===== 右侧 ===== */
.nm-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.nm-header {
  margin-bottom: 10px;
}
.nm-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--fs-brand-500);
  padding: 3px 10px;
  background: var(--fs-brand-50);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: var(--fs-radius-full);
}
.nm-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--fs-neutral-800);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.nm-message {
  font-size: 13.5px;
  color: var(--fs-neutral-600);
  line-height: 1.65;
  margin-bottom: 18px;
  flex: 1;
}

/* ===== 按钮 ===== */
.nm-actions {
  display: flex;
  gap: 10px;
}
.nm-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 18px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  border-radius: var(--fs-radius-full);
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
}
.nm-btn--primary {
  color: #fff;
  background: var(--fs-ai-gradient);
  border: none;
}
.nm-btn--primary:hover {
  opacity: 0.92;
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.25);
  transform: translateY(-1px);
}
.nm-btn--secondary {
  color: var(--fs-neutral-600);
  background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200);
}
.nm-btn--secondary:hover {
  background: var(--fs-neutral-50);
  border-color: var(--fs-neutral-300);
}

/* ===== 动画 ===== */
.modal-enter-active {
  animation: nm-in 450ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
.modal-leave-active {
  animation: nm-out 300ms var(--fs-ease-out) both;
}
@keyframes nm-in {
  from {
    opacity: 0;
    transform: translateX(30px) translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
  }
}
@keyframes nm-out {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(20px) translateY(10px) scale(0.92); }
}

@keyframes nm-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
}
@keyframes nm-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.1); }
}
</style>
