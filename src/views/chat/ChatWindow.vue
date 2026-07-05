<script setup lang="ts">
// ============================================================
// ChatWindow.vue — 聊天窗口
// 纯展示+输入，所有状态从 chatStore 驱动
// ============================================================

import { ref, nextTick, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import ChatWelcome from './ChatWelcome.vue'
import ChatBubble from './ChatBubble.vue'
import ChatInput from './ChatInput.vue'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'

const store = useChatStore()
const scrollRef = ref<HTMLDivElement>()

function scrollToBottom() {
  nextTick(() => { if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight })
}

function scrollToMessage(msgId: string) {
  nextTick(() => {
    const el = document.querySelector(`[data-msg-id="${msgId}"]`)
    el ? el.scrollIntoView({ behavior: 'smooth', block: 'center' }) : scrollToBottom()
  })
}

async function handleSend(text: string, fileInfo?: { fileUrl: string; fileName: string; fileType: string }) {
  await store.sendMessage(text, fileInfo)
  scrollToBottom()
}

onMounted(async () => {
  if (!store.currentSessionId) {
    await store.loadSessions()
    if (store.sessions.length > 0) {
      const active = store.sessions.find((s) => s.isActive) || store.sessions[0]
      await store.switchToSession(active.sessionId)
    }
    if (!store.currentSessionId) await store.createSession()
  }
  scrollToBottom()
})

watch(() => store.messages.length, () => {
  if (!store.targetMessageId) scrollToBottom()
})

watch(() => store.targetMessageId, (msgId) => {
  if (msgId) { scrollToMessage(msgId); store.targetMessageId = null }
})
</script>

<template>
  <div class="chat-window">
    <!-- ===== 顶部状态条 ===== -->
    <div class="chat-window__topbar">
      <FsAiAvatar :size="'sm'" :mood="'happy'" :show-status-dot="true" />
      <div class="chat-window__topbar-text">
        <span class="chat-window__topbar-name">FutureSelf</span>
        <span class="chat-window__topbar-status">
          <span class="chat-window__topbar-dot" />
          在线 · 正在陪伴你
        </span>
      </div>
    </div>

    <!-- ===== 消息区 ===== -->
    <div ref="scrollRef" class="chat-window__messages">
      <ChatWelcome
        v-if="!store.hasUserMessages && store.messages.length <= 1"
        @send="(t: string) => handleSend(t)"
      />

      <template v-else>
        <div class="chat-window__msg-list">
          <ChatBubble
            v-for="msg in store.messages"
            :key="msg.id"
            :message="msg"
            :highlight="store.highlightKeyword"
          />
          <div v-if="store.isSending" class="chat-window__loading">
            <span class="chat-window__loading-dot" />
            <span class="chat-window__loading-dot" />
            <span class="chat-window__loading-dot" />
          </div>
        </div>
      </template>
    </div>

    <!-- ===== 输入框 ===== -->
    <ChatInput @send="handleSend" :disabled="store.isSending" />
  </div>
</template>

<style scoped>
.chat-window {
  flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100%;
  background: var(--fs-surface-page);
}

.chat-window__topbar {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 20px; background: var(--fs-neutral-0);
  border-bottom: 1px solid var(--fs-neutral-200); flex-shrink: 0;
}
.chat-window__topbar-text { display: flex; flex-direction: column; gap: 1px; }
.chat-window__topbar-name { font-size: 15px; font-weight: 600; color: var(--fs-neutral-800); }
.chat-window__topbar-status { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--fs-neutral-500); }
.chat-window__topbar-dot {
  width: 6px; height: 6px; background: #22C55E; border-radius: 50%;
  box-shadow: 0 0 5px rgba(34,197,94,0.35);
}

.chat-window__messages { flex: 1; overflow-y: auto; padding: 20px 24px; }
.chat-window__msg-list { max-width: 680px; margin: 0 auto; }

.chat-window__loading { display: flex; gap: 5px; padding: 12px 0; }
.chat-window__loading-dot {
  width: 7px; height: 7px; background: var(--fs-brand-400); border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite both;
}
.chat-window__loading-dot:nth-child(1) { animation-delay: 0s; }
.chat-window__loading-dot:nth-child(2) { animation-delay: 0.2s; }
.chat-window__loading-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-pulse {
  0%,80%,100% { opacity:0.3; transform:scale(0.8); }
  40% { opacity:1; transform:scale(1); }
}
</style>
