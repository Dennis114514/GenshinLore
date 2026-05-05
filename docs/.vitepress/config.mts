import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

const isProd = process.env.NODE_ENV === 'production'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '日月全事',
  description: '最详尽的原神世界观手册',
  lang: 'zh-CN',
  lastUpdated: true,
  base: isProd ? '/GenshinLore/' : '/',

  head: [
    // 图标
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],

  // 渲染md文档的自定义配置
  markdown: {
    headers: true,
    config: (md) => {
      md.renderer.rules.strong_open = () => '<span class="red-text">'
      md.renderer.rules.strong_close = () => '</span>'
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
