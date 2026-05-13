<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed, h, onMounted, ref, watch } from 'vue'
import type { Component, VNode } from 'vue'
import { NodeSelection } from '@tiptap/pm/state'
import type { WidgetName } from './widgetSchemas'
import { loadRemoteWidgets } from './widgetRemote'

type Payload = Record<string, string | number>

interface AssistField {
  key: string
  label: string
  fallback: string
  singleLine?: boolean
}

const props = defineProps(nodeViewProps)
const remoteComponent = ref<Component | null>(null)
const loadError = ref('')
const loading = ref(true)

const widgetName = computed(() => props.node.attrs.widgetName as WidgetName)
const payload = computed(() => (props.node.attrs.payload ?? {}) as Payload)
const NESTED_WIDGETS = new Set<WidgetName>(['Timeline'])
const isNestedWidget = computed(() => NESTED_WIDGETS.has(widgetName.value))

function getWidgetPos() {
  const pos = props.getPos?.()
  if (typeof pos !== 'number') {
    return null
  }
  return pos
}

function selectWidgetNode() {
  const pos = getWidgetPos()
  if (pos === null) {
    return
  }
  const selection = NodeSelection.create(props.editor.state.doc, pos)
  props.editor.view.dispatch(props.editor.state.tr.setSelection(selection))
}

function handleWidgetHandleMouseDown() {
  selectWidgetNode()
}

function handleWidgetHandleClick(event: MouseEvent) {
  const pos = getWidgetPos()
  if (pos === null) {
    return
  }

  selectWidgetNode()
  const nodeTo = pos + props.node.nodeSize
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  window.dispatchEvent(
    new CustomEvent('genshinlore-widget-handle-click', {
      detail: {
        position: { x: rect.right + 10, y: rect.top },
        nodePos: pos,
        nodeTo,
      },
    }),
  )
}

function updateField(key: string, rawValue: string) {
  const normalized = rawValue.trim()
  const nextPayload = {
    ...payload.value,
    [key]: key === 'size' ? Number(normalized || 0) : normalized,
  }
  props.updateAttributes({ payload: nextPayload })
}

function editableTextNode(
  key: string,
  fallback: string,
  options?: { tag?: 'span' | 'p' | 'div'; className?: string; singleLine?: boolean },
) {
  const tag = options?.tag ?? 'span'

  return h(
    tag,
    {
      contenteditable: 'true',
      spellcheck: 'false',
      class: ['widget-wysiwyg-edit', options?.className ?? ''],
      onBlur: (event: FocusEvent) => {
        const target = event.target as HTMLElement
        updateField(key, target.innerText)
      },
      onKeydown: (event: KeyboardEvent) => {
        if (options?.singleLine && event.key === 'Enter') {
          event.preventDefault()
          ;(event.target as HTMLElement).blur()
        }
      },
    },
    String(payload.value[key] ?? fallback),
  )
}

const defaultSlotText = computed(() => {
  const preset: Partial<Record<WidgetName, string>> = {
    Intro: '这里是导语文本，支持所见即所得直接编辑。',
    MidTitle: '章节中标题',
    QuoteBlock: '点击我可预览引用块效果。',
    SecondaryQuote: '次要说明文本。',
    Timeline: '时间线容器内的 markdown 标题会自动识别为时间线节点。',
  }

  return preset[widgetName.value] ?? '在这里输入内容'
})

const slotRenderers = computed(() => {
  if (isNestedWidget.value) {
    return {}
  }

  const slots: Record<string, (() => VNode) | undefined> = {
    default: () =>
      editableTextNode('text', defaultSlotText.value, {
        tag: 'p',
        className: 'widget-default-text',
      }),
  }

  return slots
})

const renderProps = computed(() => {
  const p = payload.value
  if (widgetName.value === 'Footnote') {
    return {
      n: String(p.n ?? '1'),
      text: String(p.text ?? ''),
    }
  }
  if (widgetName.value === 'Spacer') {
    return { size: Number(p.size ?? 24) }
  }
  return {}
})

const assistFields = computed<AssistField[]>(() => {
  if (widgetName.value === 'Footnote') {
    return [
      { key: 'n', label: '脚注编号', fallback: '1', singleLine: true },
      { key: 'text', label: '脚注文本', fallback: '这里输入脚注内容' },
    ]
  }
  if (widgetName.value === 'Spacer') {
    return [{ key: 'size', label: '留白高度', fallback: '24', singleLine: true }]
  }
  return []
})

async function resolveRemoteComponent() {
  loading.value = true
  loadError.value = ''
  remoteComponent.value = null

  try {
    const registry = await loadRemoteWidgets()
    const target = registry[widgetName.value]
    if (!target) {
      throw new Error(`远程组件不存在: ${widgetName.value}`)
    }
    remoteComponent.value = target
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '组件加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(resolveRemoteComponent)

watch(
  () => widgetName.value,
  () => {
    void resolveRemoteComponent()
  },
)
</script>

<template>
  <NodeViewWrapper class="widget-node-view" data-widget-block="true">
    <button
      class="block-drag-handle block-drag-handle-widget-inline"
      type="button"
      data-drag-handle="true"
      contenteditable="false"
      draggable="true"
      @mousedown="handleWidgetHandleMouseDown"
      @click.prevent.stop="handleWidgetHandleClick"
    >
      <span>⋮⋮</span>
    </button>

    <div v-if="loading" class="widget-inline-note">正在加载 {{ widgetName }}...</div>
    <div v-else-if="loadError" class="widget-inline-error">{{ loadError }}</div>
    <component :is="remoteComponent" v-else-if="remoteComponent" v-bind="renderProps">
      <template v-if="isNestedWidget">
        <NodeViewContent class="widget-content-slot" />
      </template>
      <template v-for="(slotRenderer, slotName) in slotRenderers" :key="slotName" #[slotName]>
        <component :is="slotRenderer" />
      </template>
    </component>

    <div v-if="assistFields.length" class="widget-inline-meta">
      <span v-for="field in assistFields" :key="field.key" class="widget-meta-item">
        <span class="widget-meta-label">{{ field.label }}:</span>
        <span
          class="widget-wysiwyg-edit widget-meta-editor"
          contenteditable="true"
          spellcheck="false"
          @keydown.enter.prevent="field.singleLine ? ($event.target as HTMLSpanElement).blur() : undefined"
          @blur="updateField(field.key, ($event.target as HTMLSpanElement).innerText)"
        >
          {{ payload[field.key] ?? field.fallback }}
        </span>
      </span>
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
.widget-node-view {
  margin: 12px 0;
  position: relative;
}

.widget-inline-note,
.widget-inline-error {
  font-size: 12px;
  color: #8a7760;
  margin: 4px 0;
}

.widget-inline-error {
  color: #a83737;
}

.widget-wysiwyg-edit {
  outline: none;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.widget-wysiwyg-edit:hover {
  background: rgba(211, 188, 142, 0.12);
}

.widget-wysiwyg-edit:focus {
  background: rgba(211, 188, 142, 0.2);
}

.widget-default-text {
  margin: 0;
}

.widget-content-slot {
  min-height: 28px;
  padding: 4px 0;
}

.widget-content-slot :deep(.ProseMirror) {
  outline: none;
}

.widget-inline-meta {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 11px;
  color: #8a7760;
}

.widget-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.widget-meta-label {
  opacity: 0.85;
}

.widget-meta-editor {
  font-size: 12px;
  color: #4d4f53;
  padding: 1px 3px;
}
</style>
