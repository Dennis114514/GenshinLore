<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Header } from 'vitepress'
import useIsMobile from '../composables/isMobile'

const { page } = useData()
const isMobile = useIsMobile()

const props = defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

interface TocItem {
  id: string
  text: string
  level: number
}

const activeId = ref('')
const mobileDrawerOpen = ref(false)

const sidebarCollapsed = computed({
  get: () => props.collapsed ?? false,
  set: (value: boolean) => emit('update:collapsed', value),
})

function collectTocItems(headers: Header[]): TocItem[] {
  const items: TocItem[] = []

  const visit = (nodes: Header[]) => {
    for (const node of nodes) {
      if (node.level >= 2 && node.level <= 4) {
        items.push({
          id: node.slug,
          text: node.title,
          level: node.level,
        })
      }
      if (node.children?.length) {
        visit(node.children)
      }
    }
  }

  visit(headers)
  return items
}

const tocItems = computed(() => collectTocItems(page.value.headers ?? []))
const hasContent = computed(() => tocItems.value.length > 0)
const desktopVisible = computed(() => hasContent.value && !isMobile.value)
const mobileVisible = computed(() => hasContent.value && isMobile.value)

function updateActive() {
  const offset = 100
  let current = ''
  for (const item of tocItems.value) {
    const el = document.getElementById(item.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= offset) {
      current = item.id
    }
  }
  if (!current && tocItems.value.length > 0) {
    current = tocItems.value[0].id
  }
  activeId.value = current
}

function openMobileDrawer() {
  mobileDrawerOpen.value = true
}

function closeMobileDrawer() {
  mobileDrawerOpen.value = false
}

function onTocLinkClick() {
  if (isMobile.value) {
    closeMobileDrawer()
  }
}

watch(mobileDrawerOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

watch(isMobile, (mobile) => {
  if (!mobile) {
    closeMobileDrawer()
  }
})

watch(
  () => page.value.relativePath,
  () => {
    closeMobileDrawer()
    nextTick(() => {
      updateActive()
    })
  },
)

onMounted(() => {
  nextTick(() => {
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
  })
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('scroll', updateActive)
})
</script>

<template>
  <aside v-if="desktopVisible" class="toc-sidebar" :class="{ collapsed: sidebarCollapsed }">
    <div class="toc-header" :class="{ compact: sidebarCollapsed }">
      <h3 class="toc-title">目录导航</h3>
      <button
        v-if="!sidebarCollapsed"
        class="toc-toggle-btn"
        @click="sidebarCollapsed = true"
        title="收起目录"
      >
        →
      </button>
    </div>
    <ul class="toc-list">
      <li v-for="item in tocItems" :key="item.id" class="toc-item">
        <a
          :href="'#' + item.id"
          class="toc-link"
          :class="[`level-${item.level}`, { active: activeId === item.id }]"
          @click="onTocLinkClick"
          >{{ item.text }}</a
        >
      </li>
    </ul>
  </aside>

  <button
    v-if="desktopVisible && sidebarCollapsed"
    class="toc-reopen-btn"
    @click="sidebarCollapsed = false"
    title="展开目录"
  >
    ←
  </button>

  <Teleport to="body">
    <button
      v-if="mobileVisible"
      class="toc-mobile-fab"
      @click="openMobileDrawer"
      title="目录导航"
      aria-label="目录导航"
    >
      目录
    </button>

    <transition name="toc-mobile-fade">
      <div v-if="mobileDrawerOpen" class="toc-mobile-mask" @click="closeMobileDrawer"></div>
    </transition>

    <transition name="toc-mobile-sheet">
      <section v-if="mobileDrawerOpen" class="toc-mobile-sheet" role="dialog" aria-modal="true">
        <div class="toc-mobile-header">
          <h3 class="toc-mobile-title">目录导航</h3>
          <button class="toc-mobile-close" @click="closeMobileDrawer" title="关闭目录">✕</button>
        </div>
        <ul class="toc-mobile-list">
          <li v-for="item in tocItems" :key="`m-${item.id}`" class="toc-mobile-item">
            <a
              :href="'#' + item.id"
              class="toc-mobile-link"
              :class="[`level-${item.level}`, { active: activeId === item.id }]"
              @click="onTocLinkClick"
              >{{ item.text }}</a
            >
          </li>
        </ul>
      </section>
    </transition>
  </Teleport>
</template>

<style scoped>
.toc-sidebar {
  position: fixed;
  top: calc(var(--mirror-notice-height, 0px) + 88px);
  right: 16px;
  width: 275px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 108px);
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0px 4px 0 12px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 900;
  border-left: 1px solid #e8e8e8;
  box-sizing: border-box;
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 0.32s ease,
    transform 0.32s ease,
    border-color 0.24s ease;
}

.toc-sidebar.collapsed {
  transform: translateX(calc(100% + 24px));
  opacity: 0;
  border-color: transparent;
  pointer-events: none;
}

.toc-sidebar::-webkit-scrollbar {
  width: 6px;
}

.toc-sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.toc-sidebar::-webkit-scrollbar-thumb {
  background: #d3bc8e;
  border-radius: 3px;
}

.toc-sidebar::-webkit-scrollbar-thumb:hover {
  background: #c4a87a;
}

.toc-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 10px;
  margin-bottom: 10px;
  gap: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid rgba(211, 188, 142, 0.22);
}

.toc-header.compact {
  padding-bottom: 6px;
  margin-bottom: 8px;
  border-bottom-color: rgba(211, 188, 142, 0.14);
}

.toc-title {
  font-family: 'Genshin', serif;
  font-size: 18px;
  color: #4d4f53;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(211, 188, 142, 0.65);
  flex: 1;
}

.toc-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: rgba(211, 188, 142, 0.14);
  border: 1px solid rgba(211, 188, 142, 0.35);
  color: #d3bc8e;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  transition:
    transform 0.18s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.toc-toggle-btn:hover {
  background-color: rgba(211, 188, 142, 0.24);
  border-color: rgba(211, 188, 142, 0.5);
  color: #c9af77;
  transform: translateY(-1px);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 6px;
}

.toc-link {
  font-family: 'Common', sans-serif;
  font-size: 14px;
  color: #4d4f53;
  text-decoration: none;
  display: block;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.25s ease;
  line-height: 1.5;
}

.toc-link:hover {
  background-color: rgba(211, 188, 142, 0.15);
  color: #d3bc8e;
}

.toc-link.active {
  background-color: rgba(211, 188, 142, 0.25);
  color: #d3bc8e;
  font-weight: bold;
}

.toc-link.level-2 {
  font-size: 15px;
  font-weight: bold;
}

.toc-link.level-3 {
  padding-left: 20px;
  font-size: 14px;
}

.toc-link.level-4 {
  padding-left: 34px;
  font-size: 13px;
}

.toc-reopen-btn {
  position: fixed;
  top: calc(var(--mirror-notice-height, 0px) + 88px);
  right: 16px;
  width: 30px;
  height: 34px;
  border-radius: 6px;
  background-color: rgba(211, 188, 142, 0.14);
  border: 1px solid rgba(211, 188, 142, 0.35);
  color: #d3bc8e;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  z-index: 920;
  transition: background-color 0.2s ease;
}

.toc-reopen-btn:hover {
  background-color: rgba(211, 188, 142, 0.2);
}

:global(.toc-mobile-fab) {
  position: fixed;
  right: 16px;
  bottom: 20px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 1px solid rgba(211, 188, 142, 0.5);
  background: linear-gradient(180deg, #4d4f53 0%, #3f4145 100%);
  color: #e2cfaa;
  font-family: 'Genshin', sans-serif;
  font-size: 13px;
  cursor: pointer;
  z-index: 980;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

:global(.toc-mobile-mask) {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 981;
}

:global(.toc-mobile-sheet) {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: min(72vh, 620px);
  border-radius: 16px 16px 0 0;
  background: #f5f5f5;
  border-top: 1px solid rgba(211, 188, 142, 0.4);
  box-shadow: 0 -8px 26px rgba(0, 0, 0, 0.28);
  padding: 0 12px 20px;
  z-index: 982;
  overflow-y: auto;
  overscroll-behavior: contain;
}

:global(.toc-mobile-header) {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -12px -12px 20px;
  padding: 12px 14px 10px;
  background: #f5f5f5;
  border-bottom: 1px solid rgba(211, 188, 142, 0.24);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

:global(.toc-mobile-title) {
  margin: 0;
  color: #4d4f53;
  font-family: 'Genshin', serif;
  font-size: 17px;
}

:global(.toc-mobile-close) {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid rgba(211, 188, 142, 0.45);
  background: #fff;
  color: #9c8251;
  cursor: pointer;
  font-size: 14px;
}

:global(.toc-mobile-list) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:global(.toc-mobile-item) {
  margin-bottom: 4px;
}

:global(.toc-mobile-link) {
  display: block;
  text-decoration: none;
  color: #4d4f53;
  font-family: 'Common', sans-serif;
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

:global(.toc-mobile-link.active) {
  background: rgba(211, 188, 142, 0.22);
  color: #8f6d36;
  font-weight: 700;
}

:global(.toc-mobile-link.level-2) {
  font-size: 15px;
  font-weight: 700;
}

:global(.toc-mobile-link.level-3) {
  font-size: 14px;
  padding-left: 20px;
}

:global(.toc-mobile-link.level-4) {
  font-size: 13px;
  padding-left: 32px;
}

:global(.toc-mobile-fade-enter-active),
:global(.toc-mobile-fade-leave-active) {
  transition: opacity 0.22s ease;
}

:global(.toc-mobile-fade-enter-from),
:global(.toc-mobile-fade-leave-to) {
  opacity: 0;
}

:global(.toc-mobile-sheet-enter-active),
:global(.toc-mobile-sheet-leave-active) {
  transition:
    transform 0.24s ease,
    opacity 0.24s ease;
}

:global(.toc-mobile-sheet-enter-from),
:global(.toc-mobile-sheet-leave-to) {
  transform: translateY(100%);
  opacity: 0.88;
}

@media (max-width: 1400px) {
  .toc-sidebar {
    width: 236px;
    right: 12px;
  }

  .toc-reopen-btn {
    right: 12px;
  }

  .toc-link.level-2 {
    font-size: 14px;
  }

  .toc-link.level-3 {
    font-size: 13px;
  }

  .toc-link.level-4 {
    font-size: 12px;
  }
}

@media (max-width: 1012px) {
  .toc-sidebar,
  .toc-reopen-btn {
    display: none;
  }
}
</style>
