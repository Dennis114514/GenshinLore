declare module 'genshinloreDocs/widgets' {
  import type { Component } from 'vue'

  export const widgetRegistry: Record<string, Component>
  export const widgetList: string[]
}

declare module 'genshinloreDocs/widgetStyles' {
  export const sharedStylesLoaded: boolean
}
