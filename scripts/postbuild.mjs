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

// Where this build will live. SITE_URL is the public origin (no trailing
// slash); DEPLOY_BASE the path.
const base = process.env.DEPLOY_BASE || '/'
const origin = (process.env.SITE_URL || 'https://azogaj06.github.io').replace(/\/$/, '')
const siteUrl = origin + base
const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Bake each page's real title, description, canonical URL and link-preview
// tags into its static index.html. The app re-sets the same tags at runtime
// (it updates existing ones, so nothing duplicates) — this is for crawlers
// and chat-app link previews, which don't run JavaScript.
function pageHtml(r) {
  const url = siteUrl + (r.path ? r.path + '/' : '')
  const image = siteUrl + 'assets/interior.jpg'
  const head = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="business.business" />`,
    `<meta property="og:site_name" content="Players Studio" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
  return html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${head}\n  </head>`)
}

for (const r of routes) {
  const dir = r.path ? join(dist, r.path) : dist
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), pageHtml(r))
}
cpSync(join(dist, 'index.html'), join(dist, '404.html'))

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
