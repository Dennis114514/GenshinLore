export type WidgetName =
  | 'Footnote'
  | 'Intro'
  | 'MidTitle'
  | 'QuoteBlock'
  | 'SecondaryQuote'
  | 'Spacer'
  | 'Timeline'

export type WidgetPayload = Record<string, string | number>

export interface WidgetDefinition {
  name: WidgetName
  label: string
  description: string
  payload: WidgetPayload
}

export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  {
    name: 'Footnote',
    label: 'Footnote',
    description: '脚注悬浮说明',
    payload: { n: '1', text: '这是脚注内容，可包含链接 [官网](https://genshinlore.cn/)' },
  },
  {
    name: 'Intro',
    label: 'Intro',
    description: '导语强调块',
    payload: { text: '这里是导语文本，支持所见即所得直接编辑。' },
  },
  {
    name: 'MidTitle',
    label: 'MidTitle',
    description: '中分副标题',
    payload: { text: '章节中标题' },
  },
  {
    name: 'QuoteBlock',
    label: 'QuoteBlock',
    description: '点击展开原文的引用块',
    payload: { text: '点击我可预览引用块效果。' },
  },
  {
    name: 'SecondaryQuote',
    label: 'SecondaryQuote',
    description: '次要引用',
    payload: { text: '次要说明文本。' },
  },
  {
    name: 'Spacer',
    label: 'Spacer',
    description: '垂直留白',
    payload: { size: 24 },
  },
  {
    name: 'Timeline',
    label: 'Timeline',
    description: '时间线容器',
    payload: { text: '时间线容器内的 markdown 标题会自动识别为时间线节点。' },
  },
]

export const WIDGET_SET = new Set<WidgetName>(WIDGET_DEFINITIONS.map((item) => item.name))

export function getWidgetDefinition(name: WidgetName): WidgetDefinition {
  return WIDGET_DEFINITIONS.find((item) => item.name === name) ?? WIDGET_DEFINITIONS[0]
}
