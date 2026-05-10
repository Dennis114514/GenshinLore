<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { EULA_MARKDOWN } from '../../data/eulaContent'
import { getCookie, setCookie } from '../core/cookies'

const API_URL = 'https://genshinlore.cn/useragreementversion.json'
const COOKIE_NAME = 'user_agreement_version'

const visible = ref(false)
const currentVersion = ref<number | null>(null)

// --- Markdown → HTML (与旧站逻辑一致) ---
function markdownToHtml(md: string): string {
  let html = md

  // 转义原始尖括号
  html = html.replace(/<([^>\n]+)>/g, '&lt;$1&gt;')

  // 代码块
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // 引用块
  html = html.replace(/(^>\s+.*$\n?)+/gm, (match) => {
    const content = match.replace(/^>\s+/gm, '').replace(/\n/g, '<br>')
    return '<blockquote>' + content + '</blockquote>'
  })

  // 标题
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')

  // 列表项
  html = html.replace(/^-\s+(.*$)/gm, '<li>$1</li>')

  // 段落
  const paragraphs = html.split(/\n\n+/)
  html = paragraphs
    .map((p) => {
      if (
        p.startsWith('<h') ||
        p.startsWith('<li>') ||
        p.startsWith('<pre>') ||
        p.startsWith('<blockquote>')
      ) {
        return p
      }
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>'
    })
    .join('')

  // 将连续的 li 包装在 ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

  return html
}

const renderedHtml = computed(() => markdownToHtml(EULA_MARKDOWN))

// --- 版本检查 ---
async function checkVersion() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    currentVersion.value = data.version

    const agreed = getCookie(COOKIE_NAME)
    const agreedVersion = agreed ? parseInt(agreed, 10) : null

    if (agreedVersion === null || agreedVersion !== currentVersion.value) {
      visible.value = true
    }
  } catch (e) {
    console.error('获取用户协议版本失败:', e)
  }
}

// --- 按钮处理 ---
function handleAgree() {
  if (currentVersion.value !== null) {
    setCookie(COOKIE_NAME, currentVersion.value.toString())
  }
  visible.value = false
}

function handleDecline() {
  window.open('', '_self')?.close()
  window.location.href = 'about:blank'
}

onMounted(() => {
  checkVersion()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-9999 flex items-center justify-center bg-black/50"
      @click.self="() => {}"
    >
      <div
        class="relative flex flex-col w-full max-w-3xl max-h-[85vh] mx-4 bg-white rounded-lg shadow-2xl"
      >
        <!-- 标题栏 -->
        <div class="shrink-0 px-6 py-4 border-b border-gray-200">
          <h2 class="font-['Genshin',serif] text-2xl text-[#4d4f53] m-0">用户协议</h2>
        </div>

        <!-- 协议正文 -->
        <div class="grow overflow-y-auto px-6 py-4 eula-content" v-html="renderedHtml"></div>

        <!-- 底部按钮 -->
        <div
          class="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
        >
          <button
            class="px-5 py-2 text-sm border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-100 transition-colors"
            @click="handleDecline"
          >
            不同意
          </button>
          <button
            class="px-5 py-2 text-sm rounded-md text-white bg-[#D3BC8E] hover:bg-[#c4a87a] transition-colors border-0"
            @click="handleAgree"
          >
            同意
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* 协议正文样式（非 scoped，因为内容由 v-html 动态注入） */
.eula-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.8;
  color: #4d4f53;
}
.eula-content h1 {
  font-size: 1.8em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin: 24px 0 16px;
  font-weight: 600;
}
.eula-content h2 {
  font-size: 1.4em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
  margin: 24px 0 16px;
  font-weight: 600;
}
.eula-content h3 {
  font-size: 1.15em;
  margin: 20px 0 12px;
  font-weight: 600;
}
.eula-content p {
  margin-bottom: 14px;
}
.eula-content a {
  color: #0366d6;
  text-decoration: none;
}
.eula-content a:hover {
  text-decoration: underline;
}
.eula-content strong {
  color: #cc0000;
  font-weight: normal;
}
.eula-content blockquote {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  margin: 0 0 14px 0;
  color: #6a737d;
}
.eula-content ul,
.eula-content ol {
  padding-left: 2em;
  margin-bottom: 14px;
}
.eula-content li {
  margin-bottom: 0.25em;
}
.eula-content pre {
  background-color: #f6f8fa;
  padding: 14px;
  overflow: auto;
  border-radius: 6px;
  margin-bottom: 14px;
}
.eula-content pre code {
  background-color: transparent;
  padding: 0;
}
.eula-content code {
  background-color: rgba(27, 31, 35, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
}
</style>
