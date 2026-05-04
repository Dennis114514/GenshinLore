import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '日月全事',
  description: '最详尽的原神世界观手册',
  lang: 'zh-CN',
  lastUpdated: true,

  head: [
    // 图标
    ['link', { rel: 'icon', href: '/favicon.png' }],
    // 预加载的字体
    [
      'link',
      {
        rel: 'preload',
        href: '/fonts/Khaenriah.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: '',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: '/fonts/genshin.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: '',
      },
    ],
  ],

  // 渲染md文档的自定义配置
  markdown: {},

  vite: {
    plugins: [tailwindcss()],
  },
})
