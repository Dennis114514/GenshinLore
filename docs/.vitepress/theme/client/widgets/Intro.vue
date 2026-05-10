<script setup lang="ts"></script>

<template>
  <section class="intro-text">
    <slot />
  </section>
</template>

<style scoped>
.intro-text {
  font-family: Common, sans-serif !important;
  font-size: 18px !important;
  color: rgb(77, 79, 83) !important;
  text-align: center !important;
  line-height: 2 !important;
  margin-bottom: 50px !important;
  padding: 30px !important;
  background: linear-gradient(135deg, rgb(248, 248, 248) 0%, rgb(240, 240, 240) 100%) !important;
  border-radius: 12px !important;
  border-left: 4px solid rgb(211, 188, 142) !important;
  border-right: 4px solid rgb(211, 188, 142) !important;
}

.intro-text :deep(p) {
  margin: 0 !important;
  padding: 3px 0 !important;
  text-align: center !important;
}
</style>
