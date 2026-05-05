<script setup lang="ts">
defineProps<{
  src: string
  caption?: string
}>()
</script>

<template>
  <div class="timeline-image">
    <img :src="src" :alt="caption || 'image'" />
    <p v-if="caption" class="image-caption">{{ caption }}</p>
  </div>
</template>

<style scoped>
.timeline-image {
  text-align: center;
  margin: 20px 0;
}

.timeline-image img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: block;
  margin: 0 auto;
}

.image-caption {
  font-family: 'Common', sans-serif;
  font-size: 12px;
  color: #8d8f93;
  margin-top: 10px;
  text-align: center;
}
</style>
