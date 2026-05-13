import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, NodeSelection } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export interface BlockActionEvent {
  position: { x: number; y: number }
  nodePos: number
  nodeTo: number
}

export interface BlockActionDecorationsOptions {
  onDragHandleClick?: (event: BlockActionEvent) => void
  onPlusClick?: (event: BlockActionEvent) => void
}

export const blockActionDecorationsKey = new PluginKey('genshinLoreBlockActionDecorations')

function canShowDragHandle(node: ProseMirrorNode, parentTypeName?: string): boolean {
  if (!node.isBlock) return false
  if (node.type.name === 'doc') return false
  if (node.type.name === 'widgetBlock') return false
  if (node.type.name === 'table') return false
  if (node.type.name === 'tableRow') return false
  if (node.type.name === 'tableCell') return false
  if (node.type.name === 'tableHeader') return false
  if (parentTypeName === 'table') return false
  if (parentTypeName === 'tableRow') return false
  if (parentTypeName === 'tableCell') return false
  if (parentTypeName === 'tableHeader') return false
  return true
}

function canShowPlusButton(node: ProseMirrorNode, parentTypeName?: string): boolean {
  if (node.type.name !== 'paragraph') return false
  if (node.textContent.trim().length > 0) return false
  if (node.childCount > 0) return false
  if (parentTypeName === 'listItem' || parentTypeName === 'taskItem') return false
  return true
}

function createDragHandle(
  node: ProseMirrorNode,
  pos: number,
  view: any,
  callback?: (event: BlockActionEvent) => void,
): HTMLElement {
  const element = document.createElement('button')
  element.type = 'button'
  element.className = 'block-drag-handle'
  if (node.type.name === 'widgetBlock') {
    element.classList.add('block-drag-handle-widget')
  }
  element.contentEditable = 'false'
  element.draggable = true
  element.setAttribute('data-drag-handle', 'true')
  element.setAttribute('aria-label', '块操作')
  element.innerHTML = '<span>⋮⋮</span>'

  const selectNode = () => {
    const { state } = view
    const nodeSelection = NodeSelection.create(state.doc, pos)
    view.dispatch(state.tr.setSelection(nodeSelection))
  }

  element.addEventListener('mousedown', () => {
    // 仅同步选区，不阻断事件，让 ProseMirror 能拿到 mousedown 并建立 mightDrag。
    selectNode()
  })

  element.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectNode()

    const rect = element.getBoundingClientRect()
    callback?.({
      position: { x: rect.right + 10, y: rect.top },
      nodePos: pos,
      nodeTo: pos + node.nodeSize,
    })
  })

  return element
}

function createPlusButton(
  node: ProseMirrorNode,
  pos: number,
  callback?: (event: BlockActionEvent) => void,
): HTMLElement {
  const element = document.createElement('button')
  element.type = 'button'
  element.className = 'block-plus-handle'
  element.contentEditable = 'false'
  element.draggable = false
  element.setAttribute('aria-label', '快捷插入')
  element.innerHTML = '+'

  element.addEventListener('mousedown', (event) => {
    event.preventDefault()
    event.stopPropagation()
  })

  element.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const rect = element.getBoundingClientRect()
    callback?.({
      position: { x: rect.right + 10, y: rect.top },
      nodePos: pos,
      nodeTo: pos + node.nodeSize,
    })
  })

  return element
}

export const BlockActionDecorations = Extension.create<BlockActionDecorationsOptions>({
  name: 'genshinLoreBlockActionDecorations',

  addOptions() {
    return {
      onDragHandleClick: undefined,
      onPlusClick: undefined,
    }
  },

  addProseMirrorPlugins() {
    const options = this.options

    return [
      new Plugin({
        key: blockActionDecorationsKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = []

            state.doc.descendants((node, pos, parent) => {
              const parentTypeName = parent?.type?.name

              if (canShowDragHandle(node, parentTypeName)) {
                decorations.push(
                  Decoration.widget(
                    pos + 1,
                    (view) => createDragHandle(node, pos, view, options.onDragHandleClick),
                    {
                      side: -1,
                      // 不拦截 dragstart，交给 ProseMirror 原生拖拽流水线处理。
                      stopEvent: (event) => event.type === 'click',
                    },
                  ),
                )
              }

              if (canShowPlusButton(node, parentTypeName)) {
                decorations.push(
                  Decoration.widget(
                    pos + 1,
                    () => createPlusButton(node, pos, options.onPlusClick),
                    {
                      side: -1,
                      stopEvent: (event) => event.type === 'mousedown' || event.type === 'click',
                    },
                  ),
                )
              }

              return true
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
