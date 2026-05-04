<script setup lang="ts">
import { Content, useData } from 'vitepress'
import NotFound from './components/NotFound.vue'

const { page } = useData()
</script>

<template>
  <div>
    <main>
      <NotFound v-if="page.isNotFound" />
      <Content v-else />
    </main>
  </div>
</template>
