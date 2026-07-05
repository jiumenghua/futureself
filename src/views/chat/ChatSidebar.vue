<script setup lang="ts">
// ============================================================
// ChatSidebar.vue — 左侧会话栏
// 全量展示历史会话，悬停显示删除/重命名操作
// ============================================================

import { ref, onMounted, nextTick } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { Plus, Search, MessageSquare, X, Loader, Trash2, Pencil, Check } from 'lucide-vue-next'

const store = useChatStore()

// ---- 搜索 ----
const searchInput = ref('')
const showDropdown = ref(false)
let searchTimer: ReturnType<typeof setTimeout>

function onSearchInput() {
  clearTimeout(searchTimer)
  const q = searchInput.value.trim()
  if (!q) { store.clearSearch(); showDropdown.value = false; return }
  searchTimer = setTimeout(async () => {
    store.searchKeyword = q
    await store.doSearch(q)
    showDropdown.value = true
  }, 400)
}

function onSearchEnter() {
  clearTimeout(searchTimer)
  const q = searchInput.value.trim()
  if (!q) return
  store.searchKeyword = q
  store.doSearch(q)
  showDropdown.value = true
}

async function handleSearchClick(result: any) {
  showDropdown.value = false
  searchInput.value = ''
  await store.navigateToSearchResult(result)
}

function clearSearchInput() {
  searchInput.value = ''
  store.clearSearch()
  showDropdown.value = false
}

// ---- 会话操作 ----
async function handleNewSession() {
  await store.createSession()
}

async function handleSessionClick(sessionId: string) {
  if (sessionId === store.currentSessionId) return
  await store.switchToSession(sessionId)
}

// ---- 删除 ----
async function handleDelete(sessionId: string, e: Event) {
  e.stopPropagation()
  const confirmed = window.confirm('确定要删除这个对话吗？聊天记录也会一并清除。')
  if (confirmed) {
    await store.deleteSession(sessionId)
  }
}

// ---- 重命名 ----
const editingSessionId = ref<string | null>(null)
const editTitle = ref('')
const editInputRef = ref<HTMLInputElement>()

function startRename(sessionId: string, currentTitle: string, e: Event) {
  e.stopPropagation()
  editingSessionId.value = sessionId
  editTitle.value = currentTitle
  nextTick(() => editInputRef.value?.focus())
}

async function confirmRename(sessionId: string) {
  const title = editTitle.value.trim()
  if (title) {
    await store.renameSession(sessionId, title)
  }
  editingSessionId.value = null
  editTitle.value = ''
}

function cancelRename() {
  editingSessionId.value = null
  editTitle.value = ''
}

function onRenameKeydown(sessionId: string, e: KeyboardEvent) {
  if (e.key === 'Enter') confirmRename(sessionId)
  if (e.key === 'Escape') cancelRename()
}

onMounted(async () => { await store.loadSessions() })
</script>

<template>
  <aside class="chat-sidebar">
    <!-- ===== 顶部：新建聊天 ===== -->
    <div class="chat-sidebar__top">
      <button class="chat-sidebar__new-btn" @click="handleNewSession">
        <Plus :size="17" stroke-width="2" />
        <span>新对话</span>
      </button>
    </div>

    <!-- ===== 会话列表 ===== -->
    <div class="chat-sidebar__list">
      <p class="chat-sidebar__label">最近对话</p>

      <div v-if="store.isLoadingSessions" class="chat-sidebar__loading">
        <Loader :size="14" class="animate-spin" />
        <span>加载中…</span>
      </div>

      <div v-else-if="!store.sessions.length" class="chat-sidebar__empty">
        <span>暂无对话</span>
        <span class="chat-sidebar__empty-hint">点击上方按钮开始新对话</span>
      </div>

      <div
        v-for="session in store.sessions"
        :key="session.sessionId"
        class="chat-sidebar__item-row"
      >
        <button
          class="chat-sidebar__item"
          :class="{ 'chat-sidebar__item--active': session.sessionId === store.currentSessionId }"
          @click="handleSessionClick(session.sessionId)"
        >
          <MessageSquare :size="15" stroke-width="1.5" class="chat-sidebar__item-icon" />
          <div class="chat-sidebar__item-body">
            <div class="chat-sidebar__item-head">
              <span class="chat-sidebar__item-date">
                {{ store.formatSessionTime(session.lastMessageAt || session.createdAt) }}
              </span>

              <!-- 编辑模式 -->
              <input
                v-if="editingSessionId === session.sessionId"
                ref="editInputRef"
                v-model="editTitle"
                class="chat-sidebar__edit-input"
                maxlength="30"
                @keydown="onRenameKeydown(session.sessionId, $event)"
                @blur="confirmRename(session.sessionId)"
                @click.stop
              />
              <!-- 普通标题 -->
              <span v-else class="chat-sidebar__item-title">{{ session.title || '新对话' }}</span>
            </div>
            <p class="chat-sidebar__item-summary">
              {{ session.summary || (session.messageCount > 0 ? `${session.messageCount} 条消息` : '暂无消息') }}
            </p>
          </div>
        </button>

        <!-- 悬停操作按钮 -->
        <div class="chat-sidebar__item-actions" v-if="editingSessionId !== session.sessionId">
          <button
            class="chat-sidebar__action-btn"
            title="重命名"
            @click="startRename(session.sessionId, session.title, $event)"
          >
            <Pencil :size="13" stroke-width="1.75" />
          </button>
          <button
            class="chat-sidebar__action-btn chat-sidebar__action-btn--danger"
            title="删除"
            @click="handleDelete(session.sessionId, $event)"
          >
            <Trash2 :size="13" stroke-width="1.75" />
          </button>
        </div>
        <!-- 编辑模式：确认按钮 -->
        <div class="chat-sidebar__item-actions" v-else>
          <button
            class="chat-sidebar__action-btn chat-sidebar__action-btn--confirm"
            title="确认"
            @click.stop="confirmRename(session.sessionId)"
          >
            <Check :size="13" stroke-width="2" />
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 底部：搜索 ===== -->
    <div class="chat-sidebar__bottom">
      <div class="chat-sidebar__search" :class="{ 'chat-sidebar__search--active': showDropdown }">
        <Search :size="15" stroke-width="1.5" />
        <input
          v-model="searchInput"
          class="chat-sidebar__search-input"
          placeholder="搜索聊天记录"
          @input="onSearchInput"
          @keydown.enter="onSearchEnter"
          @focus="store.searchResults.length && (showDropdown = true)"
        />
        <button v-if="searchInput" class="chat-sidebar__search-clear" @click="clearSearchInput">
          <X :size="14" stroke-width="1.5" />
        </button>

        <div v-if="showDropdown" class="chat-sidebar__search-dropdown">
          <div v-if="store.isSearching" class="chat-sidebar__search-status">搜索中…</div>
          <div v-else-if="!store.searchResults.length" class="chat-sidebar__search-status">
            未找到「{{ searchInput }}」相关消息
          </div>
          <button
            v-for="r in store.searchResults"
            :key="r._id"
            class="chat-sidebar__search-item"
            @click="handleSearchClick(r)"
          >
            <span class="chat-sidebar__search-item-role">{{ r.role === 'user' ? '你' : 'AI' }}</span>
            <span class="chat-sidebar__search-item-text">
              {{ r.content.slice(0, 40) }}{{ r.content.length > 40 ? '…' : '' }}
            </span>
            <span class="chat-sidebar__search-item-session" v-if="r.sessionName">{{ r.sessionName }}</span>
            <span class="chat-sidebar__search-item-time">{{ store.formatSessionTime(r.timestamp) }}</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ============================================================
   ChatSidebar — 样式（新增悬停操作按钮 + 内联编辑）
   ============================================================ */

.chat-sidebar {
  width: 280px; height: 100%; display: flex; flex-direction: column;
  border-right: 1px solid var(--fs-neutral-200); background: var(--fs-neutral-0); flex-shrink: 0;
}

.chat-sidebar__top { padding: 16px 14px; border-bottom: 1px solid var(--fs-neutral-100); }
.chat-sidebar__new-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
  height: 38px; font-size: 14px; font-weight: 600; font-family: var(--fs-font-sans);
  color: var(--fs-brand-600); background: var(--fs-brand-50);
  border: 1px solid rgba(59,130,246,0.12); border-radius: var(--fs-radius-md); cursor: pointer; transition: all 150ms;
}
.chat-sidebar__new-btn:hover { background: var(--fs-brand-100); border-color: rgba(59,130,246,0.25); }

.chat-sidebar__list { flex: 1; overflow-y: auto; padding: 10px 8px; }
.chat-sidebar__label {
  font-size: 11.5px; font-weight: 600; color: var(--fs-neutral-400);
  text-transform: uppercase; letter-spacing: 0.04em; padding: 0 8px 8px;
}

.chat-sidebar__loading, .chat-sidebar__empty {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 24px 12px; font-size: 13px; color: var(--fs-neutral-400);
}
.chat-sidebar__empty-hint { font-size: 11.5px; color: var(--fs-neutral-300); }

/* ---- 会话条目行 ---- */
.chat-sidebar__item-row {
  position: relative;
  display: flex;
  align-items: center;
}

.chat-sidebar__item {
  flex: 1; display: flex; gap: 10px; padding: 10px 8px; border: none;
  background: transparent; border-radius: var(--fs-radius-md); cursor: pointer;
  transition: background 150ms; text-align: left; font-family: var(--fs-font-sans);
  min-width: 0;
}
.chat-sidebar__item:hover { background: var(--fs-neutral-50); }
.chat-sidebar__item--active { background: var(--fs-brand-50); }
.chat-sidebar__item--active:hover { background: var(--fs-brand-100); }
.chat-sidebar__item-icon { color: var(--fs-neutral-400); flex-shrink: 0; margin-top: 2px; }
.chat-sidebar__item--active .chat-sidebar__item-icon { color: var(--fs-brand-500); }
.chat-sidebar__item-body { min-width: 0; flex: 1; }
.chat-sidebar__item-head { display: flex; gap: 6px; align-items: baseline; margin-bottom: 3px; }
.chat-sidebar__item-date { font-size: 11.5px; font-weight: 600; color: var(--fs-neutral-500); flex-shrink: 0; }
.chat-sidebar__item-title {
  font-size: 13px; font-weight: 500; color: var(--fs-neutral-700);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.chat-sidebar__item-summary {
  font-size: 12px; color: var(--fs-neutral-400);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ---- 悬停操作按钮 ---- */
.chat-sidebar__item-actions {
  display: none;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  gap: 2px;
  background: var(--fs-neutral-0);
  border-radius: var(--fs-radius-sm);
  padding: 2px;
}
.chat-sidebar__item-row:hover .chat-sidebar__item-actions {
  display: flex;
}
.chat-sidebar__action-btn {
  width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
  border: none; background: transparent; color: var(--fs-neutral-400);
  border-radius: var(--fs-radius-xs); cursor: pointer; transition: all 100ms;
}
.chat-sidebar__action-btn:hover { background: var(--fs-neutral-100); color: var(--fs-neutral-600); }
.chat-sidebar__action-btn--danger:hover { background: var(--fs-error-50); color: var(--fs-error-500); }
.chat-sidebar__action-btn--confirm { color: var(--fs-brand-500); }

/* ---- 内联编辑 ---- */
.chat-sidebar__edit-input {
  flex: 1;
  font-size: 13px; font-weight: 500; font-family: var(--fs-font-sans);
  color: var(--fs-neutral-800); border: 1.5px solid var(--fs-brand-400);
  border-radius: var(--fs-radius-xs); padding: 2px 6px; outline: none;
  background: var(--fs-neutral-0); min-width: 0;
}

/* ---- 底部搜索 ---- */
.chat-sidebar__bottom { padding: 12px 14px; border-top: 1px solid var(--fs-neutral-100); }
.chat-sidebar__search {
  position: relative; display: flex; align-items: center; gap: 7px;
  padding: 8px 12px; font-size: 12.5px; color: var(--fs-neutral-400);
  background: var(--fs-neutral-50); border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-sm); transition: all 200ms;
}
.chat-sidebar__search:focus-within, .chat-sidebar__search--active {
  border-color: var(--fs-brand-300); background: var(--fs-neutral-0);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.06);
}
.chat-sidebar__search-input {
  flex: 1; border: none; background: transparent; font-size: 12.5px;
  font-family: var(--fs-font-sans); color: var(--fs-neutral-700); outline: none; min-width: 0;
}
.chat-sidebar__search-input::placeholder { color: var(--fs-neutral-400); }
.chat-sidebar__search-clear {
  border: none; background: none; color: var(--fs-neutral-400); cursor: pointer; padding: 2px; flex-shrink: 0;
}

.chat-sidebar__search-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0; max-height: 280px; overflow-y: auto;
  background: var(--fs-neutral-0); border: 1px solid var(--fs-neutral-200);
  border-radius: var(--fs-radius-lg); box-shadow: var(--fs-shadow-lg); z-index: 100;
}
.chat-sidebar__search-status { padding: 14px 12px; text-align: center; font-size: 12.5px; color: var(--fs-neutral-400); }
.chat-sidebar__search-item {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px;
  border: none; background: transparent; text-align: left; cursor: pointer;
  font-family: var(--fs-font-sans); font-size: 12.5px; transition: background 100ms;
}
.chat-sidebar__search-item:hover { background: var(--fs-neutral-50); }
.chat-sidebar__search-item + .chat-sidebar__search-item { border-top: 1px solid var(--fs-neutral-100); }
.chat-sidebar__search-item-role {
  font-size: 10.5px; font-weight: 600; color: var(--fs-brand-500);
  padding: 1px 6px; background: var(--fs-brand-50); border-radius: var(--fs-radius-xs); flex-shrink: 0;
}
.chat-sidebar__search-item-text {
  flex: 1; color: var(--fs-neutral-600); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.chat-sidebar__search-item-session {
  font-size: 10px; color: var(--fs-neutral-400); flex-shrink: 0;
  max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.chat-sidebar__search-item-time { font-size: 11px; color: var(--fs-neutral-400); flex-shrink: 0; }

.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
