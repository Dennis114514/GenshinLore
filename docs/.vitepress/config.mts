import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import { execSync } from 'node:child_process'
import type { ConfigEnv, Plugin, UserConfig } from 'vite'

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
const rawFederationPlugin = federation({
  name: 'genshinloreDocs',
  filename: 'editorRemoteEntry.js',
  exposes: {
    './widgets': './docs/.vitepress/theme/client/federation/widgetRegistry.ts',
    './widgetStyles': './docs/.vitepress/theme/client/federation/stylesEntry.ts',
  },
  shared: ['vue'],
}) as unknown as Plugin | Plugin[]

function clientOnlyPlugin(plugin: Plugin): Plugin {
  const originalApply = plugin.apply
  return {
    ...plugin,
    apply(config: UserConfig, env: ConfigEnv) {
      if (env.isSsrBuild) {
        return false
      }
      if (typeof originalApply === 'function') {
        return originalApply(config, env)
      }
      if (originalApply) {
        return originalApply
      }
      return true
    },
  }
}

const federationPlugin = Array.isArray(rawFederationPlugin)
  ? rawFederationPlugin.map(clientOnlyPlugin)
  : clientOnlyPlugin(rawFederationPlugin)

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
      ...(Array.isArray(federationPlugin) ? federationPlugin : [federationPlugin]),
    ],
    server: {
      cors: true,
      proxy: {
        '/editor': {
          target: 'http://127.0.0.1:5174',
          changeOrigin: true,
        },
      },
    },
    define: {
      __MIRROR_COMMIT__: JSON.stringify(shortCommit),
    },
  },
})
