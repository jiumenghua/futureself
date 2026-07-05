<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { useChatStore } from '@/stores/chatStore'
import ChatSidebar from './ChatSidebar.vue'
import ChatWindow from './ChatWindow.vue'
import ChatMemoryPanel from './ChatMemoryPanel.vue'

const appStore = useAppStore()
const chatStore = useChatStore()

onMounted(() => {
  appStore.setPageMeta({ title: 'FutureSelf', subtitle: 'Your AI Companion' })
})
</script>

<template>
  <div class="chat-page">
    <ChatSidebar />
    <ChatWindow />
    <ChatMemoryPanel />
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  height: 100%;
  margin: -32px -32px -40px;
  animation: page-in 400ms var(--fs-ease-out) both;
}
@keyframes page-in { from { opacity: 0; } to { opacity: 1; } }
</style>
