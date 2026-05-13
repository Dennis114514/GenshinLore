<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/core'
import type { BlockActionEvent } from '../extensions/blockActionDecorations'
import { WIDGET_DEFINITIONS, getWidgetDefinition, type WidgetName } from '../widgetSchemas'

const props = defineProps<{
  editor: Editor | null | undefined
}>()

const isVisible = ref(false)
const position = ref({ x: 0, y: 0 })
const nodePos = ref(0)
const nodeTo = ref(0)

const menuStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  zIndex: 1100,
}))

function hide() {
  isVisible.value = false
}

function open(event: BlockActionEvent) {
  position.value = event.position
  nodePos.value = event.nodePos
  nodeTo.value = event.nodeTo
  isVisible.value = true
}

function applyBlockFormat(type: 'paragraph' | 'h2' | 'h3' | 'bullet' | 'ordered' | 'quote' | 'code') {
  const editor = props.editor
  if (!editor) return

  const contentMap = {
    paragraph: { type: 'paragraph' },
    h2: { type: 'heading', attrs: { level: 2 } },
    h3: { type: 'heading', attrs: { level: 3 } },
    bullet: {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph' }],
        },
      ],
    },
    ordered: {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph' }],
        },
      ],
    },
    quote: {
      type: 'blockquote',
      content: [{ type: 'paragraph' }],
    },
    code: { type: 'codeBlock' },
  }

  editor
    .chain()
    .focus()
    .insertContentAt({ from: nodePos.value, to: nodeTo.value }, contentMap[type])
    .focus(nodePos.value + 1)
    .run()

  hide()
}

function insertWidgetAtTarget(name: WidgetName) {
  const editor = props.editor
  if (!editor) return

  const definition = getWidgetDefinition(name)
  const isNested = definition.name === 'Timeline'
  const content = isNested
    ? [{ type: 'paragraph', content: [{ type: 'text', text: '在这里继续输入或插入内容块。' }] }]
    : undefined

  editor
    .chain()
    .focus()
    .insertContentAt(
      { from: nodePos.value, to: nodeTo.value },
      {
        type: 'widgetBlock',
        attrs: {
          widgetName: definition.name,
          payload: { ...definition.payload },
        },
        content,
      },
    )
    .focus(nodePos.value + 1)
    .run()

  hide()
}

defineExpose({ open, hide })
</script>

<template>
  <teleport to="body">
    <div v-if="isVisible" class="block-menu-backdrop" @mousedown="hide" />
    <div v-if="isVisible" class="quick-insert-menu" :style="menuStyle" @mousedown.stop>
      <div class="block-action-title">快捷插入</div>
      <div class="block-action-grid">
        <button class="block-action-btn" @click="applyBlockFormat('paragraph')">正文</button>
        <button class="block-action-btn" @click="applyBlockFormat('h2')">标题 H2</button>
        <button class="block-action-btn" @click="applyBlockFormat('h3')">标题 H3</button>
        <button class="block-action-btn" @click="applyBlockFormat('bullet')">无序列表</button>
        <button class="block-action-btn" @click="applyBlockFormat('ordered')">有序列表</button>
        <button class="block-action-btn" @click="applyBlockFormat('quote')">引用</button>
        <button class="block-action-btn" @click="applyBlockFormat('code')">代码块</button>
      </div>

      <div class="block-action-line" />
      <div class="block-action-title">自定义组件</div>
      <div class="block-action-grid">
        <button
          v-for="widget in WIDGET_DEFINITIONS"
          :key="widget.name"
          class="block-action-btn"
          @click="insertWidgetAtTarget(widget.name)"
        >
          {{ widget.label }}
        </button>
      </div>
    </div>
  </teleport>
</template>
