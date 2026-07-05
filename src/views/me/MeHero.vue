<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/stores/appStore'
import FsAiAvatar from '@/components/common/FsAiAvatar.vue'
import { Sparkles, Heart } from 'lucide-vue-next'

const store = useAppStore()
const visible = ref(false)
onMounted(() => requestAnimationFrame(() => { visible.value = true }))

const displayName = computed(() => store.user?.name || '同学')
const displaySchool = computed(() => store.profile?.school || '')
const displayMajor = computed(() => store.profile?.major || '')
const displayGrade = computed(() => store.profile?.grade || '')
const growthScore = computed(() => store.profile?.growthScore || 0)
const growthLevel = computed(() => Math.floor(growthScore.value / 20) + 1)
const hasProfile = computed(() => store.profile && store.profile.lastProfileUpdate)
const aiMessage = computed(() => {
  if (!hasProfile.value) return '嗨！我是 FutureSelf。去和我聊聊天吧，我会逐渐了解你，帮你记录成长。'
  return `我们已经一起成长了，谢谢你一直相信我。未来也一起加油。`
})
</script>

<template>
  <section class="mh" :class="{ 'mh--visible': visible }">
    <div class="mh__card">
      <!-- 左侧：用户信息 -->
      <div class="mh__left">
        <div class="mh__user-avatar">
          <span class="mh__user-initial">{{ displayName.charAt(0) }}</span>
        </div>
        <div class="mh__user-info">
          <h2 class="mh__user-name">{{ displayName }}</h2>
          <p class="mh__user-meta">{{ displayMajor }}<template v-if="displayMajor && displayGrade"> · </template>{{ displayGrade }}</p>
          <p class="mh__user-school">{{ displaySchool }}</p>
        </div>
      </div>

      <!-- 中间：FutureSelf 的话 -->
      <div class="mh__center">
        <div class="mh__ai-msg">
          <Sparkles :size="14" class="mh__ai-icon" />
          <p>"{{ aiMessage }}"</p>
        </div>
      </div>

      <!-- 右侧：成长数据 -->
      <div class="mh__right">
        <div class="mh__stat">
          <span class="mh__stat-value">{{ growthScore }}</span>
          <span class="mh__stat-label">成长值</span>
        </div>
        <div class="mh__divider" />
        <div class="mh__stat">
          <span class="mh__stat-value">Lv.{{ growthLevel }}</span>
          <span class="mh__stat-label">成长等级</span>
        </div>
        <div class="mh__divider" />
        <div class="mh__stat">
          <span class="mh__stat-value">—<small></small></span>
          <span class="mh__stat-label">连续成长</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mh { max-width: 1100px; margin: 0 auto 32px; opacity: 0; transform: translateY(16px); transition: all 500ms var(--fs-ease-out); }
.mh--visible { opacity: 1; transform: translateY(0); }

.mh__card {
  display: flex; align-items: center; gap: 32px;
  padding: 32px 36px;
  background: linear-gradient(145deg, #FFFFFF 0%, #F8FAFF 50%, #F0F5FF 100%);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: var(--fs-radius-xl);
  box-shadow: 0 0 0 1px rgba(59,130,246,0.04), 0 8px 32px rgba(59,130,246,0.05);
  position: relative; overflow: hidden;
}
.mh__card::before {
  content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 50%; height: 2px; background: var(--fs-ai-gradient); border-radius: 0 0 2px 2px; opacity: 0.4;
}

/* 左侧 */
.mh__left { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.mh__user-avatar {
  width: 64px; height: 64px; border-radius: var(--fs-radius-full);
  background: var(--fs-ai-gradient); display: flex; align-items: center; justify-content: center;
}
.mh__user-initial { font-size: 26px; font-weight: 700; color: #fff; }
.mh__user-name { font-size: 20px; font-weight: 700; color: var(--fs-neutral-800); letter-spacing: -0.02em; }
.mh__user-meta { font-size: 13px; color: var(--fs-neutral-600); margin: 2px 0; }
.mh__user-school { font-size: 12px; color: var(--fs-neutral-400); }

/* 中间 */
.mh__center { flex: 1; min-width: 0; }
.mh__ai-msg {
  display: flex; gap: 8px; padding: 16px 20px;
  background: var(--fs-brand-50); border: 1px solid rgba(59,130,246,0.1);
  border-radius: var(--fs-radius-lg);
  font-size: 14px; color: var(--fs-brand-700); line-height: 1.65; font-style: italic;
}
.mh__ai-icon { color: var(--fs-brand-500); flex-shrink: 0; margin-top: 2px; }

/* 右侧 */
.mh__right { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
.mh__stat { text-align: center; }
.mh__stat-value { display: block; font-size: 28px; font-weight: 700; color: var(--fs-brand-500); letter-spacing: -0.03em; }
.mh__stat-value small { font-size: 14px; font-weight: 500; }
.mh__stat-label { font-size: 11.5px; color: var(--fs-neutral-400); margin-top: 2px; display: block; }
.mh__divider { width: 1px; height: 36px; background: var(--fs-neutral-200); }
</style>
