import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const publishDir = resolve(root, 'docs', 'public', 'editor')

if (existsSync(publishDir)) {
  rmSync(publishDir, { recursive: true, force: true })
  console.log(`Removed ${publishDir}`)
} else {
  console.log('docs/public/editor does not exist, skip.')
}
