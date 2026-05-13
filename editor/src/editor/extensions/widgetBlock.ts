import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import WidgetNodeView from '../WidgetNodeView.vue'

function safeParsePayload(payloadRaw: string | null): Record<string, string | number> {
  if (!payloadRaw) {
    return {}
  }
  try {
    return JSON.parse(decodeURIComponent(payloadRaw)) as Record<string, string | number>
  } catch {
    return {}
  }
}

export const WidgetBlock = Node.create({
  name: 'widgetBlock',
  group: 'block',
  content: 'block*',
  defining: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      widgetName: {
        default: 'Intro',
      },
      payload: {
        default: {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-widget-block]',
        getAttrs: (element) => {
          const target = element as HTMLElement
          return {
            widgetName: target.getAttribute('data-widget-name') ?? 'Intro',
            payload: safeParsePayload(target.getAttribute('data-widget-payload')),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const payload = HTMLAttributes.payload
    const encodedPayload = encodeURIComponent(JSON.stringify(payload ?? {}))

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-widget-block': 'true',
        'data-widget-name': HTMLAttributes.widgetName,
        'data-widget-payload': encodedPayload,
      }),
      0,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(WidgetNodeView)
  },
})
