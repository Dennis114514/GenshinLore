<script setup lang="ts">
import { Content, useData } from 'vitepress'
import NotFound from './components/NotFound.vue'
import SplashScreenLayout from './layouts/SplashScreen.vue'
import HomeLayout from './layouts/home.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <SplashScreenLayout v-if="frontmatter.layout === 'splash'" />
  <HomeLayout v-else-if="frontmatter.layout === 'home'" />
  <div v-else>
    <main>
      <NotFound v-if="page.isNotFound" />
      <Content v-else />
    </main>
  </div>
</template>
