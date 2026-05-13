import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const docsRemoteUrl = process.env.VITE_DOCS_REMOTE ??
    (command === 'build'
      ? '/assets/editorRemoteEntry.js'
      : 'http://127.0.0.1:5173/assets/editorRemoteEntry.js')

  return {
    base: '/editor/',
    plugins: [
      vue(),
      federation({
        name: 'genshinloreEditor',
        remotes: {
          genshinloreDocs: docsRemoteUrl,
        },
        shared: ['vue'],
      }),
    ],
  }
})
