<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Editor as CoreEditor } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { exportMarkdown, parseMarkdown, setStoredFrontmatter } from './editor/mdBridge'
import { WidgetBlock } from './editor/extensions/widgetBlock'
import { SlashCommandExtension } from './editor/extensions/slashCommand'
import { BlockActionDecorations } from './editor/extensions/blockActionDecorations'
import type { BlockActionEvent } from './editor/extensions/blockActionDecorations'
import { useEditorUi } from './editor/composables/useEditorUi'
import WidgetPanel from './editor/components/WidgetPanel.vue'
import EditorToolbar from './editor/components/EditorToolbar.vue'
import EditorBubbleMenu from './editor/components/EditorBubbleMenu.vue'
import EditorSlashMenu from './editor/components/EditorSlashMenu.vue'
import EditorBlockMenu from './editor/components/EditorBlockMenu.vue'
import EditorQuickInsertMenu from './editor/components/EditorQuickInsertMenu.vue'
import EditorStatusBar from './editor/components/EditorStatusBar.vue'

const slashMenuRef = ref<InstanceType<typeof EditorSlashMenu> | null>(null)
const blockMenuRef = ref<InstanceType<typeof EditorBlockMenu> | null>(null)
const quickInsertMenuRef = ref<InstanceType<typeof EditorQuickInsertMenu> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const previewVisible = ref(false)
const previewHtml = ref('')
let onEditorUpdate = (_instance: CoreEditor) => {}

const editor = useEditor({
  content: `
    <h2>GenshinLore 可视化编辑器</h2>
    <p>输入 <code>/</code> 可快速插入结构块和自定义组件。</p>
  `,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3, 4],
      },
      link: false,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
    }),
    Image,
    Placeholder.configure({
      placeholder: '在这里输入正文，输入 / 触发快速命令。',
      emptyEditorClass: 'is-editor-empty',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right'],
      defaultAlignment: 'left',
    }),
    WidgetBlock,
    SlashCommandExtension.configure({
      onActivate: (state) => slashMenuRef.value?.activate(state),
      onDeactivate: () => slashMenuRef.value?.hide(),
      onQueryChange: (query) => slashMenuRef.value?.updateQuery(query),
    }),
    BlockActionDecorations.configure({
      onDragHandleClick: (event) => {
        quickInsertMenuRef.value?.hide()
        blockMenuRef.value?.open(event)
      },
      onPlusClick: (event) => {
        blockMenuRef.value?.hide()
        quickInsertMenuRef.value?.open(event)
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'genshin-editor-content',
    },
  },
  onUpdate: ({ editor: instance }) => {
    onEditorUpdate(instance)
  },
  onCreate: ({ editor: instance }) => {
    onEditorUpdate(instance)
  },
})

const {
  selectedWidget,
  imageUrl,
  linkInput,
  showLinkInput,
  textStats,
  activeHeading,
  insertWidget,
  applyHeading,
  setTextAlign,
  toggleLink,
  confirmLink,
  insertImage,
  updateTextStats,
} = useEditorUi(editor)

onEditorUpdate = (instance) => {
  updateTextStats(instance)
}

function onHeadingChange(value: 'paragraph' | '2' | '3' | '4') {
  if (value === 'paragraph') {
    applyHeading('paragraph')
    return
  }
  applyHeading(Number(value) as 2 | 3 | 4)
}

function handleEditorAreaMouseDown(event: MouseEvent) {
  if (!editor.value) {
    return
  }

  if (event.target !== event.currentTarget) {
    return
  }

  event.preventDefault()

  const instance = editor.value
  const lastNode = instance.state.doc.lastChild
  const shouldAppendParagraph =
    !lastNode ||
    lastNode.type.name !== 'paragraph' ||
    lastNode.textContent.trim().length > 0

  if (shouldAppendParagraph) {
    instance
      .chain()
      .focus('end')
      .insertContent({ type: 'paragraph' })
      .focus('end')
      .run()
    return
  }

  instance.chain().focus('end').run()
}

function onWidgetHandleOpenMenu(event: Event) {
  const customEvent = event as CustomEvent<BlockActionEvent>
  if (!customEvent.detail) {
    return
  }
  quickInsertMenuRef.value?.hide()
  blockMenuRef.value?.open(customEvent.detail)
}

function handleImportMd() {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !editor.value) return

  const raw = await file.text()
  const parsed = parseMarkdown(raw)
  setStoredFrontmatter(parsed.frontmatter)
  editor.value.commands.setContent(parsed.html)

  input.value = ''
}

function handleExportMd() {
  if (!editor.value) return
  const html = editor.value.getHTML()
  const md = exportMarkdown(html)

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.md'
  a.click()
  URL.revokeObjectURL(url)
}

function handlePreview() {
  if (!editor.value) return
  previewHtml.value = editor.value.getHTML()
  previewVisible.value = true
  document.addEventListener('keydown', onPreviewKeydown)
}

function closePreview() {
  previewVisible.value = false
  document.removeEventListener('keydown', onPreviewKeydown)
}

function onPreviewKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePreview()
}

onMounted(() => {
  window.addEventListener('genshinlore-widget-handle-click', onWidgetHandleOpenMenu as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('genshinlore-widget-handle-click', onWidgetHandleOpenMenu as EventListener)
  document.removeEventListener('keydown', onPreviewKeydown)
  editor.value?.destroy()
})
</script>

<template>
  <div class="page-shell">
    <WidgetPanel v-model:selected-widget="selectedWidget" @insert="insertWidget" />

    <main class="editor-shell">
      <EditorToolbar
        :editor="editor"
        :active-heading="activeHeading"
        @heading="onHeadingChange"
        @align="setTextAlign"
        @toggle-link="toggleLink"
        @import-md="handleImportMd"
        @export-md="handleExportMd"
        @preview="handlePreview"
      />

      <input
        ref="fileInputRef"
        type="file"
        accept=".md"
        class="hidden-input"
        @change="onFileSelected"
      />

      <div v-if="showLinkInput" class="link-box">
        <input
          v-model="linkInput"
          class="ui-input"
          placeholder="输入链接地址（留空可移除）"
          @keydown.enter.prevent="confirmLink"
        />
        <button class="ui-btn ui-btn-primary" @click="confirmLink">应用</button>
        <button class="ui-btn" @click="showLinkInput = false">取消</button>
      </div>

      <div class="image-row">
        <input
          v-model="imageUrl"
          class="ui-input"
          placeholder="输入图片 URL 后插入"
          @keydown.enter.prevent="insertImage"
        />
        <button class="ui-btn" @click="insertImage">插入图片</button>
      </div>

      <div class="editor-area" @mousedown="handleEditorAreaMouseDown">
        <EditorBubbleMenu v-if="editor" :editor="editor" :on-toggle-link="toggleLink" />

        <EditorContent v-if="editor" :editor="editor" />

        <EditorSlashMenu
          ref="slashMenuRef"
          :editor="editor"
          :insert-widget="insertWidget"
        />
        <EditorBlockMenu
          ref="blockMenuRef"
          :editor="editor"
        />
        <EditorQuickInsertMenu
          ref="quickInsertMenuRef"
          :editor="editor"
        />
      </div>

      <EditorStatusBar :words="textStats.words" :chars="textStats.chars" />
    </main>

    <Teleport to="body">
      <div v-if="previewVisible" class="preview-overlay" @click.self="closePreview">
        <div class="preview-modal">
          <div class="preview-header">
            <h3>预览</h3>
            <button class="ui-btn" @click="closePreview">✕ 关闭</button>
          </div>
          <div class="preview-body genshin-editor-content" v-html="previewHtml"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

