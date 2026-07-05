<script setup lang="ts">
// ============================================================
// CalendarView.vue — 成长日历月视图
// [演示用] 静态期末考试数据，后续替换为真实后端 API
// ============================================================

import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2, ExternalLink, Check } from 'lucide-vue-next'

// ============================================================
// 演示用：期末考试静态数据（纯前端假数据，后续替换为真实 API）
// ============================================================
const DEMO_EXAMS = [
  { date: '2026-07-02', title: '高等数学期末考', description: '09:00-11:00 东教 2-101' },
  { date: '2026-07-04', title: '大学物理期末考', description: '14:30-16:30 西教 3-205' },
  { date: '2026-07-06', title: '数字电路期末考', description: '09:00-11:00 东教 1-302' },
  { date: '2026-07-08', title: '自动控制原理期末考', description: '14:30-16:30 综合楼 4-108' },
  { date: '2026-07-10', title: '单片机原理期末考', description: '09:00-11:00 实验楼 2-301' },
  { date: '2026-07-12', title: '大学英语期末考', description: '14:30-16:30 东教 2-403' },
] as const

function buildDemoEvents(): any[] {
  return DEMO_EXAMS.map((exam, i) => ({
    _id: `demo_exam_${i}`,
    userId: 'user_demo_001',
    date: exam.date,
    type: 'exam',
    title: exam.title,
    description: exam.description,
    category: '期末考试',
    source: 'demo',
  }))
}

const DEFAULT_USER_ID = 'user_demo_001'

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
// 演示用：直接使用静态考试数据
const events = ref<any[]>(buildDemoEvents())
const selectedDate = ref<string | null>(null)
const filterType = ref<string>('all')
const isLoading = ref(false)

const showModal = ref(false)
const editingEvent = ref<any>(null)
const form = ref({ title: '', type: 'custom', category: '', date: '', description: '', officialUrl: '', remindEnabled: true, remindDays: 3 })
const formErrors = ref<Record<string, string>>({})
const isSaving = ref(false)
const toast = ref('')

function prevMonth() { if (currentMonth.value === 1) { currentYear.value--; currentMonth.value = 12 } else currentMonth.value-- }
function nextMonth() { if (currentMonth.value === 12) { currentYear.value++; currentMonth.value = 1 } else currentMonth.value++ }
const monthLabel = computed(() => `${currentYear.value}年 ${currentMonth.value}月`)

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value, 0).getDate())
const firstDayOfWeek = computed(() => new Date(currentYear.value, currentMonth.value - 1, 1).getDay())

const calendarDays = computed(() => {
  const days: { date: number; dateStr: string; events: any[] }[] = []
  for (let d = 1; d <= daysInMonth.value; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: d, dateStr, events: events.value.filter((e) => e.date?.startsWith?.(dateStr)) })
  }
  return days
})

const selectedEvents = computed(() =>
  selectedDate.value ? events.value.filter((e) => e.date?.startsWith?.(selectedDate.value!)) : []
)
const filteredSelectedEvents = computed(() =>
  filterType.value === 'all' ? selectedEvents.value : selectedEvents.value.filter((e) => e.type === filterType.value)
)

// 演示用：不调用后端 API，本地构建考试数据
async function loadEvents() {
  isLoading.value = true
  await new Promise(r => setTimeout(r, 100))
  events.value = buildDemoEvents()
  isLoading.value = false
}
watch([currentYear, currentMonth], loadEvents)
onMounted(loadEvents)

function handleDateClick(dateStr: string) {
  if (selectedDate.value === dateStr) {
    selectedDate.value = null
  } else {
    selectedDate.value = dateStr
  }
}

function openAdd(dateStr?: string) {
  editingEvent.value = null
  formErrors.value = {}
  form.value = {
    title: '', type: 'custom', category: '',
    date: dateStr || selectedDate.value || `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
    description: '', officialUrl: '', remindEnabled: true, remindDays: 3,
  }
  showModal.value = true
}

function openEdit(event: any) {
  editingEvent.value = event
  formErrors.value = {}
  form.value = {
    title: event.title, type: event.type, category: event.category || '',
    date: event.date?.slice(0, 10) || '', description: event.description || '',
    officialUrl: event.officialUrl || '', remindEnabled: event.remindEnabled ?? true,
    remindDays: event.remindDays ?? 3,
  }
  showModal.value = true
}

function validateForm(): boolean {
  const errs: Record<string, string> = {}
  if (!form.value.title.trim()) errs.title = '请输入事件名称'
  if (!form.value.date) errs.date = '请选择日期'
  formErrors.value = errs
  return Object.keys(errs).length === 0
}

// 演示用：本地操作事件，不调用后端 API
async function handleSave() {
  if (!validateForm()) return
  isSaving.value = true
  await new Promise(r => setTimeout(r, 300))
  if (editingEvent.value) {
    const idx = events.value.findIndex((e: any) => e._id === editingEvent.value!._id)
    if (idx >= 0) {
      events.value[idx] = { ...events.value[idx],
        title: form.value.title.trim(), type: form.value.type, category: form.value.category,
        date: form.value.date, description: form.value.description, officialUrl: form.value.officialUrl,
        remindEnabled: form.value.remindEnabled, remindDays: form.value.remindDays,
      }
    }
    toast.value = '事件已更新 ✅'
  } else {
    events.value.push({
      _id: 'demo_local_' + Date.now(), userId: DEFAULT_USER_ID,
      title: form.value.title.trim(), type: form.value.type, category: form.value.category,
      date: form.value.date, description: form.value.description, officialUrl: form.value.officialUrl,
      remindEnabled: form.value.remindEnabled, remindDays: form.value.remindDays, source: 'demo',
    })
    toast.value = '事件已添加 ✅'
  }
  isSaving.value = false
  showModal.value = false
  setTimeout(() => { toast.value = '' }, 2500)
}

async function handleDelete(event: any) {
  if (!window.confirm(`确定删除「${event.title}」吗？`)) return
  events.value = events.value.filter((e: any) => e._id !== event._id)
  toast.value = '事件已删除'
  setTimeout(() => { toast.value = '' }, 2500)
}

async function handleDeleteInModal() {
  if (!editingEvent.value) return
  await handleDelete(editingEvent.value)
  showModal.value = false
}

function formatDateLabel(d: string) {
  const dt = new Date(d + 'T00:00:00')
  return `${dt.getMonth() + 1}月${dt.getDate()}日`
}

const typeLabel: Record<string, string> = { competition: '竞赛', exam: '考试', study: '学业', custom: '自定义' }
const typeColor: Record<string, string> = { competition: 'bg-amber-50 text-amber-600 border-amber-200', exam: 'bg-red-50 text-red-600 border-red-200', study: 'bg-blue-50 text-blue-600 border-blue-200', custom: 'bg-slate-50 text-slate-600 border-slate-200' }
const typeDot: Record<string, string> = { competition: 'bg-amber-500', exam: 'bg-red-500', study: 'bg-blue-500', custom: 'bg-slate-400' }
</script>

<template>
  <div class="cv">
    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast" class="cv__toast"><Check :size="15" /> {{ toast }}</div>
    </transition>

    <!-- === 顶部：月份导航 + 筛选 + 添加按钮 === -->
    <div class="cv__header">
      <div class="cv__nav">
        <button class="cv__nav-btn" @click="prevMonth"><ChevronLeft :size="18" /></button>
        <h3 class="cv__title">{{ monthLabel }}</h3>
        <button class="cv__nav-btn" @click="nextMonth"><ChevronRight :size="18" /></button>
      </div>
      <div class="cv__actions">
        <div class="cv__filters">
          <button v-for="f in [{k:'all',l:'全部'},{k:'competition',l:'竞赛'},{k:'exam',l:'考试'},{k:'study',l:'学业'},{k:'custom',l:'自定义'}]" :key="f.k"
            class="cv__filter-btn" :class="{ 'cv__filter-btn--active': filterType === f.k }" @click="filterType = f.k">{{ f.l }}</button>
        </div>
        <button class="cv__add-btn" @click="openAdd()"><Plus :size="16" stroke-width="2.5" /> 添加事件</button>
      </div>
    </div>

    <!-- === 星期头 === -->
    <div class="cv__weekdays">
      <span v-for="d in ['日','一','二','三','四','五','六']" :key="d" class="cv__weekday">{{ d }}</span>
    </div>

    <!-- === 日期格 === -->
    <div class="cv__grid">
      <div v-for="i in firstDayOfWeek" :key="'empty-'+i" class="cv__day cv__day--empty" />
      <div v-for="day in calendarDays" :key="day.dateStr"
        class="cv__day"
        :class="{
          'cv__day--selected': selectedDate === day.dateStr,
          'cv__day--today': day.dateStr === new Date().toISOString().slice(0,10),
          'cv__day--has-events': day.events.length > 0,
        }"
        @click="handleDateClick(day.dateStr)"
      >
        <span class="cv__day-num">{{ day.date }}</span>
        <div v-if="day.events.length" class="cv__day-badge">{{ day.events.length }}</div>
        <div v-if="day.events.length" class="cv__dots">
          <span v-for="(e,i) in day.events.slice(0,3)" :key="i" class="cv__dot" :class="typeDot[e.type] || typeDot.custom" />
          <span v-if="day.events.length > 3" class="cv__dot-more">+{{ day.events.length - 3 }}</span>
        </div>
      </div>
    </div>

    <!-- === 选中日期事件列表（展开/收起） === -->
    <transition name="events-expand">
      <div v-if="selectedDate" class="cv__events">
        <div class="cv__events-hd">
          <h4 class="cv__events-title">
            <span class="cv__events-date-badge">{{ formatDateLabel(selectedDate) }}</span>
            共 {{ filteredSelectedEvents.length }} 个事件
          </h4>
          <button class="cv__events-add" @click="openAdd(selectedDate)"><Plus :size="14" /> 添加</button>
        </div>
        <div v-if="!filteredSelectedEvents.length" class="cv__events-empty">
          暂无事件，点击右上角「+ 添加」来新增
        </div>
        <transition-group name="event-list" tag="div">
          <div v-for="ev in filteredSelectedEvents" :key="ev._id" class="cv__event-card">
            <div class="cv__event-top">
              <span class="cv__event-tag" :class="typeColor[ev.type] || typeColor.custom">{{ typeLabel[ev.type] || ev.type }}</span>
              <span v-if="ev.category" class="cv__event-cat">{{ ev.category }}</span>
              <span v-if="ev.source === 'ai_auto'" class="cv__event-ai">AI</span>
              <div class="cv__event-actions">
                <button @click="openEdit(ev)" title="编辑"><Pencil :size="13" /></button>
                <button @click="handleDelete(ev)" title="删除" class="cv__event-del"><Trash2 :size="13" /></button>
              </div>
            </div>
            <p class="cv__event-name">{{ ev.title }}</p>
            <p v-if="ev.description" class="cv__event-desc">{{ ev.description }}</p>
            <a v-if="ev.officialUrl" :href="ev.officialUrl" target="_blank" class="cv__event-link"><ExternalLink :size="12" /> 官方链接</a>
          </div>
        </transition-group>
      </div>
    </transition>

    <!-- === 新增/编辑弹窗 === -->
    <Teleport to="body">
      <div v-if="showModal" class="cv-modal-overlay" @click.self="showModal = false">
        <div class="cv-modal">
          <div class="cv-modal__hd">
            <h4>{{ editingEvent ? '编辑事件' : '添加事件' }}</h4>
            <button @click="showModal = false"><X :size="18" /></button>
          </div>
          <div class="cv-modal__body">
            <!-- 事件名称 -->
            <div class="cv-field">
              <input v-model="form.title" placeholder="请输入事件名称 *" class="cv-input" :class="{ 'cv-input--err': formErrors.title }" />
              <span v-if="formErrors.title" class="cv-field-err">{{ formErrors.title }}</span>
            </div>
            <!-- 日期 + 类型 -->
            <div class="cv-modal__row">
              <div class="cv-field cv-field--half">
                <input v-model="form.date" type="date" class="cv-input" :class="{ 'cv-input--err': formErrors.date }" />
                <span v-if="formErrors.date" class="cv-field-err">{{ formErrors.date }}</span>
              </div>
              <select v-model="form.type" class="cv-input cv-input--half">
                <option value="competition">竞赛</option><option value="exam">考试</option><option value="study">学业</option><option value="custom">自定义</option>
              </select>
            </div>
            <!-- 分类 + 详情 -->
            <input v-model="form.category" placeholder="分类（如算法竞赛、专业课考试）" class="cv-input" />
            <textarea v-model="form.description" placeholder="事件详情（选填）" class="cv-input cv-input--area" rows="3" />
            <input v-model="form.officialUrl" placeholder="官方链接（选填）" class="cv-input" />
            <!-- 提醒设置 -->
            <div class="cv-modal__remind">
              <label class="cv-toggle">
                <input type="checkbox" v-model="form.remindEnabled" />
                <span>开启提醒</span>
              </label>
              <div v-if="form.remindEnabled" class="cv-modal__remind-days">
                <span>提前</span>
                <input v-model.number="form.remindDays" type="number" min="1" max="30" class="cv-input cv-input--narrow" />
                <span>天</span>
              </div>
            </div>
          </div>
          <div class="cv-modal__ft">
            <button v-if="editingEvent" class="cv-btn cv-btn--danger" @click="handleDeleteInModal"><Trash2 :size="15" /> 删除</button>
            <div class="cv-modal__ft-spacer" />
            <button class="cv-btn cv-btn--ghost" @click="showModal = false">取消</button>
            <button class="cv-btn cv-btn--primary" :disabled="isSaving" @click="handleSave">
              {{ isSaving ? '保存中…' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.cv { max-width: 1100px; margin: 0 auto; position: relative; }

/* Toast */
.cv__toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 11000;
  display: flex; align-items: center; gap: 8px; padding: 10px 24px;
  background: var(--fs-neutral-800); color: #fff; font-size: 14px; font-weight: 500;
  border-radius: var(--fs-radius-full); box-shadow: var(--fs-shadow-lg);
}
.toast-enter-active { animation: toast-in 300ms var(--fs-ease-spring) both; }
.toast-leave-active { animation: toast-out 200ms var(--fs-ease-out) both; }
@keyframes toast-in { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
@keyframes toast-out { from { opacity:1; } to { opacity:0; } }

.cv__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:12px; }
.cv__nav { display:flex; align-items:center; gap:8px; }
.cv__nav-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:1px solid var(--fs-neutral-200); border-radius:var(--fs-radius-sm); background:var(--fs-neutral-0); cursor:pointer; color:var(--fs-neutral-600); }
.cv__nav-btn:hover { background:var(--fs-neutral-50); }
.cv__title { font-size:17px; font-weight:700; color:var(--fs-neutral-800); min-width:120px; text-align:center; }
.cv__actions { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.cv__filters { display:flex; align-items:center; gap:4px; }
.cv__filter-btn { padding:4px 12px; font-size:12.5px; font-weight:500; font-family:var(--fs-font-sans); color:var(--fs-neutral-500); background:var(--fs-neutral-0); border:1px solid var(--fs-neutral-200); border-radius:var(--fs-radius-full); cursor:pointer; transition:all 120ms; }
.cv__filter-btn--active, .cv__filter-btn:hover { color:var(--fs-brand-600); background:var(--fs-brand-50); border-color:rgba(59,130,246,0.2); }
.cv__add-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 18px; font-size:13px; font-weight:600; font-family:var(--fs-font-sans); color:#fff; background:var(--fs-ai-gradient); border:none; border-radius:var(--fs-radius-full); cursor:pointer; transition:all 150ms; }
.cv__add-btn:hover { opacity:0.92; box-shadow:0 3px 12px rgba(59,130,246,0.25); }

.cv__weekdays { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; margin-bottom:4px; }
.cv__weekday { text-align:center; font-size:12px; font-weight:600; color:var(--fs-neutral-400); padding:6px 0; }

.cv__grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.cv__day { min-height:72px; padding:4px 6px; border-radius:var(--fs-radius-sm); cursor:pointer; transition:all 180ms var(--fs-ease-out); background:var(--fs-neutral-0); border:1.5px solid transparent; display:flex; flex-direction:column; position:relative; overflow:hidden; }
.cv__day--empty { background:transparent; cursor:default; }
.cv__day:hover:not(.cv__day--empty) { background:var(--fs-neutral-50); border-color:var(--fs-brand-200); }
.cv__day--selected { border-color:var(--fs-brand-400); background:var(--fs-brand-50); box-shadow:0 0 0 1px var(--fs-brand-300); }
.cv__day--today .cv__day-num { color:var(--fs-brand-500); font-weight:700; }
.cv__day--has-events { background:var(--fs-brand-50); border-color:var(--fs-brand-150); }
.cv__day--has-events.cv__day--selected { background:var(--fs-brand-100); border-color:var(--fs-brand-400); }

/* 事件数量角标 */
.cv__day-badge {
  position:absolute; top:4px; right:5px;
  min-width:18px; height:18px; padding:0 5px;
  display:flex; align-items:center; justify-content:center;
  font-size:10.5px; font-weight:700; font-family:var(--fs-font-sans);
  color:#fff; background:var(--fs-brand-500); border-radius:9px;
  box-shadow:0 1px 3px rgba(59,130,246,0.3);
}
.cv__day-num { font-size:13px; color:var(--fs-neutral-600); font-weight:500; margin-bottom:2px; padding-right:4px; }
.cv__dots { display:flex; gap:3px; flex-wrap:wrap; align-items:center; margin-top:auto; padding-bottom:2px; }
.cv__dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; box-shadow:0 0 0 1px rgba(255,255,255,0.6); }
.cv__dot-more { font-size:10px; color:var(--fs-neutral-400); font-weight:500; }

.cv__events { margin-top:20px; padding:16px 20px; background:var(--fs-neutral-0); border:1px solid var(--fs-neutral-200); border-radius:var(--fs-radius-lg); }
.cv__events-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.cv__events-title { font-size:15px; font-weight:600; color:var(--fs-neutral-700); display:flex; align-items:center; gap:8px; }
.cv__events-date-badge { display:inline-block; padding:2px 10px; font-size:12px; font-weight:600; color:var(--fs-brand-600); background:var(--fs-brand-100); border-radius:var(--fs-radius-full); }
.cv__events-add { display:inline-flex; align-items:center; gap:4px; padding:6px 14px; font-size:12.5px; font-family:var(--fs-font-sans); font-weight:600; color:#fff; background:var(--fs-ai-gradient); border:none; border-radius:var(--fs-radius-full); cursor:pointer; transition:all 150ms; }
.cv__events-add:hover { opacity:0.9; box-shadow:0 2px 8px rgba(59,130,246,0.2); }
.cv__events-empty { text-align:center; padding:24px; font-size:13px; color:var(--fs-neutral-400); }

/* 展开/收起动画 */
.events-expand-enter-active { animation: events-in 280ms var(--fs-ease-spring); overflow:hidden; }
.events-expand-leave-active { animation: events-out 180ms var(--fs-ease-out); overflow:hidden; }
.events-expand-enter-from, .events-expand-leave-to { opacity:0; }
@keyframes events-in {
  from { opacity:0; transform:translateY(-8px); max-height:0; }
  to   { opacity:1; transform:translateY(0);   max-height:600px; }
}
@keyframes events-out {
  from { opacity:1; transform:translateY(0);   max-height:600px; }
  to   { opacity:0; transform:translateY(-8px); max-height:0; }
}

/* 事件列表 item 动画 */
.event-list-enter-active { transition:all 250ms var(--fs-ease-out); }
.event-list-leave-active { transition:all 150ms var(--fs-ease-out); }
.event-list-enter-from { opacity:0; transform:translateX(-12px); }
.event-list-leave-to { opacity:0; transform:translateX(12px); }
.event-list-move { transition:transform 200ms var(--fs-ease-out); }

.cv__event-card { padding:10px 0; border-bottom:1px solid var(--fs-neutral-100); }
.cv__event-card:last-child { border-bottom:none; }
.cv__event-top { display:flex; align-items:center; gap:8px; margin-bottom:4px; }
.cv__event-tag { font-size:11px; font-weight:600; padding:1px 8px; border-radius:var(--fs-radius-xs); border:1px solid; }
.cv__event-cat { font-size:12px; color:var(--fs-neutral-500); }
.cv__event-ai { font-size:10px; font-weight:600; color:var(--fs-brand-500); padding:1px 5px; background:var(--fs-brand-50); border-radius:var(--fs-radius-xs); }
.cv__event-actions { margin-left:auto; display:flex; gap:4px; }
.cv__event-actions button { width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;color:var(--fs-neutral-400);cursor:pointer;border-radius:var(--fs-radius-xs); }
.cv__event-actions button:hover { background:var(--fs-neutral-100);color:var(--fs-neutral-600); }
.cv__event-del:hover { color:var(--fs-error-500)!important;background:var(--fs-error-50)!important; }
.cv__event-name { font-size:14px;font-weight:600;color:var(--fs-neutral-800); }
.cv__event-desc { font-size:13px;color:var(--fs-neutral-500);margin-top:2px; }
.cv__event-link { display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--fs-brand-500);text-decoration:none;margin-top:4px; }

/* Modal */
.cv-modal-overlay { position:fixed;inset:0;z-index:10000;background:rgba(19,22,54,0.25);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px); }
.cv-modal { width:440px;max-height:90vh;overflow-y:auto;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border:1px solid rgba(59,130,246,0.1);border-radius:24px;box-shadow:0 8px 48px rgba(19,22,54,0.12); }
.cv-modal__hd { display:flex;align-items:center;justify-content:space-between;padding:20px 22px 14px;border-bottom:1px solid var(--fs-neutral-100); }
.cv-modal__hd h4 { font-size:17px;font-weight:700;color:var(--fs-neutral-800); }
.cv-modal__hd button { border:none;background:none;color:var(--fs-neutral-400);cursor:pointer;padding:4px;border-radius:var(--fs-radius-sm); }
.cv-modal__hd button:hover { background:var(--fs-neutral-100); }
.cv-modal__body { padding:20px 22px;display:flex;flex-direction:column;gap:12px; }
.cv-modal__row { display:flex;gap:10px; }
.cv-modal__remind { display:flex;align-items:center;justify-content:space-between; padding:10px 12px; background:var(--fs-neutral-50); border-radius:var(--fs-radius-md); }
.cv-modal__remind-days { display:flex;align-items:center;gap:6px;font-size:13px;color:var(--fs-neutral-600); }
.cv-modal__ft { display:flex;justify-content:flex-end;gap:10px;padding:14px 22px 18px; }

.cv-field { flex:1; display:flex; flex-direction:column; gap:3px; }
.cv-field--half { flex:0 0 calc(50% - 5px); }
.cv-field-err { font-size:11.5px; color:var(--fs-error-500); }

.cv-input { width:100%;padding:9px 12px;font-size:14px;font-family:var(--fs-font-sans);color:var(--fs-neutral-700);border:1.5px solid var(--fs-neutral-200);border-radius:var(--fs-radius-md);outline:none;background:var(--fs-neutral-0); }
.cv-input:focus { border-color:var(--fs-brand-300); }
.cv-input--err { border-color:var(--fs-error-400) !important; }
.cv-input--half { flex:1; }
.cv-input--area { resize:vertical; }
.cv-input--narrow { width:60px; text-align:center; }

.cv-toggle { display:flex;align-items:center;gap:7px;font-size:14px;color:var(--fs-neutral-600);cursor:pointer; }

.cv-btn { display:inline-flex;align-items:center;gap:5px;height:40px;padding:0 22px;font-size:14px;font-weight:600;font-family:var(--fs-font-sans);border-radius:var(--fs-radius-full);cursor:pointer;transition:all 150ms; }
.cv-btn--ghost { color:var(--fs-neutral-600);background:var(--fs-neutral-0);border:1px solid var(--fs-neutral-200); }
.cv-btn--ghost:hover { background:var(--fs-neutral-50); }
.cv-btn--primary { color:#fff;background:var(--fs-ai-gradient);border:none; }
.cv-btn--primary:hover:not(:disabled) { opacity:0.92; box-shadow:0 3px 12px rgba(59,130,246,0.2); }
.cv-btn--primary:disabled { opacity:0.6; cursor:default; }
.cv-btn--danger { color:var(--fs-error-500); background:var(--fs-error-50); border:1px solid var(--fs-error-200); }
.cv-btn--danger:hover { background:var(--fs-error-100); border-color:var(--fs-error-300); }
.cv-modal__ft-spacer { flex:1; }
</style>
