export type EasterEggEntry = {
  id: string
  title: string
  name: string
  time: string
  facts: string
  isItTrue: boolean
}

// 应当避免在facts内部写dom元素
export const easterEggs: EasterEggEntry[] = [
  {
    id: '1',
    title: '标题',
    name: '作者',
    time: '2026-05-01',
    facts: '这里是待填充的内容。',
    isItTrue: true,
  },
  {
    id: '2',
    title: '标题',
    name: '作者',
    time: '2026-05-01',
    facts: '这里是待填充的内容。',
    isItTrue: false,
  },
]
