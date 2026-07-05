<script setup lang="ts">
import { Award, Lock } from 'lucide-vue-next'
import { mockJourneyBadges } from '@/mock/journey'

const badges = mockJourneyBadges
function getStyle(badge: any) {
  if (badge.earned) return { background: badge.color + '10', borderColor: badge.color + '28', opacity: 1 }
  return { background: 'var(--fs-neutral-50)', borderColor: 'var(--fs-neutral-200)', opacity: 0.5 }
}
</script>

<template>
  <section class="jb">
    <div class="jb__header">
      <Award :size="18" stroke-width="1.75" class="jb__icon" />
      <h3 class="jb__title">成长徽章</h3>
      <span class="jb__sub">{{ badges.filter(b=>b.earned).length }}/{{ badges.length }} 已获得</span>
    </div>
    <div v-if="badges.length > 0" class="jb__grid">
      <div v-for="badge in badges" :key="badge.id" class="jb__card" :style="getStyle(badge)">
        <div class="jb__card-top">
          <span class="jb__card-icon">{{ badge.icon }}</span>
          <Lock v-if="!badge.earned" :size="13" class="jb__card-lock" />
        </div>
        <h4 class="jb__card-title" :class="{ 'jb__card-title--locked': !badge.earned }">{{ badge.title }}</h4>
        <p class="jb__card-desc">{{ badge.description }}</p>
      </div>
    </div>
    <p v-else class="jb__empty">暂无徽章</p>
  </section>
</template>

<style scoped>
.jb { max-width: 1100px; margin: 0 auto 48px; }
.jb__header { display:flex; align-items:baseline; gap:8px; margin-bottom:18px; }
.jb__icon { color:var(--fs-brand-500); }
.jb__title { font-size:18px; font-weight:700; color:var(--fs-neutral-800); }
.jb__sub { font-size:13px; color:var(--fs-neutral-400); margin-left:4px; }

.jb__grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.jb__card { padding:18px 20px; border:1px solid; border-radius:var(--fs-radius-lg); transition:all 200ms; }
.jb__card:hover { transform:translateY(-1px); }
.jb__card-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.jb__card-icon { font-size:24px; }
.jb__card-lock { color:var(--fs-neutral-400); }
.jb__card-title { font-size:14px; font-weight:600; color:var(--fs-neutral-800); margin-bottom:4px; }
.jb__card-title--locked { color:var(--fs-neutral-400); }
.jb__card-desc { font-size:11.5px; color:var(--fs-neutral-400); line-height:1.4; }
.jb__empty { text-align:center; padding:48px 0; font-size:14px; color:var(--fs-neutral-400); }
</style>
