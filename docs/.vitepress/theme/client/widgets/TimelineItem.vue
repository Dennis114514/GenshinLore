<script setup lang="ts"></script>

<template>
  <div class="timeline-item">
    <slot />
  </div>
</template>

<style scoped>
.timeline-item :deep(p) {
  font-family: Common, sans-serif;
  font-size: 14px;
  color: rgb(90, 92, 95);
  line-height: 1.8;
  text-align: left;
  margin: 10px 0;
}
</style>
