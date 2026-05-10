<script setup lang="ts"></script>

<template>
  <div class="mid-title">
    <slot></slot>
  </div>
</template>

<style scoped>
.mid-title {
  font-family: Genshin, serif !important;
  font-size: 28px !important;
  color: rgb(77, 79, 83) !important;
  text-align: center !important;
  margin-bottom: 30px !important;
  position: relative !important;
  padding-bottom: 15px !important;
}

.mid-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgb(211, 188, 142), transparent);
}
</style>
