<script setup lang="ts">
// ============================================================
// MeDietSettings.vue — 饮食偏好设置
// 校区、饮食偏好、忌口、饭点提醒开关、自定义饭点
// ============================================================

import { ref, onMounted } from 'vue'
import { Check, Save } from 'lucide-vue-next'

const DEFAULT_USER_ID = 'user_demo_001'

const campus = ref('')
const preferences = ref<string[]>([])
const taboos = ref<string[]>([])
const mealRemindEnabled = ref(true)
const customMealTime = ref({ breakfast: '07:30', lunch: '12:00', dinner: '18:00' })
const isSaving = ref(false)
const toast = ref('')

// 预设偏好标签
const prefOptions = ['清淡', '爱吃辣', '素食', '爱吃肉', '海鲜', '甜食', '面食', '米饭']
const tabooOptions = ['不吃香菜', '不吃葱蒜', '不吃辣', '不吃海鲜', '不吃猪肉', '不吃牛肉']

function togglePref(tag: string) {
  const idx = preferences.value.indexOf(tag)
  if (idx >= 0) preferences.value.splice(idx, 1)
  else preferences.value.push(tag)
}

function toggleTaboo(tag: string) {
  const idx = taboos.value.indexOf(tag)
  if (idx >= 0) taboos.value.splice(idx, 1)
  else taboos.value.push(tag)
}

async function handleSave() {
  isSaving.value = true
  try {
    // 复用现有 user/profile 接口
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: DEFAULT_USER_ID,
        nickname: '同学',  // 保留现有字段
        campus: campus.value.trim(),
        dietPreference: preferences.value,
        dietTaboo: taboos.value,
        mealRemindEnabled: mealRemindEnabled.value,
        customMealTime: customMealTime.value,
      }),
    })
    if (res.ok) {
      toast.value = '饮食偏好已保存 ✅'
      setTimeout(() => { toast.value = '' }, 2500)
    }
  } catch { toast.value = '保存失败' }
  isSaving.value = false
}

onMounted(() => {
  // 加载已有设置
  fetch(`/api/user/profile?userId=${DEFAULT_USER_ID}`)
    .then(r => r.json())
    .then(res => {
      if (res.success && res.data) {
        const d = res.data
        campus.value = d.campus || ''
        preferences.value = d.dietPreference || []
        taboos.value = d.dietTaboo || []
        mealRemindEnabled.value = d.mealRemindEnabled ?? true
        if (d.customMealTime) customMealTime.value = d.customMealTime
      }
    })
    .catch(() => {})
})
</script>

<template>
  <div class="mcs">
    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast" class="mcs__toast"><Check :size="15" /> {{ toast }}</div>
    </transition>

    <h3 class="mcs__title">饮食偏好设置</h3>
    <p class="mcs__subtitle">FutureSelf 会结合你的聊天内容与饮食记录不断完善饮食画像。</p>

    <!-- 校区 -->
    <div class="mcs__section">
      <p class="mcs__label">所在校区</p>
      <input v-model="campus" placeholder="如：浙江大学紫金港校区" class="mcs-input" />
    </div>

    <!-- 饮食偏好 -->
    <div class="mcs__section">
      <p class="mcs__label">饮食偏好（可多选）</p>
      <div class="mcs__chips">
        <label v-for="tag in prefOptions" :key="tag" class="mcs__chip" :class="{ 'mcs__chip--active': preferences.includes(tag) }" @click="togglePref(tag)">
          {{ tag }}
        </label>
      </div>
    </div>

    <!-- 忌口 -->
    <div class="mcs__section">
      <p class="mcs__label">饮食忌口</p>
      <div class="mcs__chips">
        <label v-for="tag in tabooOptions" :key="tag" class="mcs__chip" :class="{ 'mcs__chip--active': taboos.includes(tag) }" @click="toggleTaboo(tag)">
          {{ tag }}
        </label>
      </div>
    </div>

    <!-- 饭点提醒 -->
    <div class="mcs__section">
      <p class="mcs__label">饭点提醒</p>
      <div class="mcs__row mcs__row--center">
        <label class="mcs__toggle">
          <input type="checkbox" v-model="mealRemindEnabled" />
          <span>{{ mealRemindEnabled ? '已开启' : '已关闭' }}</span>
        </label>
      </div>
      <div v-if="mealRemindEnabled" class="mcs__meal-times">
        <div class="mcs__meal-item">
          <span>🥐 早餐</span>
          <input type="time" v-model="customMealTime.breakfast" class="mcs-time" />
        </div>
        <div class="mcs__meal-item">
          <span>🍚 午餐</span>
          <input type="time" v-model="customMealTime.lunch" class="mcs-time" />
        </div>
        <div class="mcs__meal-item">
          <span>🌙 晚餐</span>
          <input type="time" v-model="customMealTime.dinner" class="mcs-time" />
        </div>
      </div>
    </div>

    <!-- 保存 -->
    <button class="mcs__sync-btn" :disabled="isSaving" @click="handleSave">
      <Save :size="16" />
      <span>{{ isSaving ? '保存中…' : '保存设置' }}</span>
    </button>
  </div>
</template>

<style scoped>
.mcs {
  max-width: 680px; margin: 0 auto 32px; position: relative;
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
  width:100%; padding:9px 12px; font-size:14px; font-family:var(--fs-font-sans);
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

.mcs__meal-times { display:flex; gap:12px; margin-top:10px; flex-wrap:wrap; }
.mcs__meal-item { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--fs-neutral-600); }
.mcs-time {
  padding:5px 8px; font-size:13px; font-family:var(--fs-font-sans);
  border:1px solid var(--fs-neutral-200); border-radius:var(--fs-radius-sm);
  background:var(--fs-neutral-0); color:var(--fs-neutral-700); outline:none;
}
.mcs-time:focus { border-color:var(--fs-brand-300); }

.mcs__sync-btn {
  display:inline-flex; align-items:center; gap:8px; height:42px; padding:0 24px;
  font-size:14px; font-weight:600; font-family:var(--fs-font-sans); color:#fff;
  background:var(--fs-ai-gradient); border:none; border-radius:var(--fs-radius-full);
  cursor:pointer; transition:all 200ms;
}
.mcs__sync-btn:hover:not(:disabled) { opacity:0.92; box-shadow:0 3px 12px rgba(59,130,246,0.2); }
.mcs__sync-btn:disabled { opacity:0.6; cursor:default; }

.mcs__toast {
  position:absolute; top:-44px; left:50%; transform:translateX(-50%); z-index:10;
  display:flex; align-items:center; gap:6px; padding:8px 18px;
  background:var(--fs-neutral-800); color:#fff; font-size:13px; font-weight:500;
  border-radius:var(--fs-radius-full); white-space:nowrap;
}
.toast-enter-active { animation: t-in 300ms var(--fs-ease-spring); }
.toast-leave-active { animation: t-out 200ms var(--fs-ease-out); }
@keyframes t-in { from { opacity:0; transform:translateX(-50%) translateY(6px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
@keyframes t-out { from { opacity:1; } to { opacity:0; } }
</style>
