import type { HeadConfig } from 'vitepress'

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '')
}

export const primarySiteUrl = 'https://genshinlore.cn'
export const siteUrl = normalizeSiteUrl(
  process.env.VITEPRESS_SITE_URL ||
    process.env.SITE_URL ||
    process.env.URL ||
    process.env.CF_PAGES_URL ||
    primarySiteUrl,
)
export const siteTitle = '日月全事'
export const siteDescription =
  '最详尽的原神世界观手册，系统整理原神提瓦特历史、七国剧情、天理、人界、龙族、深渊、魔神与世界观考据内容。'
export const siteImage = `${siteUrl}/img/others/GenshinLore.png`

const siteKeywords =
  '日月全事,原神世界观,原神剧情,提瓦特历史,原神考据,原神七国,原神时间线,天理,深渊,魔神'

type SeoFrontmatter = {
  description?: string
  keywords?: string | string[]
  image?: string
}

export const siteHead: HeadConfig[] = [
  ['link', { rel: 'icon', href: '/favicon.png' }],
  ['link', { rel: 'apple-touch-icon', href: '/img/logo/favicon32x32.png' }],
  ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ['meta', { name: 'keywords', content: siteKeywords }],
  ['meta', { name: 'author', content: '日月全事' }],
  [
    'meta',
    {
      name: 'robots',
      content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    },
  ],
  ['meta', { name: 'theme-color', content: '#15110d' }],
  ['meta', { property: 'og:site_name', content: siteTitle }],
  ['meta', { property: 'og:locale', content: 'zh_CN' }],
  ['meta', { property: 'og:image', content: siteImage }],
  ['meta', { property: 'og:image:alt', content: `${siteTitle} 原神世界观手册` }],
  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:image', content: siteImage }],
]

function normalizePath(path: string) {
  return path === 'index.md'
    ? '/'
    : `/${path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')}`
}

function resolveCanonicalUrl(path: string) {
  return `${siteUrl}${normalizePath(path)}`
}

function resolveImageUrl(image: unknown) {
  if (typeof image !== 'string' || image.length === 0) return siteImage
  if (/^https?:\/\//.test(image)) return image
  return `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
}

function normalizeKeywords(keywords: unknown) {
  if (Array.isArray(keywords)) return keywords.filter(Boolean).join(',')
  if (typeof keywords === 'string') return keywords
  return undefined
}

function resolveSeoFrontmatter(frontmatter: Record<string, unknown> = {}) {
  const seo =
    typeof frontmatter.seo === 'object' && frontmatter.seo !== null
      ? (frontmatter.seo as SeoFrontmatter)
      : undefined

  return {
    description:
      seo?.description ??
      (typeof frontmatter.description === 'string' ? frontmatter.description : undefined),
    keywords: normalizeKeywords(seo?.keywords ?? frontmatter.keywords),
    image: resolveImageUrl(seo?.image ?? frontmatter.image),
  }
}

function createStructuredData(
  title: string,
  description: string,
  url: string,
  image: string,
  type: string,
) {
  const webpage = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    name: title,
    headline: title,
    description,
    url,
    image,
    inLanguage: 'zh-CN',
    mainEntityOfPage: url,
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.png`,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: siteTitle,
      url: siteUrl,
      description: siteDescription,
    },
  }

  return JSON.stringify(webpage)
}

export function transformSeoHead({
  page,
  title,
  description,
  pageData,
}: {
  page: string
  title: string
  description: string
  pageData?: {
    frontmatter?: Record<string, unknown>
  }
}) {
  const seo = resolveSeoFrontmatter(pageData?.frontmatter)
  const canonicalUrl = resolveCanonicalUrl(page)
  const resolvedTitle = title || siteTitle
  const resolvedDescription = seo.description || description || siteDescription
  const resolvedImage = seo.image
  const pageType = page === 'index.md' ? 'website' : 'article'
  const resolvedKeywords = seo.keywords ? `${siteKeywords},${seo.keywords}` : siteKeywords

  return [
    ['meta', { name: 'description', content: resolvedDescription }],
    ['meta', { name: 'keywords', content: resolvedKeywords }],
    ['link', { rel: 'canonical', href: canonicalUrl }],
    ['meta', { property: 'og:type', content: pageType }],
    ['meta', { property: 'og:title', content: resolvedTitle }],
    ['meta', { property: 'og:description', content: resolvedDescription }],
    ['meta', { property: 'og:url', content: canonicalUrl }],
    ['meta', { property: 'og:image', content: resolvedImage }],
    ['meta', { property: 'og:image:alt', content: `${resolvedTitle} 页面预览图` }],
    ['meta', { name: 'twitter:title', content: resolvedTitle }],
    ['meta', { name: 'twitter:description', content: resolvedDescription }],
    ['meta', { name: 'twitter:image', content: resolvedImage }],
    [
      'script',
      { type: 'application/ld+json' },
      createStructuredData(
        resolvedTitle,
        resolvedDescription,
        canonicalUrl,
        resolvedImage,
        pageType,
      ),
    ],
  ] satisfies HeadConfig[]
}
