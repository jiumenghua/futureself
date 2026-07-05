<script setup lang="ts">
// ============================================================
// MeCalendarSettings.vue — 成长偏好设置
// 学校/专业/年级 + 赛事订阅 + AI 一键同步
// ============================================================

import { ref } from 'vue'
import { syncAiCalendar } from '@/api/calendar(DeepSeek API)'
import { RefreshCw, Check } from 'lucide-vue-next'

const DEFAULT_USER_ID = 'user_demo_001'

const form = ref({ school: '', major: '', grade: '' })
const categories = ref([
  { key: 'algorithm', label: '算法竞赛', checked: true },
  { key: 'english', label: '英语竞赛', checked: true },
  { key: 'subject', label: '学科竞赛', checked: true },
  { key: 'innovation', label: '创新创业', checked: true },
  { key: 'exam', label: '考级考证', checked: true },
  { key: 'academic', label: '学业节点', checked: true },
])
const remindEnabled = ref(true)
const remindDays = ref(3)
const isSyncing = ref(false)
const syncResult = ref('')

async function handleSync() {
  isSyncing.value = true; syncResult.value = ''
  const count = await syncAiCalendar(DEFAULT_USER_ID, {
    school: form.value.school,
    major: form.value.major,
    grade: form.value.grade,
    categories: categories.value.filter((c) => c.checked).map((c) => c.label),
  })
  syncResult.value = `已为你更新 ${count} 条赛事标注`
  setTimeout(() => { syncResult.value = '' }, 4000)
  isSyncing.value = false
}
</script>

<template>
  <div class="mcs">
    <h3 class="mcs__title">AI成长档案设置</h3>
    <p class="mcs__subtitle">这些信息将帮助 FutureSelf 更快了解你，你也可以通过聊天让 AI 自动学习。</p>

    <!-- 基本信息 -->
    <div class="mcs__section">
      <p class="mcs__label">基本信息</p>
      <div class="mcs__row">
        <input v-model="form.school" placeholder="学校名称" class="mcs-input" />
        <input v-model="form.major" placeholder="专业" class="mcs-input" />
        <input v-model="form.grade" placeholder="年级（如 大二）" class="mcs-input" />
      </div>
    </div>

    <!-- 赛事订阅 -->
    <div class="mcs__section">
      <p class="mcs__label">赛事订阅</p>
      <div class="mcs__chips">
        <label v-for="cat in categories" :key="cat.key" class="mcs__chip" :class="{ 'mcs__chip--active': cat.checked }">
          <input type="checkbox" v-model="cat.checked" class="sr-only" />
          {{ cat.label }}
        </label>
      </div>
    </div>

    <!-- 提醒设置 -->
    <div class="mcs__section">
      <p class="mcs__label">提醒设置</p>
      <div class="mcs__row mcs__row--center">
        <label class="mcs__toggle">
          <input type="checkbox" v-model="remindEnabled" />
          <span>全局提醒</span>
        </label>
        <select v-model="remindDays" class="mcs-select">
          <option :value="1">提前 1 天</option>
          <option :value="3">提前 3 天</option>
          <option :value="5">提前 5 天</option>
          <option :value="7">提前 7 天</option>
        </select>
      </div>
    </div>

    <!-- AI 同步 -->
    <button class="mcs__sync-btn" :disabled="isSyncing" @click="handleSync">
      <RefreshCw :size="16" :class="{ 'animate-spin': isSyncing }" />
      <span>{{ isSyncing ? '更新中…' : '更新成长档案' }}</span>
    </button>
    <p v-if="syncResult" class="mcs__result">
      <Check :size="14" /> {{ syncResult }}
    </p>
  </div>
</template>

<style scoped>
.mcs {
  max-width: 680px; margin: 0 auto 32px;
  padding: 24px; background: var(--fs-neutral-0);
  border: 1px solid var(--fs-neutral-200); border-radius: var(--fs-radius-lg);
}
.mcs__title { font-size: 17px; font-weight: 700; color: var(--fs-neutral-800); margin-bottom: 6px; }
.mcs__subtitle { font-size: 13px; color: var(--fs-neutral-400); margin: 0 0 18px; line-height: 1.5; }

.mcs__section { margin-bottom: 18px; }
.mcs__label { font-size: 13px; font-weight: 600; color: var(--fs-neutral-500); margin-bottom: 8px; }
.mcs__row { display: flex; gap: 10px; flex-wrap: wrap; }
.mcs__row--center { align-items: center; }

.mcs-input {
  flex:1; min-width:120px; padding:9px 12px; font-size:14px; font-family:var(--fs-font-sans);
  color:var(--fs-neutral-700); border:1.5px solid var(--fs-neutral-200); border-radius:var(--fs-radius-md);
  outline:none; background:var(--fs-neutral-50);
}
.mcs-input:focus { border-color:var(--fs-brand-300); background:var(--fs-neutral-0); }

.mcs__chips { display:flex; gap:8px; flex-wrap:wrap; }
.mcs__chip {
  padding:6px 14px; font-size:13px; font-weight:500; font-family:var(--fs-font-sans);
  color:var(--fs-neutral-500); background:var(--fs-neutral-50); border:1px solid var(--fs-neutral-200);
  border-radius:var(--fs-radius-full); cursor:pointer; transition:all 120ms; user-select:none;
}
.mcs__chip--active { color:var(--fs-brand-600); background:var(--fs-brand-50); border-color:rgba(59,130,246,0.2); }

.mcs__toggle { display:flex; align-items:center; gap:6px; font-size:14px; color:var(--fs-neutral-600); cursor:pointer; }
.mcs-select { padding:6px 10px; font-size:13px; font-family:var(--fs-font-sans); border:1px solid var(--fs-neutral-200); border-radius:var(--fs-radius-sm); background:var(--fs-neutral-0); color:var(--fs-neutral-700); }

.mcs__sync-btn {
  display:inline-flex; align-items:center; gap:8px; height:42px; padding:0 24px;
  font-size:14px; font-weight:600; font-family:var(--fs-font-sans); color:#fff;
  background:var(--fs-ai-gradient); border:none; border-radius:var(--fs-radius-full);
  cursor:pointer; transition:all 200ms;
}
.mcs__sync-btn:hover:not(:disabled) { opacity:0.92; box-shadow:0 3px 12px rgba(59,130,246,0.2); }
.mcs__sync-btn:disabled { opacity:0.6; cursor:default; }
.mcs__result { display:flex; align-items:center; gap:6px; margin-top:10px; font-size:13px; color:var(--fs-success-500); }

.sr-only { position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0); }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
