<script setup lang="ts">
import { useData } from 'vitepress'
import NotFound from './components/NotFound.vue'
import SplashScreenLayout from './components/SplashScreen.vue'
import HomeScreenLayout from './components/HomeScreen.vue'
import AppHeader from './components/AppHeader.vue'
import Article from './components/Article.vue'
import NationScreen from './components/NationScreen.vue'
import TimelineScreen from './components/TimelineScreen.vue'
import EastereggScreen from './components/EastereggScreen.vue'
import NoticeModal from './components/NoticeModal.vue'
import UserAgreementModal from './components/UserAgreementModal.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <div class="flex m-0 p-0">
    <!-- 统一页眉 -->
    <AppHeader :class="page.isNotFound || frontmatter.layout == 'splash' ? 'hidden' : ''" />
    <!-- 针对特定路由的自定义页面 -->
    <SplashScreenLayout v-if="frontmatter.layout === 'splash'" />
    <HomeScreenLayout v-else-if="frontmatter.layout === 'home'" />
    <NationScreen v-else-if="frontmatter.layout === 'nations'" />
    <TimelineScreen v-else-if="frontmatter.layout === 'timeline'" />
    <EastereggScreen v-else-if="frontmatter.layout === 'interestfacts'" />
    <!-- 常规渲染 由vitepress进行 -->
    <div v-else class="flex w-full min-h-screen bg-[#f5f5f5]">
      <main class="flex w-full">
        <NotFound v-if="page.isNotFound" />
        <Article v-else />
      </main>
    </div>

    <!-- 全局弹窗（仅客户端渲染，Teleport 到 body） -->
    <ClientOnly>
      <UserAgreementModal />
      <NoticeModal />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
