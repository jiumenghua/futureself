<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { mockJourneyEvents } from '@/mock/journey'

const events = mockJourneyEvents
</script>

<template>
  <section class="jt">
    <div class="jt__header">
      <Clock :size="18" stroke-width="1.75" class="jt__icon" />
      <h3 class="jt__title">成长足迹</h3>
    </div>
    <div v-if="events.length > 0" class="jt__list">
      <div v-for="(evt, i) in events" :key="evt.id" class="jt__item" :style="{ animationDelay: i*80+'ms' }">
        <div class="jt__time"><span>{{ evt.date }}</span></div>
        <div class="jt__node-col"><div class="jt__dot">{{ evt.icon }}</div><div v-if="i<events.length-1" class="jt__line" /></div>
        <div class="jt__body"><h4>{{ evt.title }}</h4><p>{{ evt.description }}</p></div>
      </div>
    </div>
    <p v-else class="jt__empty">暂无成长足迹</p>
  </section>
</template>

<style scoped>
.jt { max-width: 1100px; margin: 0 auto 32px; }
.jt__header { display:flex; align-items:baseline; gap:8px; margin-bottom:20px; }
.jt__icon { color:var(--fs-brand-500); }
.jt__title { font-size:18px; font-weight:700; color:var(--fs-neutral-800); }
.jt__list { display:flex; flex-direction:column; }
.jt__item { display:flex; gap:16px; animation: jt-in 400ms var(--fs-ease-out) both; opacity:0; }
.jt__time { width:56px; flex-shrink:0; padding-top:6px; }
.jt__time span { font-size:13px; font-weight:600; color:var(--fs-neutral-500); }
.jt__node-col { display:flex; flex-direction:column; align-items:center; flex-shrink:0; width:36px; }
.jt__dot { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:var(--fs-radius-full); background:var(--fs-neutral-0); border:2px solid var(--fs-neutral-200); font-size:15px; }
.jt__line { width:2px; flex:1; min-height:28px; background:var(--fs-neutral-200); margin:4px 0; }
.jt__body { flex:1; padding:8px 0 28px; min-width:0; }
.jt__body h4 { font-size:14.5px; font-weight:600; color:var(--fs-neutral-800); margin-bottom:3px; }
.jt__body p { font-size:13.5px; color:var(--fs-neutral-600); line-height:1.5; }
.jt__empty { text-align:center; padding:48px 0; font-size:14px; color:var(--fs-neutral-400); }
@keyframes jt-in { from{opacity:0;transform:translateX(-8px);} to{opacity:1;transform:translateX(0);} }
</style>
