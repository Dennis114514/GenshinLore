<script setup lang="ts">
import type { Editor } from '@tiptap/core'

defineProps<{
  editor: Editor | null | undefined
  activeHeading: 'paragraph' | '2' | '3' | '4'
}>()

const emit = defineEmits<{
  heading: [value: 'paragraph' | '2' | '3' | '4']
  align: [value: 'left' | 'center' | 'right']
  toggleLink: []
  importMd: []
  exportMd: []
  preview: []
}>()

function onHeadingChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value as 'paragraph' | '2' | '3' | '4'
  emit('heading', selectedValue)
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-group">
      <select class="tool-select" :value="activeHeading" @change="onHeadingChange">
        <option value="paragraph">正文</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
        <option value="4">H4</option>
      </select>
    </div>

    <div class="toolbar-group">
      <button class="ui-btn" :class="{ 'ui-btn-active': editor?.isActive('bold') }" @click="editor?.chain().focus().toggleBold().run()">B</button>
      <button class="ui-btn" :class="{ 'ui-btn-active': editor?.isActive('italic') }" @click="editor?.chain().focus().toggleItalic().run()">I</button>
      <button class="ui-btn" :class="{ 'ui-btn-active': editor?.isActive('bulletList') }" @click="editor?.chain().focus().toggleBulletList().run()">• 列表</button>
      <button class="ui-btn" :class="{ 'ui-btn-active': editor?.isActive('orderedList') }" @click="editor?.chain().focus().toggleOrderedList().run()">1. 列表</button>
      <button class="ui-btn" :class="{ 'ui-btn-active': editor?.isActive('blockquote') }" @click="editor?.chain().focus().toggleBlockquote().run()">引用</button>
      <button class="ui-btn" :class="{ 'ui-btn-active': editor?.isActive('codeBlock') }" @click="editor?.chain().focus().toggleCodeBlock().run()">代码</button>
    </div>

    <div class="toolbar-group">
      <button class="ui-btn" @click="emit('align', 'left')">左</button>
      <button class="ui-btn" @click="emit('align', 'center')">中</button>
      <button class="ui-btn" @click="emit('align', 'right')">右</button>
    </div>

    <div class="toolbar-group">
      <button class="ui-btn" @click="emit('toggleLink')">链接</button>
      <button class="ui-btn" @click="editor?.chain().focus().undo().run()">撤销</button>
      <button class="ui-btn" @click="editor?.chain().focus().redo().run()">重做</button>
    </div>

    <div class="toolbar-group">
      <button class="ui-btn" @click="emit('importMd')">导入</button>
      <button class="ui-btn" @click="emit('exportMd')">导出</button>
      <button class="ui-btn" @click="emit('preview')">预览</button>
    </div>
  </div>
</template>
