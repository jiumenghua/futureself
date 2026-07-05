<script setup lang="ts">
import { Settings, ChevronRight } from 'lucide-vue-next'
import { ref } from 'vue'

const items = ref([
  { id: 'theme', label: '主题切换', desc: '浅色 / 深色（即将推出）', disabled: true },
  { id: 'notif', label: '通知设置', desc: '管理 AI 提醒与推送', disabled: true },
  { id: 'privacy', label: '隐私设置', desc: '管理你的数据与隐私', disabled: true },
  { id: 'sync', label: '数据同步', desc: '跨设备同步你的成长记录', disabled: true },
])
</script>

<template>
  <section class="set">
    <div class="set__header">
      <Settings :size="18" stroke-width="1.75" class="set__icon" />
      <h3 class="set__title">设置</h3>
    </div>
    <div class="set__list">
      <div
        v-for="item in items"
        :key="item.id"
        class="set__item"
        :class="{ 'set__item--disabled': item.disabled }"
      >
        <div class="set__item-left">
          <span class="set__item-label">{{ item.label }}</span>
          <span class="set__item-desc">{{ item.desc }}</span>
        </div>
        <div class="set__item-right">
          <span v-if="item.disabled" class="set__item-tag">预留</span>
          <ChevronRight :size="16" class="set__item-arrow" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.set { max-width: 1100px; margin: 0 auto 48px; }
.set__header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
.set__icon { color: var(--fs-neutral-400); }
.set__title { font-size: 18px; font-weight: 700; color: var(--fs-neutral-800); }
.set__list {
  background: var(--fs-neutral-0); border: 1px solid var(--fs-neutral-200); border-radius: var(--fs-radius-lg);
  overflow: hidden;
}
.set__item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; cursor: pointer; transition: background 150ms;
}
.set__item + .set__item { border-top: 1px solid var(--fs-neutral-100); }
.set__item:hover:not(.set__item--disabled) { background: var(--fs-neutral-50); }
.set__item--disabled { cursor: default; opacity: 0.5; }
.set__item-left { display: flex; flex-direction: column; gap: 3px; }
.set__item-label { font-size: 14.5px; font-weight: 500; color: var(--fs-neutral-700); }
.set__item-desc { font-size: 12px; color: var(--fs-neutral-400); }
.set__item-right { display: flex; align-items: center; gap: 10px; }
.set__item-tag {
  font-size: 10.5px; font-weight: 600; color: var(--fs-neutral-400);
  padding: 3px 8px; background: var(--fs-neutral-100); border-radius: var(--fs-radius-sm);
}
.set__item-arrow { color: var(--fs-neutral-400); }
</style>
