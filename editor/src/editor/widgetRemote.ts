import type { Component } from 'vue'

let registryCache: Record<string, Component> | null = null

export async function loadRemoteWidgets(): Promise<Record<string, Component>> {
  if (registryCache) {
    return registryCache
  }

  try {
    await import('genshinloreDocs/widgetStyles')
    const remote = await import('genshinloreDocs/widgets')
    registryCache = remote.widgetRegistry
    return registryCache
  } catch {
    // fallback: docs remote 不可用时，直接加载本地 widgets
    const local = await import('../../../docs/.vitepress/theme/client/federation/widgetRegistry')
    registryCache = local.widgetRegistry
    return registryCache
  }
}
