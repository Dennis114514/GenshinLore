<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCookie, setCookie } from '../core/cookies'

interface Notice {
  title: string
  description: string
  date: string
  author: string
  id: number
}

const API_URL = 'https://genshinlore.cn/notice.json'
const COOKIE_NAME = 'read_notices'

const visible = ref(false)
const notices = ref<Notice[]>([])

// --- 已读公告管理 ---
function getReadNoticeIds(): number[] {
  const raw = getCookie(COOKIE_NAME)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function markAsRead(noticeId: number) {
  const ids = getReadNoticeIds()
  if (!ids.includes(noticeId)) {
    ids.push(noticeId)
    setCookie(COOKIE_NAME, JSON.stringify(ids))
  }
}

function isRead(noticeId: number): boolean {
  return getReadNoticeIds().includes(noticeId)
}

// --- 数据加载 ---
async function loadNotices() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const all: Notice[] = await res.json()

    const unread = all.filter((n) => !isRead(n.id))
    if (unread.length === 0) return

    unread.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    notices.value = unread
    visible.value = true

    // 标记为已读
    unread.forEach((n) => markAsRead(n.id))
  } catch (e) {
    console.error('获取公告失败:', e)
  }
}

// --- 关闭 ---
function close() {
  visible.value = false
}

onMounted(() => {
  loadNotices()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-9998 flex items-center justify-center bg-black/50"
      @click.self="close"
    >
      <div
        class="relative flex flex-col w-full max-w-lg max-h-[80vh] mx-4 bg-white rounded-lg shadow-2xl"
      >
        <!-- 标题栏 -->
        <div class="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="font-['Genshin',serif] text-2xl text-[#4d4f53] m-0">公告</h2>
          <button
            class="text-2xl leading-none text-gray-400 hover:text-gray-600 transition-colors border-0 bg-transparent cursor-pointer p-0"
            @click="close"
          >
            &times;
          </button>
        </div>

        <!-- 公告列表 -->
        <div class="grow overflow-y-auto px-6 py-4">
          <div v-for="(notice, idx) in notices" :key="notice.id" class="notice-item">
            <h3 class="font-['Genshin',serif] text-lg text-[#4d4f53] m-0 mb-2">
              {{ notice.title }}
            </h3>
            <div class="flex gap-4 mb-2 text-xs text-[#8d8f93]">
              <span>日期：{{ notice.date }}</span>
              <span>来源：{{ notice.author }}</span>
            </div>
            <p class="text-sm text-[#5a5c5f] leading-relaxed m-0 whitespace-pre-wrap">
              {{ notice.description }}
            </p>
            <hr v-if="idx < notices.length - 1" class="my-4 border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
