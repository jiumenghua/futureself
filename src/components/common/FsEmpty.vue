<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import type { Component } from 'vue'
import FsButton from './FsButton.vue'

interface FsEmptyProps {
  icon?: Component
  title?: string
  description?: string
  actionLabel?: string
}

withDefaults(defineProps<FsEmptyProps>(), {
  icon: undefined,
  title: '暂无数据',
  description: '',
  actionLabel: '',
})

const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <div class="fs-empty">
    <div class="fs-empty__icon-wrap">
      <component :is="icon || Inbox" :size="40" stroke-width="1.5" class="fs-empty__icon" />
    </div>
    <h4 class="fs-empty__title">{{ title }}</h4>
    <p v-if="description" class="fs-empty__desc">{{ description }}</p>
    <FsButton
      v-if="actionLabel"
      variant="secondary"
      size="sm"
      class="fs-empty__action"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </FsButton>
  </div>
</template>

<style scoped>
.fs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}
.fs-empty__icon-wrap {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fs-neutral-100);
  border-radius: var(--fs-radius-full);
  margin-bottom: 20px;
}
.fs-empty__icon {
  color: var(--fs-neutral-400);
}
.fs-empty__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--fs-neutral-700);
  margin-bottom: 6px;
}
.fs-empty__desc {
  font-size: 14px;
  color: var(--fs-neutral-500);
  max-width: 360px;
  line-height: 1.5;
  margin-bottom: 0;
}
.fs-empty__action {
  margin-top: 20px;
}
</style>
