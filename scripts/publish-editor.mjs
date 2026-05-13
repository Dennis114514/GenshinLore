import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const editorDist = resolve(root, 'editor', 'dist')
const publishDir = resolve(root, 'docs', 'public', 'editor')

if (!existsSync(editorDist)) {
  throw new Error('editor/dist 不存在，请先执行 editor 构建。')
}

rmSync(publishDir, { recursive: true, force: true })
mkdirSync(publishDir, { recursive: true })
cpSync(editorDist, publishDir, { recursive: true })

console.log(`Published editor dist -> ${publishDir}`)
