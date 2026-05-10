<script setup lang="ts">
defineProps<{
  size?: number
}>()
</script>

<template>
  <div :style="{ width: '100%', height: `${size ?? 16}px` }"></div>
</template>

<style scoped></style>
