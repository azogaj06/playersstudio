import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { routes } from '../routes.js'

// ----------------------------------------------------------------------------
// Tiny history router. Six static pages don't justify a dependency; this is
// ~80 lines and understands the site base ('/' locally, '/playersstudio/' on
// GitHub Pages). URLs are folder-style with a trailing slash — matching the
// real folders scripts/postbuild.mjs writes into dist/ — so a hard refresh on
// /about/ is served by GitHub Pages as a 200, not a 404.
// ----------------------------------------------------------------------------

const BASE = import.meta.env.BASE_URL // always ends with '/'
const KNOWN = new Set(routes.map((r) => r.path))

/** '/playersstudio/about/' -> 'about'; unknown paths fall back to home. */
export function pathToRoute(pathname) {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname
  p = p.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '')
  if (p === 'index') p = ''
  return KNOWN.has(p) ? p : ''
}

/** 'about' -> '/playersstudio/about/'; '' -> '/playersstudio/' */
export function hrefFor(route, hash = '') {
  return BASE + (route ? route + '/' : '') + hash
}

const RouterContext = createContext({ route: '', navigate: () => {} })

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(() => pathToRoute(window.location.pathname))

  const navigate = useCallback((to, { hash = '', replace = false } = {}) => {
    const href = hrefFor(to, hash)
    if (replace) history.replaceState(null, '', href)
    else history.pushState(null, '', href)
    setRoute(to)
    if (hash) {
      // Let the new page paint, then jump to the anchor.
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [])

  useEffect(() => {
    const onPop = () => setRoute(pathToRoute(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const value = useMemo(() => ({ route, navigate }), [route, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRoute() {
  return useContext(RouterContext)
}

/** Internal link. `to` is a route path ('' | 'about' | ...); `hash` optional. */
export function Link({ to, hash = '', children, onClick, ...rest }) {
  const { route, navigate } = useRoute()
  const href = hrefFor(to, hash)
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (to === route && hash) {
      document.querySelector(hash)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      history.replaceState(null, '', href)
      return
    }
    if (to === route && !hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    navigate(to, { hash })
  }
  return (
    <a href={href} onClick={handle} aria-current={to === route && !hash ? 'page' : undefined} {...rest}>
      {children}
    </a>
  )
}
