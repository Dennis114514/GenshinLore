<script setup lang="ts">
import { useData } from 'vitepress'
import NotFound from './components/NotFound.vue'
import Splash from './views/Splash/index.vue'
import Home from './views/Home/index.vue'
import AppHeader from './components/AppHeader.vue'
import Article from './components/Article.vue'
import Nation from './views/Nation/index.vue'
import Timeline from './views/Timeline/index.vue'
import Easteregg from './views/Easteregg/index.vue'
import NoticeModal from './components/NoticeModal.vue'
import UserAgreementModal from './components/UserAgreementModal.vue'
import MirrorNotice from './components/MirrorNotice.vue'

const { page, frontmatter } = useData()
</script>

<template>
  <div class="flex m-0 p-0">
    <MirrorNotice />
    <!-- 统一页眉 -->
    <AppHeader :class="page.isNotFound || frontmatter.layout == 'splash' ? 'hidden' : ''" />
    <!-- 针对特定路由的自定义页面 -->
    <Splash v-if="frontmatter.layout === 'splash'" />
    <Home v-else-if="frontmatter.layout === 'home'" />
    <Nation v-else-if="frontmatter.layout === 'nations'" />
    <Timeline v-else-if="frontmatter.layout === 'timeline'" />
    <Easteregg v-else-if="frontmatter.layout === 'interestfacts'" />
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
