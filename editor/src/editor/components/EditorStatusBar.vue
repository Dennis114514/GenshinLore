<script setup lang="ts">
defineProps<{
  words: number
  chars: number
}>()
</script>

<template>
  <div class="status-bar">
    <span>词单元: {{ words }}</span>
    <span>非空字符: {{ chars }}</span>
    <span>快捷提示: <code>/</code> 命令，<code>Ctrl/Cmd+Z</code> 撤销</span>
  </div>
</template>
