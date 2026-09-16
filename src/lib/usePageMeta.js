import { useEffect } from 'react'
import { routes } from '../routes.js'
import { hrefFor } from './router.jsx'

function setMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Per-page <title>, description and canonical/og:url. */
export default function usePageMeta(route, descriptionOverride) {
  useEffect(() => {
    const r = routes.find((x) => x.path === route) || routes[0]
    const description = descriptionOverride || r.description
    const url = window.location.origin + hrefFor(route)
    document.title = r.title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', r.title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', r.title)
    setMeta('name', 'twitter:description', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
  }, [route, descriptionOverride])
}
