<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Sparkles } from 'lucide-vue-next'

const journeyHero = { aiAnalysis: '去和 FutureSelf 聊聊天，它会帮你分析成长轨迹。', growthScore: 0, growthLevel: 1, streak: 0 }
const visible = ref(false)
onMounted(() => requestAnimationFrame(() => { visible.value = true }))
</script>

<template>
  <section class="jh" :class="{ 'jh--visible': visible }">
    <div class="jh__card">
      <div class="jh__left">
        <FsAiAvatar :size="'lg'" :mood="'default'" :show-pulse="true" />
      </div>
      <div class="jh__center">
        <div class="jh__ai-label"><Sparkles :size="13" /><span>FutureSelf 分析</span></div>
        <p class="jh__text">{{ journeyHero.aiAnalysis }}</p>
      </div>
      <div class="jh__right">
        <div class="jh__stat"><span class="jh__stat-val">{{ journeyHero.growthScore }}</span><span class="jh__stat-lbl">成长值</span></div>
        <div class="jh__div" />
        <div class="jh__stat"><span class="jh__stat-val">Lv.{{ journeyHero.growthLevel }}</span><span class="jh__stat-lbl">成长等级</span></div>
        <div class="jh__div" />
        <div class="jh__stat"><span class="jh__stat-val">{{ journeyHero.streak }}<small>天</small></span><span class="jh__stat-lbl">连续成长</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.jh { max-width: 1100px; margin: 0 auto 32px; opacity: 0; transform: translateY(16px); transition: all 500ms var(--fs-ease-out); }
.jh--visible { opacity: 1; transform: translateY(0); }
.jh__card {
  display: flex; align-items: center; gap: 28px; padding: 30px 34px;
  background: linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 50%, #F0F5FF 100%);
  border: 1px solid rgba(59,130,246,0.1); border-radius: var(--fs-radius-xl);
  box-shadow: 0 0 0 1px rgba(59,130,246,0.04), 0 8px 32px rgba(59,130,246,0.05);
  position: relative; overflow: hidden;
}
.jh__card::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:50%; height:2px; background:var(--fs-ai-gradient); border-radius:0 0 2px 2px; opacity:0.4; }

.jh__left { flex-shrink: 0; }
.jh__center { flex: 1; min-width: 0; }
.jh__ai-label { display: inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:var(--fs-brand-500); margin-bottom:10px; padding:3px 10px; background:var(--fs-brand-50); border-radius:var(--fs-radius-full); }
.jh__text { font-size:14.5px; color:var(--fs-neutral-600); line-height:1.75; }

.jh__right { display:flex; align-items:center; gap:18px; flex-shrink:0; }
.jh__stat { text-align:center; }
.jh__stat-val { display:block; font-size:26px; font-weight:700; color:var(--fs-brand-500); letter-spacing:-0.03em; }
.jh__stat-val small { font-size:14px; font-weight:500; }
.jh__stat-lbl { display:block; font-size:11px; color:var(--fs-neutral-400); margin-top:2px; }
.jh__div { width:1px; height:32px; background:var(--fs-neutral-200); }
</style>
