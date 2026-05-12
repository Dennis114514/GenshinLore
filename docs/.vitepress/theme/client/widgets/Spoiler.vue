<template>
  <span class="black-block" :title="title"><slot /></span>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
