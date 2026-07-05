<script setup lang="ts">
// ============================================================
// AssistantContextMenu.vue — FutureSelf 悬浮助手右键菜单
// 不包含任何隐藏/关闭选项（FutureSelf 永不消失）
// ============================================================

import { useRouter } from 'vue-router'
import { useAssistantStore } from '@/stores/assistantStore'
import { RotateCcw, ArrowLeftToLine, ArrowRightToLine, MessageCircle, Settings } from 'lucide-vue-next'

const store = useAssistantStore()
const router = useRouter()

interface MenuItem {
  id: string
  label: string
  icon: typeof RotateCcw
  action: () => void
  disabled?: boolean
}

const items: MenuItem[] = [
  {
    id: 'reset',
    label: '恢复默认位置',
    icon: RotateCcw,
    action: () => {
      store.resetPosition()
      store.showContextMenu = false
    },
  },
  {
    id: 'moveLeft',
    label: '移动到左侧',
    icon: ArrowLeftToLine,
    action: () => {
      store.moveToLeft()
      store.showContextMenu = false
    },
  },
  {
    id: 'moveRight',
    label: '移动到右侧',
    icon: ArrowRightToLine,
    action: () => {
      store.moveToRight()
      store.showContextMenu = false
    },
  },
  {
    id: 'chat',
    label: '打开聊天',
    icon: MessageCircle,
    action: () => {
      router.push('/chat')
      store.showContextMenu = false
    },
  },
  {
    id: 'settings',
    label: '进入设置',
    icon: Settings,
    action: () => {
      router.push('/me')
      store.showContextMenu = false
    },
    disabled: true,
  },
]

function close() {
  store.showContextMenu = false
}
</script>

<template>
  <Teleport to="body">
    <!-- 点击任意位置关闭 -->
    <div
      v-if="store.showContextMenu"
      class="cm-overlay"
      @click="close"
      @contextmenu.prevent="close"
    />

    <transition name="cm">
      <div
        v-if="store.showContextMenu"
        class="cm"
        :style="{
          left: store.contextMenuPos.x + 'px',
          top: store.contextMenuPos.y + 'px',
        }"
      >
        <button
          v-for="item in items"
          :key="item.id"
          class="cm__item"
          :class="{ 'cm__item--disabled': item.disabled }"
          :disabled="item.disabled"
          @click="item.action"
        >
          <component :is="item.icon" :size="15" stroke-width="1.75" />
          <span>{{ item.label }}</span>
          <span v-if="item.disabled" class="cm__coming">即将推出</span>
        </button>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
   AssistantContextMenu — 右键菜单样式
   ============================================================ */

.cm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
}

.cm {
  position: fixed;
  z-index: 9999;
  min-width: 180px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  box-shadow: var(--fs-shadow-lg);
}

.cm__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--fs-neutral-700);
  border-radius: var(--fs-radius-sm);
  cursor: pointer;
  transition: all 100ms;
  font-family: var(--fs-font-sans);
  text-align: left;
}

.cm__item:hover:not(:disabled) {
  background: var(--fs-neutral-100);
  color: var(--fs-brand-500);
}

.cm__item--disabled {
  opacity: 0.4;
  cursor: default;
}

.cm__coming {
  margin-left: auto;
  font-size: 10px;
  font-weight: 500;
  color: var(--fs-neutral-400);
  padding: 2px 6px;
  background: var(--fs-neutral-100);
  border-radius: var(--fs-radius-full);
}

/* ---- 动画 ---- */
.cm-enter-active {
  animation: cm-in 150ms var(--fs-ease-out) both;
}
.cm-leave-active {
  animation: cm-out 100ms var(--fs-ease-out) both;
}

@keyframes cm-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes cm-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.92);
  }
}
</style>
