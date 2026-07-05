<script setup lang="ts">
import { useNotification } from '@/hooks/useNotification'
import FsAiNotification from './FsAiNotification.vue'

const { activeNotifications, dismiss } = useNotification()
</script>

<template>
  <Teleport to="body">
    <div class="fs-notification-container" aria-live="polite">
      <FsAiNotification
        v-for="(notif, idx) in activeNotifications"
        :key="notif.id"
        :notification="notif"
        :index="idx"
        @close="dismiss"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.fs-notification-container {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}
</style>
