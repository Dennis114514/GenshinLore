<script setup lang="ts">
import { Content, useData } from 'vitepress'
import { computed } from 'vue'
import useIsMobile from '../composables/isMobile'

const { frontmatter, page } = useData()
const isMobile = useIsMobile()

const title = computed(() => (frontmatter.value.title as string) ?? undefined)
</script>

<template>
  <div
    class="relative w-screen overflow-x-hidden h-full flex-1 bg-[#f5f5f5]"
    :class="!isMobile ? 'pt-17.5' : 'pt-15'"
  >
    <h1 v-if="title !== undefined">{{ title }}</h1>
    <Content />
  </div>
</template>

<style scoped></style>
