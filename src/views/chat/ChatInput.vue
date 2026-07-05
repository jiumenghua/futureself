<script setup lang="ts">
// ============================================================
// ChatInput.vue — 聊天输入框
// 新增：文件上传按钮 + 拖拽上传 + 格式校验
// ============================================================

import { ref, nextTick } from 'vue'
import { Paperclip, Send, Sparkles, X, FileText, Image, Loader } from 'lucide-vue-next'
import { uploadFile } from '@/api/chat(DeepSeek API)'
import type { UploadResult } from '@/api/chat(DeepSeek API)'

const DEFAULT_USER_ID = 'user_demo_001'

const emit = defineEmits<{
  send: [text: string, fileInfo?: { fileUrl: string; fileName: string; fileType: string }]
}>()

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const fileInputRef = ref<HTMLInputElement>()

// ---- 文件上传状态 ----
const isUploading = ref(false)
const uploadedFile = ref<UploadResult | null>(null)
const uploadError = ref('')
const isDragOver = ref(false)

const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.txt', '.docx']
const MAX_SIZE = 10 * 1024 * 1024

function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXT.includes(ext)) {
    return `不支持 ${ext} 格式，支持：${ALLOWED_EXT.join(', ')}`
  }
  if (file.size > MAX_SIZE) {
    return `文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），最大 10MB`
  }
  return null
}

async function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await processFile(file)
  input.value = ''
}

async function processFile(file: File) {
  uploadError.value = ''
  const err = validateFile(file)
  if (err) { uploadError.value = err; return }

  isUploading.value = true
  try {
    const result = await uploadFile(file, DEFAULT_USER_ID, text.value || undefined)
    if (result) {
      uploadedFile.value = result
    } else {
      uploadError.value = '上传失败，请重试'
    }
  } catch {
    uploadError.value = '网络异常，请重试'
  } finally {
    isUploading.value = false
  }
}

function removeFile() {
  uploadedFile.value = null
  uploadError.value = ''
}

function handleSend() {
  const trimmed = text.value.trim()
  if (!trimmed && !uploadedFile.value) return

  const fileInfo = uploadedFile.value
    ? { fileUrl: uploadedFile.value.fileUrl, fileName: uploadedFile.value.fileName, fileType: uploadedFile.value.fileType }
    : undefined

  emit('send', trimmed || '请帮我看看这个文件', fileInfo)
  text.value = ''
  uploadedFile.value = null
  uploadError.value = ''
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = 'auto'
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// ---- 拖拽事件 ----
function onDragOver(e: DragEvent) { e.preventDefault(); isDragOver.value = true }
function onDragLeave() { isDragOver.value = false }
function onDrop(e: DragEvent) {
  e.preventDefault(); isDragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}
</script>

<template>
  <div class="input-bar" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <!-- 拖拽提示 -->
    <div v-if="isDragOver" class="input-bar__drop-overlay">
      <span>📎 松手上传文件</span>
    </div>

    <!-- 上传错误 -->
    <div v-if="uploadError" class="input-bar__error">
      <span>{{ uploadError }}</span>
      <button @click="uploadError = ''"><X :size="14" /></button>
    </div>

    <!-- 已上传文件预览 -->
    <div v-if="uploadedFile" class="input-bar__file-preview">
      <Image v-if="uploadedFile.fileType === 'image'" :size="16" class="text-brand-500" />
      <FileText v-else :size="16" class="text-brand-500" />
      <span class="input-bar__file-name">{{ uploadedFile.fileName }}</span>
      <span class="input-bar__file-size">{{ (uploadedFile.fileSize / 1024).toFixed(1) }}KB</span>
      <button @click="removeFile" class="input-bar__file-remove"><X :size="14" /></button>
    </div>

    <div class="input-bar__inner">
      <!-- 上传按钮 -->
      <button
        class="input-bar__attach"
        :class="{ 'input-bar__attach--active': isUploading }"
        :disabled="props.disabled || isUploading"
        @click="fileInputRef?.click()"
        aria-label="上传文件"
        title="上传图片或文档"
      >
        <Loader v-if="isUploading" :size="18" stroke-width="1.75" class="animate-spin" />
        <Paperclip v-else :size="18" stroke-width="1.75" />
      </button>
      <input
        ref="fileInputRef"
        type="file"
        :accept="ALLOWED_EXT.join(',')"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- 输入框 -->
      <textarea
        ref="textareaRef"
        v-model="text"
        class="input-bar__textarea"
        placeholder="和 FutureSelf 聊聊…"
        rows="1"
        :disabled="props.disabled || isUploading"
        @keydown="onKeydown"
        @input="autoResize"
      />

      <!-- 发送按钮 -->
      <button
        class="input-bar__send"
        :class="{ 'input-bar__send--active': (text.trim() || uploadedFile) && !props.disabled && !isUploading }"
        :disabled="(!text.trim() && !uploadedFile) || props.disabled || isUploading"
        @click="handleSend"
        aria-label="发送"
      >
        <Send v-if="!text.trim() && !uploadedFile" :size="17" stroke-width="1.75" />
        <Sparkles v-else :size="17" stroke-width="2" />
      </button>
    </div>

    <p class="input-bar__hint">Enter 发送 · Shift + Enter 换行 · 支持拖拽上传图片/文档</p>
  </div>
</template>

<style scoped>
.input-bar {
  padding: 12px 20px 4px;
  border-top: 1px solid var(--fs-neutral-200);
  background: var(--fs-neutral-0);
  position: relative;
}

/* ---- 拖拽覆盖层 ---- */
.input-bar__drop-overlay {
  position: absolute;
  inset: 0;
  background: rgba(59, 130, 246, 0.06);
  border: 2px dashed var(--fs-brand-300);
  border-radius: var(--fs-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--fs-brand-500);
  z-index: 10;
  pointer-events: none;
}

/* ---- 错误提示 ---- */
.input-bar__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--fs-error-500);
  background: var(--fs-error-50);
  border-radius: var(--fs-radius-sm);
}
.input-bar__error button {
  border: none; background: none; color: var(--fs-error-500); cursor: pointer; padding: 2px;
}

/* ---- 文件预览 ---- */
.input-bar__file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--fs-neutral-700);
  background: var(--fs-brand-50);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: var(--fs-radius-sm);
}
.input-bar__file-name {
  flex: 1;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input-bar__file-size {
  font-size: 11px;
  color: var(--fs-neutral-400);
}
.input-bar__file-remove {
  border: none; background: none; color: var(--fs-neutral-400); cursor: pointer; padding: 2px;
  border-radius: var(--fs-radius-xs);
}
.input-bar__file-remove:hover { color: var(--fs-neutral-600); background: var(--fs-neutral-100); }

.input-bar__inner {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: var(--fs-neutral-50);
  border: 1.5px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg);
  transition: border-color 150ms;
}
.input-bar__inner:focus-within {
  border-color: var(--fs-brand-300);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
}

.input-bar__attach {
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  border: none; background: transparent; color: var(--fs-neutral-400);
  border-radius: var(--fs-radius-sm); cursor: pointer; flex-shrink: 0; transition: all 150ms;
}
.input-bar__attach:hover { color: var(--fs-brand-500); background: var(--fs-brand-50); }
.input-bar__attach--active { color: var(--fs-brand-500); }

.input-bar__textarea {
  flex: 1; border: none; background: transparent; font-size: 15px;
  font-family: var(--fs-font-sans); color: var(--fs-neutral-800); line-height: 1.5;
  resize: none; outline: none; max-height: 120px; padding: 4px 0;
}
.input-bar__textarea::placeholder { color: var(--fs-neutral-400); }
.input-bar__textarea:disabled { opacity: 0.5; }

.input-bar__send {
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  border: none; background: var(--fs-neutral-200); color: var(--fs-neutral-400);
  border-radius: var(--fs-radius-md); cursor: pointer; flex-shrink: 0;
  transition: all 200ms var(--fs-ease-out);
}
.input-bar__send--active { background: var(--fs-ai-gradient); color: #ffffff; }
.input-bar__send--active:hover { transform: scale(1.06); }
.input-bar__send:disabled { cursor: default; }

.input-bar__hint {
  text-align: center; font-size: 11px; color: var(--fs-neutral-400); margin-top: 6px;
}

/* Tailwind helpers */
.text-brand-500 { color: var(--fs-brand-500); }
.hidden { display: none; }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
