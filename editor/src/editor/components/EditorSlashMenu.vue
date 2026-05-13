<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { Editor } from '@tiptap/core'
import { slashCommandKey, type SlashCommandState } from '../extensions/slashCommand'
import { WIDGET_DEFINITIONS, type WidgetName } from '../widgetSchemas'

interface SlashMenuItem {
  id: string
  title: string
  description: string
  icon: string
  keywords: string[]
  action: (editor: Editor) => void
}

interface SlashMenuGroup {
  title: string
  items: SlashMenuItem[]
}

const props = defineProps<{
  editor: Editor | null | undefined
  insertWidget: (name: WidgetName) => void
}>()

const isVisible = ref(false)
const position = ref({ x: 0, y: 0 })
const query = ref('')
const selectedIndex = ref(0)
const menuRef = ref<HTMLElement | null>(null)

const baseGroups = computed<SlashMenuGroup[]>(() => [
  {
    title: '基础块',
    items: [
      {
        id: 'paragraph',
        title: '正文',
        description: '普通段落文本',
        icon: '¶',
        keywords: ['p', 'paragraph', '正文'],
        action: (editor) => {
          editor.chain().focus().setParagraph().run()
        },
      },
      {
        id: 'heading2',
        title: '标题 H2',
        description: '章节标题',
        icon: 'H2',
        keywords: ['h2', 'heading', '标题'],
        action: (editor) => {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        },
      },
      {
        id: 'heading3',
        title: '标题 H3',
        description: '小节标题',
        icon: 'H3',
        keywords: ['h3', 'heading', '标题'],
        action: (editor) => {
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        },
      },
      {
        id: 'quote',
        title: '引用',
        description: '引用内容块',
        icon: '❝',
        keywords: ['quote', 'blockquote', '引用'],
        action: (editor) => {
          editor.chain().focus().toggleBlockquote().run()
        },
      },
      {
        id: 'code',
        title: '代码块',
        description: '插入代码块',
        icon: '</>',
        keywords: ['code', '代码'],
        action: (editor) => {
          editor.chain().focus().toggleCodeBlock().run()
        },
      },
    ],
  },
  {
    title: '列表',
    items: [
      {
        id: 'bulletList',
        title: '无序列表',
        description: '项目符号列表',
        icon: '•',
        keywords: ['list', 'ul', 'bullet', '列表'],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run()
        },
      },
      {
        id: 'orderedList',
        title: '有序列表',
        description: '编号列表',
        icon: '1.',
        keywords: ['list', 'ol', 'ordered', '列表'],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run()
        },
      },
    ],
  },
])

const widgetGroup = computed<SlashMenuGroup>(() => ({
  title: 'GenshinLore 组件',
  items: WIDGET_DEFINITIONS.map((item) => ({
    id: `widget-${item.name}`,
    title: item.label,
    description: item.description,
    icon: 'W',
    keywords: [item.name.toLowerCase(), item.label.toLowerCase(), 'widget', '组件'],
    action: () => {
      props.insertWidget(item.name)
    },
  })),
}))

const commandGroups = computed(() => [...baseGroups.value, widgetGroup.value])

const filteredGroups = computed<SlashMenuGroup[]>(() => {
  const normalizedQuery = query.value.trim().toLowerCase()
  if (!normalizedQuery) {
    return commandGroups.value
  }

  return commandGroups.value
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.title.toLowerCase().includes(normalizedQuery)) {
          return true
        }
        return item.keywords.some((keyword) => keyword.includes(normalizedQuery))
      }),
    }))
    .filter((group) => group.items.length > 0)
})

const flatItems = computed(() => filteredGroups.value.flatMap((group) => group.items))

const menuStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  zIndex: 1002,
}))

function getFlatIndex(group: SlashMenuGroup, itemIndex: number) {
  let index = 0
  for (const candidateGroup of filteredGroups.value) {
    if (candidateGroup === group) {
      return index + itemIndex
    }
    index += candidateGroup.items.length
  }
  return index + itemIndex
}

function executeItem(item: SlashMenuItem) {
  const editor = props.editor
  if (!editor) {
    return
  }

  const pluginState = slashCommandKey.getState(editor.state) as SlashCommandState | undefined
  if (pluginState?.range) {
    editor.chain().focus().deleteRange(pluginState.range).run()
  }

  item.action(editor)
  hide()
}

function activate(state: SlashCommandState) {
  if (!state.decorationPosition) {
    return
  }
  position.value = { x: state.decorationPosition.x, y: state.decorationPosition.y + 4 }
  query.value = state.query
  isVisible.value = true
  selectedIndex.value = 0

  nextTick(() => {
    adjustPosition()
  })
}

function hide() {
  if (!isVisible.value) {
    return
  }

  isVisible.value = false
  query.value = ''
  selectedIndex.value = 0

  const editor = props.editor
  if (!editor) {
    return
  }

  const { tr } = editor.state
  tr.setMeta(slashCommandKey, { deactivate: true })
  editor.view.dispatch(tr)
}

function updateQuery(nextQuery: string) {
  query.value = nextQuery
  selectedIndex.value = 0
}

function adjustPosition() {
  const menuElement = menuRef.value
  if (!menuElement) {
    return
  }

  const rect = menuElement.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const margin = 8
  let { x, y } = position.value

  if (x + rect.width + margin > viewportWidth) {
    x = viewportWidth - rect.width - margin
  }

  if (y + rect.height + margin > viewportHeight) {
    y = y - rect.height - 24
  }

  position.value = {
    x: Math.max(margin, x),
    y: Math.max(margin, y),
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!isVisible.value) {
    return
  }

  const totalCount = flatItems.value.length
  if (totalCount === 0) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % totalCount
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + totalCount) % totalCount
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    const item = flatItems.value[selectedIndex.value]
    if (item) {
      executeItem(item)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    hide()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown, true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown, true)
})

defineExpose({
  activate,
  hide,
  updateQuery,
})
</script>

<template>
  <teleport to="body">
    <div
      v-if="isVisible"
      ref="menuRef"
      class="slash-command-menu"
      :style="menuStyle"
      @mousedown.prevent
    >
      <div v-if="filteredGroups.length" class="slash-command-list">
        <template v-for="group in filteredGroups" :key="group.title">
          <div class="slash-command-group-title">{{ group.title }}</div>
          <button
            v-for="(item, itemIndex) in group.items"
            :key="item.id"
            class="slash-command-item"
            :class="{ active: getFlatIndex(group, itemIndex) === selectedIndex }"
            @click="executeItem(item)"
            @mouseenter="selectedIndex = getFlatIndex(group, itemIndex)"
          >
            <span class="slash-command-item-icon">{{ item.icon }}</span>
            <span class="slash-command-item-content">
              <span class="slash-command-item-title">{{ item.title }}</span>
              <span class="slash-command-item-desc">{{ item.description }}</span>
            </span>
          </button>
        </template>
      </div>
      <div v-else class="slash-command-empty">没有匹配的命令</div>
    </div>

    <div v-if="isVisible" class="slash-command-backdrop" @mousedown="hide" />
  </teleport>
</template>
