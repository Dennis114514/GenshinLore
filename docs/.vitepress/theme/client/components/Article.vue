<script setup lang="ts">
import { Content, useData } from 'vitepress'
import { computed, ref } from 'vue'
import TableOfContents from './TableOfContents.vue'
import AppFooter from './AppFooter.vue'

const { frontmatter, page } = useData()
const tocCollapsed = ref(false)

const title = computed(() => (frontmatter.value.title as string) ?? undefined)
const hasToc = computed(() => {
  const headers = page.value.headers ?? []
  return headers.some((header) => header.level >= 2 && header.level <= 4)
})
</script>

<template>
  <div class="vp-doc article-content w-full relative">
    <div class="article-layout" :class="{ 'has-toc': hasToc, 'toc-collapsed': tocCollapsed }">
      <div class="article-main">
        <div class="content-wrapper">
          <h1 v-if="title !== undefined" class="page-title">{{ title }}</h1>
          <Content />
        </div>
        <AppFooter />
      </div>
      <div v-if="hasToc" class="article-toc">
        <TableOfContents v-model:collapsed="tocCollapsed" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-content {
  padding-top: calc(var(--mirror-notice-height, 0px) + var(--site-header-height-desktop, 70px));
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(16px, 1fr) minmax(0, 1000px) minmax(16px, 1fr);
  align-items: start;
  column-gap: 0;
  width: 100%;
}

.article-layout.has-toc {
  grid-template-columns: minmax(16px, 1fr) minmax(0, 1000px) minmax(16px, 1fr);
}

.article-main {
  grid-column: 2;
  min-width: 0;
}

.article-toc {
  display: contents;
}

.article-layout.has-toc.toc-collapsed {
  grid-template-columns: minmax(16px, 1fr) minmax(0, 1000px) minmax(16px, 1fr);
}

/* 仅在目录空间不足时才挤占正文 */
@media (min-width: 1013px) and (max-width: 1331px) {
  .article-layout.has-toc {
    grid-template-columns: minmax(12px, 1fr) minmax(0, 1000px) 18px minmax(0, 236px);
  }

  .article-layout.has-toc.toc-collapsed {
    grid-template-columns: minmax(12px, 1fr) minmax(0, 1000px) minmax(12px, 1fr);
  }

  .article-toc {
    display: block;
    grid-column: 4;
    min-width: 0;
    padding-left: 0;
    padding-right: 8px;
  }
}

@media (min-width: 1332px) and (max-width: 1581px) {
  .article-layout.has-toc {
    grid-template-columns: minmax(16px, 1fr) minmax(0, 1000px) 24px minmax(0, 275px);
  }

  .article-layout.has-toc.toc-collapsed {
    grid-template-columns: minmax(16px, 1fr) minmax(0, 1000px) minmax(16px, 1fr);
  }

  .article-toc {
    display: block;
    grid-column: 4;
    min-width: 0;
    padding-left: 0;
    padding-right: 12px;
  }
}

@media (max-width: 1012px) {
  .article-content {
    padding-top: calc(var(--mirror-notice-height, 0px) + var(--site-header-height-mobile, 60px));
  }

  .article-layout {
    display: block;
  }

  .article-toc {
    padding-left: 0;
  }
}
</style>
