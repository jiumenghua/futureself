<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
</script>

<template>
  <div class="today-page">
    <div class="page-placeholder">
      <div class="placeholder-icon">📅</div>
      <h2 class="placeholder-title">今天</h2>
      <p class="placeholder-desc">
        AI 今日洞见 · 课程安排 · 待办任务 · 饮食推荐 · 心情记录
      </p>
      <p class="placeholder-hint">
        页面开发将在 Phase 2 完成
      </p>
    </div>
  </div>
</template>

<style scoped>
.today-page {
  max-width: var(--fs-content-max);
  margin: 0 auto;
  width: 100%;
}
.page-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}
.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.placeholder-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--fs-neutral-800);
  margin-bottom: 8px;
}
.placeholder-desc {
  font-size: 15px;
  color: var(--fs-neutral-500);
  margin-bottom: 4px;
}
.placeholder-hint {
  margin-top: 24px;
  font-size: 12px;
  color: var(--fs-neutral-400);
  padding: 6px 14px;
  background: var(--fs-neutral-100);
  border-radius: var(--fs-radius-full);
}
</style>
