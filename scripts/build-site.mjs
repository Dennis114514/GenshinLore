import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'

const { positionals, values } = parseArgs({
  options: {
    'site-url': { type: 'string' },
  },
  allowPositionals: true,
})

const env = { ...process.env }
const siteUrl = values['site-url'] || positionals[0]

if (siteUrl) {
  env.VITEPRESS_SITE_URL = siteUrl
}

const result = spawnSync('vitepress', ['build', 'docs'], {
  env,
  shell: true,
  stdio: 'inherit',
})

process.exit(result.status ?? 1)
