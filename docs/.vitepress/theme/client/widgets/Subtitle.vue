<script setup lang="ts"></script>

<template>
  <h3 class="subtitle">
    <slot />
  </h3>
</template>

<style scoped>
.subtitle {
  font-family: 'Genshin', sans-serif !important;
  font-size: 18px !important;
  color: #4d4f53 !important;
  margin: 0 !important;
  font-weight: bold !important;
}
</style>
