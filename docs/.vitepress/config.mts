import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'

//const isProd = process.env.NODE_ENV === 'production'

function resolveShortCommit() {
  try {
    return execSync('git rev-parse --short=7 HEAD', { encoding: 'utf8' }).trim()
  }
  catch {
    return 'unknown'
  }
}

const shortCommit = resolveShortCommit()
const tailwindPlugin = tailwindcss() as unknown as NonNullable<
  Parameters<typeof defineConfig>[0]['vite']
>['plugins']

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '日月全事',
  description: '最详尽的原神世界观手册',
  lang: 'zh-CN',
  lastUpdated: true,
  //base: isProd ? '/GenshinLore/' : '/',

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

  sitemap: {
    hostname: 'https://genshinlore.cn/',
  },

  // 国内镜像站备案展示配置（填写备案号即启用显示）
  themeConfig: {
    compliance: {
      icp: {
        number: '',
      },
      mps: {
        number: '',
      },
    },
  },

  vite: {
    plugins: [tailwindPlugin],
    define: {
      __MIRROR_COMMIT__: JSON.stringify(shortCommit),
    },
  },
})
