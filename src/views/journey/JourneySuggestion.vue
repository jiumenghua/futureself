<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGrowthEval } from '@/api/journey(DeepSeek API)'
import { Lightbulb, ArrowRight } from 'lucide-vue-next'
import { mockJourneySuggestion } from '@/mock/journey'

const suggestion = ref<any>(null)

// 尝试从 API 获取真实成长评价
async function fetchGrowthEval() {
  try {
    const evalData = await getGrowthEval('user_demo_001', 'week')
    if (evalData) {
      suggestion.value = {
        title: 'AI 成长评价',
        summary: evalData.summary,
        items: [...evalData.highlights, ...evalData.suggestions],
      }
    }
  } catch {
    // 降级使用 mock 数据
    suggestion.value = { ...mockJourneySuggestion }
  }

  // DB 离线时也降级
  if (!suggestion.value) {
    suggestion.value = { ...mockJourneySuggestion }
  }
}

onMounted(() => {
  fetchGrowthEval()
})
</script>

<template>
  <section class="js">
    <div v-if="suggestion" class="js__card">
      <div class="js__left">
        <div class="js__hd"><Lightbulb :size="20" stroke-width="1.75" /><h3>{{ suggestion.title }}</h3></div>
        <p class="js__summary">{{ suggestion.summary }}</p>
        <ul class="js__list"><li v-for="item in suggestion.items" :key="item">{{ item }}</li></ul>
        <button class="js__btn"><span>生成下周计划</span><ArrowRight :size="15"/></button>
      </div>
      <div class="js__right"><div class="js__glow" /></div>
    </div>
    <p v-else class="js__empty">暂无建议</p>
  </section>
</template>

<style scoped>
.js { max-width: 1100px; margin: 0 auto 32px; }
.js__card { display:flex; align-items:stretch; padding:30px 34px; background:linear-gradient(135deg,#F8FAFF 0%,#F0F5FF 100%); border:1px solid rgba(59,130,246,0.08); border-radius:var(--fs-radius-lg); overflow:hidden; position:relative; }
.js__card::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:40%; height:1.5px; background:var(--fs-ai-gradient); border-radius:0 0 2px 2px; opacity:0.35; }
.js__left { flex:1; position:relative; z-index:1; }
.js__hd { display:flex; align-items:center; gap:10px; margin-bottom:14px; color:var(--fs-brand-500); font-size:18px; font-weight:700; }
.js__summary { font-size:14.5px; color:var(--fs-neutral-600); line-height:1.7; margin-bottom:16px; }
.js__list { list-style:none; display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
.js__list li { font-size:14px; color:var(--fs-neutral-700); }
.js__btn { display:inline-flex; align-items:center; gap:6px; height:42px; padding:0 22px; font-size:15px; font-weight:600; font-family:var(--fs-font-sans); color:#fff; background:var(--fs-ai-gradient); border:none; border-radius:var(--fs-radius-full); cursor:pointer; transition:all 200ms; }
.js__btn:hover { opacity:0.92; box-shadow:0 4px 16px rgba(59,130,246,0.25); transform:translateY(-1px); }
.js__right { flex-shrink:0; width:100px; display:flex; align-items:center; justify-content:center; }
.js__glow { width:80px; height:80px; background:radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%); border-radius:50%; animation:js-glow 3s ease-in-out infinite; }
.js__empty { text-align:center; padding:48px 0; font-size:14px; color:var(--fs-neutral-400); }
@keyframes js-glow { 0%,100%{opacity:0.4;transform:scale(1);} 50%{opacity:0.9;transform:scale(1.12);} }
</style>
