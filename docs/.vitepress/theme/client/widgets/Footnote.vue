<script setup lang="ts">
defineProps<{
  n: string
  text: string
}>()
</script>

<template>
  <span class="footnote">
    <sup>{{ n }}</sup>
    <span class="footnote-tooltip" v-html="text"></span>
  </span>
</template>

<style scoped>
.footnote {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  cursor: help;
}

.footnote sup {
  color: #D3BC8E;
  margin-left: 2px;
}

.footnote-tooltip {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 5px;
  background-color: #4d4f53;
  color: #D3BC8E;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  white-space: normal;
  width: 350px;
  max-width: 350px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 4000;
  pointer-events: none;
  text-align: left;
  line-height: 1.5;
  font-family: 'Common', sans-serif;
}

.footnote:hover .footnote-tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
