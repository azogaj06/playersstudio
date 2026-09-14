// After `vite build`: turn the single-page build into one index.html per
// route so GitHub Pages (a static host with no rewrite rules) serves
// /about/, /services/ ... with a 200. 404.html catches anything else and
// boots the app, which then falls back to the home route.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { routes } from '../src/routes.js'

const dist = new URL('../dist/', import.meta.url).pathname
let html = readFileSync(join(dist, 'index.html'), 'utf8')

// A preview build (DEPLOY_BASE containing /preview/) must never be indexed
// as a duplicate of the real site.
if ((process.env.DEPLOY_BASE || '').includes('/preview/')) {
  html = html.replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />')
  writeFileSync(join(dist, 'index.html'), html)
}

for (const r of routes) {
  if (!r.path) continue
  const dir = join(dist, r.path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
cpSync(join(dist, 'index.html'), join(dist, '404.html'))

// sitemap.xml + robots.txt for wherever this build is going to live.
// SITE_URL is the public origin (no trailing slash); DEPLOY_BASE the path.
const base = process.env.DEPLOY_BASE || '/'
const origin = (process.env.SITE_URL || 'https://azogaj06.github.io').replace(/\/$/, '')
const siteUrl = origin + base
const urls = routes
  .map((r) => {
    const loc = siteUrl + (r.path ? r.path + '/' : '')
    const pri = r.path === '' ? '1.0' : r.path === 'gallery' ? '0.7' : r.path === 'about' || r.path === 'barbers' ? '0.8' : '0.9'
    const freq = r.path === 'gallery' ? 'weekly' : 'monthly'
    return `  <url><loc>${loc}</loc><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`
  })
  .join('\n')
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`)
console.log(`postbuild: wrote ${routes.length - 1} route folders + 404.html; sitemap for ${siteUrl}`)
