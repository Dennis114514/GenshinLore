import { computed, ref, type ShallowRef } from 'vue'
import type { Editor as CoreEditor } from '@tiptap/core'
import {
  getWidgetDefinition,
  type WidgetName,
} from '../widgetSchemas'

type HeadingLevel = 2 | 3 | 4 | 'paragraph'
type TextAlignMode = 'left' | 'center' | 'right'
const NESTED_WIDGETS = new Set<WidgetName>(['Timeline'])

export function useEditorUi<T extends CoreEditor>(editor: ShallowRef<T | null | undefined>) {
  const selectedWidget = ref<WidgetName>('Footnote')
  const imageUrl = ref('')
  const linkInput = ref('')
  const showLinkInput = ref(false)
  const textStats = ref({
    words: 0,
    chars: 0,
  })

  function insertWidget(name: WidgetName) {
    if (!editor.value) return
    const definition = getWidgetDefinition(name)
    const content = NESTED_WIDGETS.has(definition.name)
      ? [{ type: 'paragraph', content: [{ type: 'text', text: '在这里继续输入或插入内容块。' }] }]
      : undefined

    editor.value
      .chain()
      .focus()
      .insertContent({
        type: 'widgetBlock',
        attrs: {
          widgetName: definition.name,
          payload: { ...definition.payload },
        },
        content,
      })
      .run()
  }

  function applyHeading(level: HeadingLevel) {
    if (!editor.value) return
    if (level === 'paragraph') {
      editor.value.chain().focus().setParagraph().run()
      return
    }
    editor.value.chain().focus().toggleHeading({ level }).run()
  }

  function setTextAlign(align: TextAlignMode) {
    editor.value?.chain().focus().setTextAlign(align).run()
  }

  function toggleLink() {
    if (!editor.value) return
    const previousLink = editor.value.getAttributes('link').href as string | undefined
    linkInput.value = previousLink ?? ''
    showLinkInput.value = true
  }

  function confirmLink() {
    if (!editor.value) return
    if (!linkInput.value.trim()) {
      editor.value.chain().focus().unsetLink().run()
    } else {
      editor.value.chain().focus().setLink({ href: linkInput.value.trim() }).run()
    }
    showLinkInput.value = false
  }

  function insertImage() {
    if (!editor.value || !imageUrl.value.trim()) return
    editor.value.chain().focus().setImage({ src: imageUrl.value.trim() }).run()
    imageUrl.value = ''
  }

  function updateTextStats(instance: CoreEditor) {
    const text = instance.getText()
    const words = text.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9_]+/g)?.length ?? 0
    const chars = text.replace(/\s+/g, '').length
    textStats.value = { words, chars }
  }

  const activeHeading = computed<'paragraph' | '2' | '3' | '4'>(() => {
    if (editor.value?.isActive('heading', { level: 2 })) return '2'
    if (editor.value?.isActive('heading', { level: 3 })) return '3'
    if (editor.value?.isActive('heading', { level: 4 })) return '4'
    return 'paragraph'
  })

  return {
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
  }
}
