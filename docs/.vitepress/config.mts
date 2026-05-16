import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

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
    plugins: [
      tailwindPlugin,
    ],
  },
})
