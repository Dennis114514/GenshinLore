import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const slashCommandKey = new PluginKey('genshinLoreSlashCommand')

export interface SlashCommandState {
  active: boolean
  range: { from: number; to: number } | null
  query: string
  decorationPosition: { x: number; y: number } | null
}

export interface SlashCommandOptions {
  onActivate?: (state: SlashCommandState) => void
  onDeactivate?: () => void
  onQueryChange?: (query: string) => void
}

export const SlashCommandExtension = Extension.create<SlashCommandOptions>({
  name: 'genshinLoreSlashCommand',

  addOptions() {
    return {
      onActivate: undefined,
      onDeactivate: undefined,
      onQueryChange: undefined,
    }
  },

  addProseMirrorPlugins() {
    const extensionOptions = this.options

    return [
      new Plugin({
        key: slashCommandKey,

        state: {
          init(): SlashCommandState {
            return { active: false, range: null, query: '', decorationPosition: null }
          },

          apply(tr, previousState, _oldState, newState): SlashCommandState {
            const meta = tr.getMeta(slashCommandKey)
            if (meta?.deactivate) {
              return { active: false, range: null, query: '', decorationPosition: null }
            }

            if (!tr.docChanged && !tr.selectionSet) {
              return previousState
            }

            const { selection } = newState
            const { $from } = selection

            if (!selection.empty) {
              if (previousState.active) {
                return { active: false, range: null, query: '', decorationPosition: null }
              }
              return previousState
            }

            const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc')
            const match = textBefore.match(/^\/(\S*)$/)

            if (match) {
              const query = match[1] ?? ''
              const from = $from.start()
              const to = $from.pos

              return {
                active: true,
                range: { from, to },
                query,
                decorationPosition: null,
              }
            }

            if (previousState.active) {
              return { active: false, range: null, query: '', decorationPosition: null }
            }

            return previousState
          },
        },

        view() {
          return {
            update(view) {
              const state = slashCommandKey.getState(view.state) as SlashCommandState | undefined
              if (!state) {
                return
              }

              if (state.active && state.range) {
                const coords = view.coordsAtPos(state.range.from)
                const nextState: SlashCommandState = {
                  ...state,
                  decorationPosition: { x: coords.left, y: coords.bottom },
                }
                extensionOptions.onActivate?.(nextState)
                extensionOptions.onQueryChange?.(state.query)
              } else {
                extensionOptions.onDeactivate?.()
              }
            },
          }
        },
      }),
    ]
  },
})
