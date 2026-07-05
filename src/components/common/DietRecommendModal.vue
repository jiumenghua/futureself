<script setup lang="ts">
// ============================================================
// DietRecommendModal.vue — 饮食推荐弹窗（Discover 页触发）
// 纯前端 mock 实现，渐变蓝色气泡风格
// ============================================================

import { ref, watch } from 'vue'
import { ChefHat, Sparkles, Loader2, UtensilsCrossed } from 'lucide-vue-next'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

// ---- 假数据 ----
const mockDietData = {
  dishes: [
    { name: '三鲜煮粉', reason: '口味清淡不油腻，符合你偏好的清淡饮食' },
    { name: '原味螺蛳粉', reason: '你最常吃的选择，今天可以加个煎蛋' },
    { name: '两荤一素套餐', reason: '搭配均衡，适合下午有课的日子补充能量' },
  ],
  tip: '记得多喝水，下午如果犯困可以喝一杯咖啡哦',
}

// ---- 状态 ----
const loading = ref(false)
const showContent = ref(false)

// ---- 监听 visible 变化，打开时模拟 1 秒加载 ----
let loadTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.visible, (isVisible) => {
  if (!isVisible) {
    loading.value = false
    showContent.value = false
    if (loadTimer) { clearTimeout(loadTimer); loadTimer = null }
    return
  }
  loading.value = true
  showContent.value = false
  loadTimer = setTimeout(() => {
    loading.value = false
    showContent.value = true
  }, 1000)
})

function close() {
  emit('close')
}

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('drm-overlay')) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="drm-fade">
      <div v-if="visible" class="drm-overlay" @click="handleOverlayClick">
        <div class="drm-card">
          <!-- 头部 -->
          <div class="drm-header">
            <span class="drm-header-icon">
              <ChefHat :size="18" stroke-width="1.75" />
            </span>
            <h2 class="drm-title">饮食推荐</h2>
            <p class="drm-subtitle">基于你的口味和饮食习惯，为你定制今日推荐</p>
          </div>

          <!-- 加载中（1 秒模拟） -->
          <div v-if="loading" class="drm-loading">
            <Loader2 :size="24" stroke-width="1.5" class="drm-loading-icon" />
            <p>正在为你搭配今日菜品...</p>
          </div>

          <!-- 推荐内容 -->
          <div v-if="showContent" class="drm-content">
            <p class="drm-note">
              <Sparkles :size="12" stroke-width="1.5" />
              今日推荐
            </p>
            <div
              v-for="(dish, i) in mockDietData.dishes"
              :key="i"
              class="drm-dish"
              :style="{ animationDelay: (i * 80) + 'ms' }"
            >
              <div class="drm-dish__icon">
                <UtensilsCrossed :size="16" stroke-width="1.5" />
              </div>
              <div class="drm-dish__info">
                <span class="drm-dish__name">{{ dish.name }}</span>
                <span class="drm-dish__reason">{{ dish.reason }}</span>
              </div>
            </div>
            <p class="drm-tip">💡 {{ mockDietData.tip }}</p>

            <button class="drm-confirm" @click="close">知道了</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ---- Overlay ---- */
.drm-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(19, 22, 54, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* ---- Card（渐变蓝气泡） ---- */
.drm-card {
  position: relative;
  width: 380px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px 28px 24px;
  background: linear-gradient(145deg, #4A8FDB 0%, #3D75C2 40%, #2E5FA8 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(45, 90, 158, 0.3);
}

/* ---- Header ---- */
.drm-header {
  text-align: center;
  margin-bottom: 20px;
}
.drm-header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: #fff;
  margin-bottom: 10px;
}
.drm-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}
.drm-subtitle {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* ---- Loading ---- */
.drm-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 0;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
}
.drm-loading-icon {
  color: rgba(255, 255, 255, 0.9);
  animation: drm-spin 1s linear infinite;
}
@keyframes drm-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ---- Content ---- */
.drm-content {
  display: flex;
  flex-direction: column;
}
.drm-note {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}
.drm-dish {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  animation: drm-dish-in 350ms var(--fs-ease-out) both;
  margin-bottom: 8px;
}
.drm-dish__icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #fff;
  flex-shrink: 0;
}
.drm-dish__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.drm-dish__name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.drm-dish__reason {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}
.drm-tip {
  margin: 4px 0 18px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.5;
}

/* ---- "知道了" 按钮 ---- */
.drm-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 38px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--fs-font-sans);
  color: #3D75C2;
  background: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 200ms var(--fs-ease-out);
}
.drm-confirm:hover {
  opacity: 0.92;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

@keyframes drm-dish-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---- Transition ---- */
.drm-fade-enter-active {
  transition: all 250ms var(--fs-ease-out);
}
.drm-fade-leave-active {
  transition: all 200ms var(--fs-ease-in);
}
.drm-fade-enter-from {
  opacity: 0;
}
.drm-fade-enter-from .drm-card {
  transform: scale(0.95) translateY(12px);
  opacity: 0;
}
.drm-fade-leave-to {
  opacity: 0;
}
.drm-fade-leave-to .drm-card {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
