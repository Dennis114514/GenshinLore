<script setup lang="ts">
import { Content, useData } from 'vitepress'
import NotFound from './components/NotFound.vue'
import SplashScreenLayout from './layouts/SplashScreen.vue'
import HomeScreenLayout from './layouts/HomeScreen.vue'
import AppHeader from './components/AppHeader.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <AppHeader :class="page.isNotFound || frontmatter.layout == 'splash' ? 'hidden' : ''" />
  <SplashScreenLayout v-if="frontmatter.layout === 'splash'" />
  <HomeScreenLayout v-else-if="frontmatter.layout === 'home'" />
  <div v-else>
    <main>
      <NotFound v-if="page.isNotFound" />
      <template v-else>
        <Content />
      </template>
    </main>
  </div>
</template>

<style scoped>
@media screen and (max-width: 1012px) {
  .default-layout main {
    margin-top: 60px;
  }
}
</style>
