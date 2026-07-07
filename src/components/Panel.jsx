import { useEffect, useRef } from 'react'
import site from '../config/site.js'

/**
 * Overlay panel shell: centred dark card on desktop, full-screen bottom
 * sheet on mobile (sticky header, internal momentum scroll, safe-area
 * padding). Escape, the ✕ button and clicking the backdrop all close.
 */
export default function Panel({ title, onClose, children }) {
  const cardRef = useRef(null)
  const closeRef = useRef(null)

  // Focus management: focus the sheet on open, restore on close.
  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    return () => prev?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        onClose()
        return
      }
      // Minimal focus trap: keep Tab inside the dialog.
      if (e.key === 'Tab') {
        const focusables = cardRef.current?.querySelectorAll(
          'button, a[href], input, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="panel-root">
      <div className="panel-backdrop" onClick={onClose} aria-hidden="true" />
      <section
        className="panel-card"
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="panel-head">
          <h2 className="panel-title display">{title}</h2>
          <button
            type="button"
            className="panel-close"
            onClick={onClose}
            aria-label="Close panel"
            ref={closeRef}
          >
            ✕
          </button>
        </header>
        <div className="panel-body">{children}</div>
        <footer className="panel-foot">{site.address}</footer>
      </section>
    </div>
  )
}
