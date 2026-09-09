// After `vite build`: turn the single-page build into one index.html per
// route so GitHub Pages (a static host with no rewrite rules) serves
// /about/, /services/ ... with a 200. 404.html catches anything else and
// boots the app, which then falls back to the home route.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { routes } from '../src/routes.js'

const dist = new URL('../dist/', import.meta.url).pathname
const html = readFileSync(join(dist, 'index.html'), 'utf8')

for (const r of routes) {
  if (!r.path) continue
  const dir = join(dist, r.path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
cpSync(join(dist, 'index.html'), join(dist, '404.html'))
console.log(`postbuild: wrote ${routes.length - 1} route folders + 404.html`)
