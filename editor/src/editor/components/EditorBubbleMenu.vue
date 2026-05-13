<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/vue-3/menus'

defineProps<{
  editor: Editor
  onToggleLink: () => void
}>()
</script>

<template>
  <BubbleMenu class="bubble-menu" :editor="editor" :tippy-options="{ duration: 120, placement: 'top' }">
    <button class="bubble-btn" @mousedown.prevent @click="editor.chain().focus().toggleBold().run()">B</button>
    <button class="bubble-btn" @mousedown.prevent @click="editor.chain().focus().toggleItalic().run()">I</button>
    <button class="bubble-btn" @mousedown.prevent @click="editor.chain().focus().toggleBlockquote().run()">引用</button>
    <button class="bubble-btn" @mousedown.prevent @click="onToggleLink()">链接</button>
  </BubbleMenu>
</template>
