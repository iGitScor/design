// Builds design.iscor.me from site/ and the tokens: one self-contained page, the tokens inlined.
//
//   node build/site.mjs      write site-dist/index.html (and CNAME, for GitHub Pages)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadTokens, outputs } from './build.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(join(root, path), 'utf8')
const out = join(root, 'site-dist')

const { light, dark, base } = loadTokens()
const short = (name) => name.split('.').pop()
const data = {
  colours: Object.keys(light).map((key) => ({
    name: short(key),
    light: light[key].$value,
    dark: dark[key].$value,
    description: light[key].$description ?? '',
  })),
  radii: Object.fromEntries(
    Object.entries(base)
      .filter(([key]) => key.startsWith('radius.'))
      .map(([key, token]) => [short(key), token.$value]),
  ),
}
const { version } = JSON.parse(read('package.json'))

const page = read('site/index.html')
  .replace('/* {{TOKENS_CSS}} */', () => outputs().built['dist/tokens.css'])
  .replace('/* {{SITE_CSS}} */', () => read('site/site.css'))
  .replace('/* {{SITE_JS}} */', () => read('site/site.js'))
  .replace('/* {{DATA}} */ null', () => JSON.stringify(data))
  .replaceAll('{{VERSION}}', version)

if (/\{\{[A-Z_]+\}\}/.test(page)) throw new Error('site/index.html: a placeholder was left unfilled')

mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'index.html'), page)
writeFileSync(join(out, 'CNAME'), 'design.iscor.me\n')
console.log(`Wrote site-dist/ (${Math.round(page.length / 1024)} KB).`)
