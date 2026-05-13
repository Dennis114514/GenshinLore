import { marked } from 'marked'
import TurndownService from 'turndown'

const TAG_CASING: Record<string, string> = {
  timeline: 'Timeline',
  footnote: 'Footnote',
  quoteblock: 'QuoteBlock',
  secondaryquote: 'SecondaryQuote',
  intro: 'Intro',
  midtitle: 'MidTitle',
  space: 'Space',
}


export interface ParsedMd {
  frontmatter: string
  html: string
}

marked.use({
  breaks: true,
  gfm: true,
})

let storedFrontmatter = ''

export function parseMarkdown(raw: string): ParsedMd {
  storedFrontmatter = ''

  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  if (fmMatch) {
    storedFrontmatter = '---\n' + fmMatch[1].trimEnd() + '\n---\n\n'
  }

  const body = fmMatch ? raw.slice(fmMatch[0].length) : raw

  const html = marked.parse(body, {
    async: false,
  }) as string

  return {
    frontmatter: storedFrontmatter,
    html,
  }
}

export function getStoredFrontmatter(): string {
  return storedFrontmatter
}

export function setStoredFrontmatter(fm: string): void {
  storedFrontmatter = fm
}

export function createTurndownService(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    br: '',
    blankReplacement: (_content, node) => {
      if (node.nodeName === 'BR') return '<br>'
      return ''
    },
  })

  td.addRule('preservedTags', {
    filter: (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false
      const tag = (node as HTMLElement).tagName.toLowerCase()
      return tag in TAG_CASING
    },
    replacement: (_content, node) => {
      const el = node as HTMLElement
      const name = TAG_CASING[el.tagName.toLowerCase()]
      const attrs = Array.from(el.attributes)
        .map((a) => `${a.name}="${a.value}"`)
        .join(' ')
      const attrStr = attrs ? ' ' + attrs : ''
      return `<${name}${attrStr}>${el.innerHTML}</${name}>`
    },
  })

  td.addRule('divWithClass', {
    filter: (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false
      const el = node as HTMLElement
      return el.tagName === 'DIV' && el.hasAttribute('class')
    },
    replacement: (content, node) => {
      const el = node as HTMLElement
      const attrs = Array.from(el.attributes)
        .map((a) => `${a.name}="${a.value}"`)
        .join(' ')
      return `<div ${attrs}>\n${content}\n</div>`
    },
  })

  td.addRule('spanWithClass', {
    filter: (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false
      const el = node as HTMLElement
      return el.tagName === 'SPAN' && (el.hasAttribute('class') || el.hasAttribute('style'))
    },
    replacement: (content, node) => {
      const el = node as HTMLElement
      const attrs = Array.from(el.attributes)
        .map((a) => `${a.name}="${a.value}"`)
        .join(' ')
      return `<span ${attrs}>${content}</span>`
    },
  })

  td.keep(['del', 'sup', 'sub'])

  return td
}

export function exportMarkdown(html: string, frontmatter?: string): string {
  const td = createTurndownService()
  let md = td.turndown(html)

  md = md.replace(/\\</g, '<')
  const tagPattern = Object.values(TAG_CASING).join('|')
  md = md.replace(new RegExp(`(</?(?:${tagPattern})[^>]*\\/?>)`, 'g'), '\n$1\n')
  md = md.replace(/\n{3,}/g, '\n\n')
  md = md.replace(/^ +/gm, '')
  md = md.replace(/ +\n/g, '\n')

  const fm = frontmatter ?? storedFrontmatter
  if (fm) {
    md = fm + md
  }

  return md.trim() + '\n'
}
