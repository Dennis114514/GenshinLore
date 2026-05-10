<script setup lang="ts"></script>

<template>
  <div class="intro-second secondary-quote">
    <slot />
  </div>
</template>

<style scoped>
.secondary-quote :deep(p) {
  color: #8d8f93;
  font-size: 14px;
  margin: 0 !important;
}
</style>
