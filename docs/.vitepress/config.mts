import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  mirrorSiteUrls,
  primarySiteUrl,
  siteDescription,
  siteHead,
  siteTitle,
  siteUrl,
  transformSeoHead,
} from './seo.mjs'

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
const docsDir = join(configDir, '..')
const distDir = join(configDir, 'dist')
const skippedMarkdownDirs = new Set(['.vitepress', 'public'])

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

function createRobotsTxt() {
  if (!existsSync(distDir)) return

  const isPrimarySite = siteUrl === primarySiteUrl
  const sitemapUrls = isPrimarySite ? [siteUrl, ...mirrorSiteUrls] : [siteUrl, primarySiteUrl]
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    `Host: ${new URL(siteUrl).host}`,
    ...sitemapUrls.map((url) => `Sitemap: ${url}/sitemap.xml`),
    '',
  ].join('\n')

  writeFileSync(join(distDir, 'robots.txt'), robotsTxt, 'utf8')
}

function collectMarkdownFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((filename) => {
    if (skippedMarkdownDirs.has(filename)) return []

    const filePath = join(directory, filename)
    const fileStat = statSync(filePath)

    if (fileStat.isDirectory()) return collectMarkdownFiles(filePath)
    if (fileStat.isFile() && filename.endsWith('.md')) return [filePath]
    return []
  })
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { frontmatter: new Map<string, string>(), body: content }

  const frontmatter = new Map<string, string>()
  const lines = match[1].split(/\r?\n/)

  for (const line of lines) {
    const field = line.match(/^([\w-]+):\s*(.*)$/)
    if (field) frontmatter.set(field[1], field[2].replace(/^['"]|['"]$/g, ''))
  }

  return { frontmatter, body: content.slice(match[0].length) }
}

function createPageUrl(filePath: string) {
  const routePath = relative(docsDir, filePath).split(sep).join('/')
  if (routePath === 'index.md') return `${primarySiteUrl}/`
  return `${primarySiteUrl}/${routePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')}`
}

function extractHeadings(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{2,4})\s+(.+)$/)?.[2]?.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
    .slice(0, 8) as string[]
}

function createLlmsFullTxt() {
  if (!existsSync(distDir)) return

  const pages = collectMarkdownFiles(docsDir)
    .map((filePath) => {
      const { frontmatter, body } = parseFrontmatter(readFileSync(filePath, 'utf8'))
      const title = frontmatter.get('title') || (relative(docsDir, filePath) === 'index.md' ? siteTitle : '')
      const description = frontmatter.get('description') || siteDescription
      const keywords = frontmatter.get('keywords')
      const headings = extractHeadings(body)

      return {
        title,
        description,
        keywords,
        headings,
        url: createPageUrl(filePath),
      }
    })
    .filter((page) => page.title || page.description)
    .sort((left, right) => left.url.localeCompare(right.url, 'zh-CN'))

  const content = [
    '# 日月全事完整 LLM 索引',
    '',
    `> ${siteDescription}`,
    '',
    `主站：${primarySiteUrl}`,
    `镜像站：${mirrorSiteUrls.join('、')}`,
    '规范：主站与镜像站为同一知识源，引用和索引优先使用主站 URL。',
    '',
    '## 页面索引',
    '',
    ...pages.flatMap((page) => [
      `### ${page.title || page.url}`,
      '',
      `- URL：${page.url}`,
      `- 摘要：${page.description}`,
      ...(page.keywords ? [`- 关键词：${page.keywords}`] : []),
      ...(page.headings.length > 0 ? [`- 主要小节：${page.headings.join('；')}`] : []),
      '',
    ]),
  ].join('\n')

  writeFileSync(join(distDir, 'llms-full.txt'), content, 'utf8')
}

function finalizeBuild() {
  createStaticFallbackPages()
  createRobotsTxt()
  createLlmsFullTxt()
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: siteTitle,
  description: siteDescription,
  lang: 'zh-CN',
  lastUpdated: true,
  //base: isProd ? '/GenshinLore/' : '/',

  head: siteHead,

  // 渲染md文档的自定义配置
  markdown: {
    headers: true,
    config: (md) => {
      md.renderer.rules.strong_open = () => '<strong class="red-text">'
      md.renderer.rules.strong_close = () => '</strong>'

      const defaultLinkRender =
        md.renderer.rules.link_open ||
        function (tokens, idx, options, _env, self) {
          return self.renderToken(tokens, idx, options)
        }

      md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
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
    hostname: `${siteUrl}/`,
  },

  transformHead: transformSeoHead,

  buildEnd: finalizeBuild,

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
    plugins: [tailwindPlugin],
  },
})
