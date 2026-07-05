<script setup lang="ts">
// ============================================================
// ChatBubble.vue — 聊天气泡
// 新增：文件附件展示、搜索关键词高亮
// ============================================================

import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Image, FileText } from 'lucide-vue-next'
import { computed } from 'vue'

interface DisplayMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
  fileUrl?: string
  fileName?: string
  fileType?: string
}

const props = withDefaults(defineProps<{
  message: DisplayMessage
  highlight?: string
}>(), { highlight: '' })

const isAI = computed(() => props.message.role === 'ai')

function renderContent(text: string): string {
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')

  // 搜索关键词高亮
  if (props.highlight) {
    const escaped = props.highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    html = html.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="bubble__highlight">$1</mark>'
    )
  }
  return html
}

const timeLabel = computed(() => {
  const d = new Date(props.message.timestamp)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})

const isImage = computed(() => props.message.fileType === 'image')
const isDocument = computed(() => props.message.fileType === 'document')
</script>

<template>
  <div
    class="bubble-row"
    :class="isAI ? 'bubble-row--ai' : 'bubble-row--user'"
    :data-msg-id="message.id"
  >
    <div v-if="isAI" class="bubble-row__avatar">
      <FsAiAvatar :size="'sm'" :mood="'default'" :show-status-dot="false" />
    </div>

    <div class="bubble" :class="isAI ? 'bubble--ai' : 'bubble--user'">
      <!-- 文件附件 -->
      <div v-if="isImage && message.fileUrl" class="bubble__file bubble__file--image">
        <img :src="message.fileUrl" :alt="message.fileName" class="bubble__image-thumb" />
        <span class="bubble__file-label">{{ message.fileName }}</span>
      </div>
      <div v-else-if="isDocument && message.fileUrl" class="bubble__file bubble__file--doc">
        <FileText :size="16" />
        <span class="bubble__file-label">{{ message.fileName }}</span>
      </div>

      <!-- 文字内容 -->
      <div
        v-if="message.content"
        class="bubble__content"
        :class="isAI ? 'bubble__content--ai' : 'bubble__content--user'"
        v-html="renderContent(message.content)"
      />

      <!-- 文件后无文字时显示占位 -->
      <div
        v-if="!message.content && (isImage || isDocument)"
        class="bubble__content"
        :class="isAI ? 'bubble__content--ai' : 'bubble__content--user'"
      >
        <span v-if="isImage">📷 分享了一张图片</span>
        <span v-else>📄 分享了一个文档</span>
      </div>

      <div class="bubble__time" :class="isAI ? 'bubble__time--ai' : 'bubble__time--user'">
        {{ timeLabel }}
      </div>
    </div>

    <div v-if="!isAI" class="bubble-row__avatar bubble-row__avatar--user">
      <span class="bubble-row__user-initial">我</span>
    </div>
  </div>
</template>

<style scoped>
.bubble-row { display:flex; gap:10px; align-items:flex-start; margin-bottom:20px; }
.bubble-row--ai   { justify-content:flex-start; }
.bubble-row--user { justify-content:flex-end; }

.bubble-row__avatar { flex-shrink:0; margin-top:2px; }
.bubble-row__avatar--user {
  width:32px; height:32px; border-radius:50%;
  background:var(--fs-neutral-200); display:flex; align-items:center; justify-content:center;
}
.bubble-row__user-initial { font-size:13px; font-weight:600; color:var(--fs-neutral-600); }

.bubble { max-width:520px; min-width:80px; }

.bubble--ai {
  background:var(--fs-neutral-0); border:1px solid var(--fs-neutral-200);
  border-radius:4px 14px 14px 14px; padding:14px 18px;
}
.bubble--user {
  background:linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%);
  border:1px solid rgba(59,130,246,0.12); border-radius:14px 4px 14px 14px; padding:12px 16px;
}

/* ---- 文件附件 ---- */
.bubble__file { margin-bottom:8px; display:flex; align-items:center; gap:8px; }
.bubble__file--image { flex-direction:column; align-items:flex-start; }
.bubble__image-thumb { max-width:240px; max-height:200px; border-radius:var(--fs-radius-md); object-fit:cover; border:1px solid var(--fs-neutral-200); }
.bubble__file--doc {
  padding:8px 12px; background:var(--fs-neutral-50); border:1px solid var(--fs-neutral-200);
  border-radius:var(--fs-radius-md); color:var(--fs-brand-500); font-size:13px;
}
.bubble__file-label { font-size:12px; color:var(--fs-neutral-500); word-break:break-all; }

.bubble__content { font-size:14.5px; line-height:1.7; word-break:break-word; }
.bubble__content--ai   { color:var(--fs-neutral-700); }
.bubble__content--user { color:var(--fs-neutral-800); }

.bubble__content :deep(strong) { font-weight:600; color:var(--fs-neutral-900); }
.bubble__content :deep(mark.bubble__highlight) {
  background:#FDE68A; color:inherit; border-radius:2px; padding:0 1px;
}

.bubble__time { font-size:11px; color:var(--fs-neutral-400); margin-top:6px; }
.bubble__time--ai   { text-align:left; }
.bubble__time--user { text-align:right; }
</style>
