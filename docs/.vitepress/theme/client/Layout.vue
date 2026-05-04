<script setup lang="ts">
import { useData } from 'vitepress'
import NotFound from './components/NotFound.vue'
import SplashScreenLayout from './components/SplashScreen.vue'
import HomeScreenLayout from './components/HomeScreen.vue'
import AppHeader from './components/AppHeader.vue'
import Article from './components/Article.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <div class="flex m-0 p-0">
    <!-- 统一页眉 -->
    <AppHeader :class="page.isNotFound || frontmatter.layout == 'splash' ? 'hidden' : ''" />
    <!-- 针对特定路由的自定义页面 -->
    <SplashScreenLayout v-if="frontmatter.layout === 'splash'" />
    <HomeScreenLayout v-else-if="frontmatter.layout === 'home'" />
    <!-- 常规渲染 由vitepress进行 -->
    <div v-else class="flex w-screen h-screen">
      <main class="flex">
        <NotFound v-if="page.isNotFound" />
        <Article v-else />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
