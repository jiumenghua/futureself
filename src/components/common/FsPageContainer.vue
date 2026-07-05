<script setup lang="ts">
interface FsPageContainerProps {
  maxWidth?: string  // 覆盖默认 960px
}

withDefaults(defineProps<FsPageContainerProps>(), {
  maxWidth: '960px',
})
</script>

<template>
  <div class="fs-page-container" :style="{ maxWidth }">
    <slot />
  </div>
</template>

<style scoped>
.fs-page-container {
  width: 100%;
  margin: 0 auto;
}
</style>
