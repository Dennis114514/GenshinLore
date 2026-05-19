import type { HeadConfig } from 'vitepress'

function normalizeSiteUrl(url: string) {
  return url.replace(/\/+$/, '')
}

export const primarySiteUrl = 'https://genshinlore.cn'
export const mirrorSiteUrls = [
  'https://genshinlore.pages.dev',
  'https://genshinlore.github.io',
  'https://genshinlore.hut.ao',
  'https://genshinlore.makotowu.cn',
]
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

const siteAlternateNames = ['原神世界观手册', 'GenshinLore', '提瓦特世界观手册']
const siteTopics = [
  '原神世界观',
  '提瓦特历史',
  '原神剧情考据',
  '七国历史',
  '天理与人界',
  '龙族与光界',
  '深渊与虚界',
  '魔神战争',
  '原神时间线',
]

const sameAsUrls = [primarySiteUrl, ...mirrorSiteUrls]

const siteKeywords =
  '日月全事,原神世界观,原神剧情,提瓦特历史,原神考据,原神七国,原神时间线,天理,深渊,魔神'

const mainPages = [
  {
    name: '首页导航',
    url: `${siteUrl}/home.html`,
    description: '汇总站点前言、基本设定、提瓦特历史、各国历史、时间线与关于页面。',
  },
  {
    name: '基本设定',
    url: `${siteUrl}/basiclore.html`,
    description: '整理龙族、光界、降临者、天理、人界、魔神、深渊、星空、地脉等核心概念。',
  },
  {
    name: '提瓦特历史',
    url: `${siteUrl}/teyvathis.html`,
    description: '梳理提瓦特早期历史、原初秩序、天幕、月宫、葬火与文明更替。',
  },
  {
    name: '各国历史',
    url: `${siteUrl}/nations.html`,
    description: '汇集蒙德、璃月、稻妻、须弥、枫丹、纳塔、至冬与坎瑞亚的国别史。',
  },
  {
    name: '时间线',
    url: `${siteUrl}/timeline.html`,
    description: '以时代顺序梳理提瓦特与七国重大事件，便于对照剧情节点。',
  },
]

type SeoFrontmatter = {
  description?: string
  keywords?: string | string[]
  image?: string
  summary?: string
  topics?: string[]
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
  [
    'script',
    { type: 'application/ld+json' },
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteTitle,
      alternateName: siteAlternateNames,
      url: siteUrl,
      description: siteDescription,
      inLanguage: 'zh-CN',
      image: siteImage,
      sameAs: sameAsUrls,
      about: siteTopics.map((name) => ({ '@type': 'Thing', name })),
      hasPart: mainPages.map((page) => ({
        '@type': 'WebPage',
        name: page.name,
        url: page.url,
        description: page.description,
      })),
      potentialAction: {
        '@type': 'ReadAction',
        target: mainPages.map((page) => page.url),
      },
      publisher: {
        '@type': 'Organization',
        name: siteTitle,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/favicon.png`,
        },
      },
    }),
  ],
]

function normalizePath(path: string) {
  return path === 'index.md'
    ? '/'
    : `/${path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')}`
}

function resolveCanonicalUrl(path: string) {
  return `${primarySiteUrl}${normalizePath(path)}`
}

function normalizePathFromUrl(url: string) {
  try {
    return new URL(url).pathname
  } catch {
    return '/'
  }
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
    summary: typeof seo?.summary === 'string' ? seo.summary : undefined,
    topics: Array.isArray(seo?.topics) ? seo.topics.filter(Boolean) : undefined,
  }
}

function createStructuredData(
  title: string,
  description: string,
  url: string,
  image: string,
  type: string,
  summary?: string,
  topics?: string[],
) {
  const isArticle = type === 'article'
  const aboutTopics = [...siteTopics, ...(topics ?? [])]
  const webpage = {
    '@context': 'https://schema.org',
    '@type': isArticle ? 'Article' : 'WebPage',
    '@id': `${url}#${isArticle ? 'article' : 'webpage'}`,
    name: title,
    headline: title,
    description,
    abstract: summary ?? description,
    url,
    image,
    inLanguage: 'zh-CN',
    mainEntityOfPage: url,
    keywords: siteKeywords,
    sameAs: sameAsUrls.map((baseUrl) => `${baseUrl}${normalizePathFromUrl(url)}`),
    about: aboutTopics.map((name) => ({ '@type': 'Thing', name })),
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
      '@id': `${siteUrl}/#website`,
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
  const resolvedSummary = seo.summary
  const resolvedTopics = seo.topics
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
        resolvedSummary,
        resolvedTopics,
      ),
    ],
  ] satisfies HeadConfig[]
}
