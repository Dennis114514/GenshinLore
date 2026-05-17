import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const tailwindPlugin = tailwindcss() as unknown as NonNullable<
  Parameters<typeof defineConfig>[0]['vite']
>['plugins']

const mirrorCommit =
  process.env.GITHUB_SHA?.slice(0, 7) ||
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) ||
  (() => {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    } catch {
      return 'local'
    }
  })()

const configDir = dirname(fileURLToPath(import.meta.url))
const distDir = join(configDir, 'dist')

function createStaticFallbackPages() {
  if (!existsSync(distDir)) return

  for (const filename of readdirSync(distDir)) {
    const sourcePath = join(distDir, filename)
    if (!statSync(sourcePath).isFile() || !filename.endsWith('.html')) continue
    if (filename === 'index.html' || filename === '404.html') continue

    const routeName = filename.slice(0, -5)
    const routeDir = join(distDir, routeName)
    mkdirSync(routeDir, { recursive: true })
    copyFileSync(sourcePath, join(routeDir, 'index.html'))
  }
}

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
      md.renderer.rules.strong_open = () =>
        '<strong class="red-text">'
      md.renderer.rules.strong_close = () => '</strong>'

      const defaultLinkRender =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, _env, self) {
          return self.renderToken(tokens, idx, options)
        }

      md.renderer.rules.link_open = function (
        tokens,
        idx,
        options,
        env,
        self,
      ) {
        const token = tokens[idx]
        const href = token.attrGet('href')
        if (href && /^https?:\/\//.test(href)) {
          token.attrSet('target', '_blank')
          token.attrSet('rel', 'noopener noreferrer')
        }
        return defaultLinkRender(tokens, idx, options, env, self)
      }
    },
  },

  sitemap: {
    hostname: 'https://genshinlore.cn/',
  },

  buildEnd: createStaticFallbackPages,

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
    define: {
      __MIRROR_COMMIT__: JSON.stringify(mirrorCommit),
    },
    plugins: [
      tailwindPlugin,
    ],
  },
})
