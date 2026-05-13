<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Editor } from '@tiptap/core'
import type { BlockActionEvent } from '../extensions/blockActionDecorations'

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

function withBlockSelection(run: (editor: Editor) => void) {
  const editor = props.editor
  if (!editor) return
  editor.chain().focus().setTextSelection(nodePos.value).run()
  run(editor)
}

function runAndClose(run: (editor: Editor) => void) {
  withBlockSelection(run)
  hide()
}

function setParagraph() {
  runAndClose((editor) => editor.chain().focus().setParagraph().run())
}

function setHeading(level: 2 | 3 | 4) {
  runAndClose((editor) => editor.chain().focus().toggleHeading({ level }).run())
}

function toggleBold() {
  runAndClose((editor) => editor.chain().focus().toggleBold().run())
}

function toggleItalic() {
  runAndClose((editor) => editor.chain().focus().toggleItalic().run())
}

function toggleBulletList() {
  runAndClose((editor) => editor.chain().focus().toggleBulletList().run())
}

function toggleOrderedList() {
  runAndClose((editor) => editor.chain().focus().toggleOrderedList().run())
}

function toggleQuote() {
  runAndClose((editor) => editor.chain().focus().toggleBlockquote().run())
}

function toggleCodeBlock() {
  runAndClose((editor) => editor.chain().focus().toggleCodeBlock().run())
}

function setAlign(align: 'left' | 'center' | 'right') {
  runAndClose((editor) => editor.chain().focus().setTextAlign(align).run())
}

function duplicateBlock() {
  const editor = props.editor
  if (!editor) return
  const node = editor.state.doc.nodeAt(nodePos.value)
  if (!node) return

  editor
    .chain()
    .focus()
    .insertContentAt(nodeTo.value, node.toJSON())
    .run()

  hide()
}

function deleteBlock() {
  const editor = props.editor
  if (!editor) return
  editor.chain().focus().deleteRange({ from: nodePos.value, to: nodeTo.value }).run()
  hide()
}

defineExpose({ open, hide })
</script>

<template>
  <teleport to="body">
    <div v-if="isVisible" class="block-menu-backdrop" @mousedown="hide" />
    <div v-if="isVisible" class="block-action-menu" :style="menuStyle" @mousedown.stop>
      <div class="block-toolbar-row">
        <div class="block-inline-group">
          <button class="block-icon-btn" @click="setParagraph">P</button>
          <button class="block-icon-btn" @click="setHeading(2)">H2</button>
          <button class="block-icon-btn" @click="setHeading(3)">H3</button>
          <button class="block-icon-btn" @click="setHeading(4)">H4</button>
        </div>
        <div class="block-inline-group">
          <button class="block-icon-btn" @click="toggleBold">B</button>
          <button class="block-icon-btn" @click="toggleItalic">I</button>
        </div>
        <div class="block-inline-group">
          <button class="block-icon-btn" @click="toggleBulletList">•</button>
          <button class="block-icon-btn" @click="toggleOrderedList">1.</button>
          <button class="block-icon-btn" @click="toggleQuote">❝</button>
          <button class="block-icon-btn" @click="toggleCodeBlock">&lt;/&gt;</button>
        </div>
      </div>

      <div class="block-toolbar-row">
        <div class="block-inline-group">
          <button class="block-icon-btn" @click="setAlign('left')">左</button>
          <button class="block-icon-btn" @click="setAlign('center')">中</button>
          <button class="block-icon-btn" @click="setAlign('right')">右</button>
        </div>
      </div>

      <div class="block-action-line" />
      <div class="block-action-grid">
        <button class="block-action-btn" @click="duplicateBlock">复制块</button>
        <button class="block-action-btn danger" @click="deleteBlock">删除块</button>
      </div>
    </div>
  </teleport>
</template>
