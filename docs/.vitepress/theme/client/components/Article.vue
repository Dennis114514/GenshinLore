<script setup lang="ts">
import { Content, useData } from 'vitepress'
import { computed } from 'vue'
import useIsMobile from '../composables/isMobile'
import TableOfContents from './TableOfContents.vue'
import AppFooter from './AppFooter.vue'

const { frontmatter } = useData()
const isMobile = useIsMobile()

const title = computed(() => (frontmatter.value.title as string) ?? undefined)
</script>

<template>
  <div class="vp-doc article-content w-full relative" :class="!isMobile ? 'pt-17.5' : 'pt-15'">
    <div class="content-wrapper">
      <h1 v-if="title !== undefined" class="page-title">{{ title }}</h1>
      <Content />
    </div>
    <AppFooter />
    <TableOfContents />
  </div>
</template>

<style scoped></style>
