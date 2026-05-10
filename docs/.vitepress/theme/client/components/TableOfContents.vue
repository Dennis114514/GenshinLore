<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { Header } from 'vitepress'
import useIsMobile from '../composables/isMobile'

const { page } = useData()
const isMobile = useIsMobile()

const collapsed = ref(false)
const activeId = ref('')

interface TocItem {
  id: string
  text: string
  level: number
}

function flattenHeaders(headers: Header[]): TocItem[] {
  const items: TocItem[] = []
  for (const h of headers) {
    if (h.level === 2) {
      items.push({ id: h.slug, text: h.title, level: 1 })
      if (h.children) {
        for (const child of h.children) {
          if (child.level === 3) {
            items.push({ id: child.slug, text: child.title, level: 2 })
          }
        }
      }
    }
  }
  return items
}

const tocItems = computed(() => flattenHeaders(page.value.headers ?? []))
const hasContent = computed(() => tocItems.value.length > 0)
const isVisible = computed(() => hasContent.value && !isMobile.value)

function handleClick(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 100
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
  activeId.value = id
}

function updateActive() {
  let current = ''
  let minDist = Infinity
  for (const item of tocItems.value) {
    const el = document.getElementById(item.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= 100 && rect.bottom >= 0) {
      const dist = Math.abs(rect.top - 100)
      if (dist < minDist) {
        minDist = dist
        current = item.id
      }
    }
  }
  if (!current && tocItems.value.length > 0) {
    current = tocItems.value[0].id
  }
  activeId.value = current
}

onMounted(() => {
  nextTick(() => {
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
})
</script>

<template>
  <aside v-if="isVisible" class="toc-sidebar">
    <h3 class="toc-title">
      目录导航
      <button
        class="toc-toggle-btn"
        :class="{ rotated: !collapsed }"
        @click="collapsed = !collapsed"
      >
        ↑
      </button>
    </h3>
    <ul class="toc-list" :class="{ collapsed }">
      <li v-for="item in tocItems" :key="item.id" class="toc-item">
        <a
          :href="'#' + item.id"
          class="toc-link"
          :class="[`level-${item.level}`, { active: activeId === item.id }]"
          @click.prevent="handleClick(item.id)"
          >{{ item.text }}</a
        >
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.toc-sidebar {
  position: fixed;
  right: 20px;
  top: 100px;
  width: 250px;
  max-height: calc(100vh - 140px);
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 20px;
  overflow-y: auto;
  z-index: 900;
  border: 1px solid #e8e8e8;
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

.toc-title {
  font-family: 'Genshin', serif;
  font-size: 18px;
  color: #4d4f53;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #d3bc8e;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toc-toggle-btn {
  background: none;
  border: none;
  color: #d3bc8e;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  transform: rotate(0deg);
}

.toc-toggle-btn:hover {
  background-color: rgba(211, 188, 142, 0.2);
}

.toc-toggle-btn.rotated {
  transform: rotate(180deg);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  transition:
    opacity 0.3s ease,
    max-height 0.3s ease;
  opacity: 1;
  max-height: none;
  overflow: hidden;
}

.toc-list.collapsed {
  opacity: 0;
  max-height: 0;
}

.toc-item {
  margin-bottom: 8px;
}

.toc-link {
  font-family: 'Common', sans-serif;
  font-size: 14px;
  color: #4d4f53;
  text-decoration: none;
  display: block;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
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

.toc-link.level-1 {
  font-size: 15px;
  font-weight: bold;
  color: #4d4f53;
}

.toc-link.level-2 {
  padding-left: 20px;
  font-size: 14px;
}

.toc-link.level-3 {
  padding-left: 35px;
  font-size: 13px;
}

@media (max-width: 1400px) {
  .toc-sidebar {
    width: 220px;
    right: 10px;
  }

  .toc-link {
    font-size: 13px;
  }

  .toc-link.level-1 {
    font-size: 14px;
  }

  .toc-link.level-2 {
    font-size: 13px;
  }

  .toc-link.level-3 {
    font-size: 12px;
  }
}

@media (max-width: 1012px) {
  .toc-sidebar {
    display: none;
  }
}
</style>
