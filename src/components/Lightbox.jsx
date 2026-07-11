import { useEffect, useRef, useState } from 'react'
import site from '../config/site.js'

/** Full-screen photo viewer: ✕ / Escape / backdrop close, arrows + swipe move. */
export default function Lightbox({ index, onClose, onMove }) {
  const touchX = useRef(null)
  const rootRef = useRef(null)
  const closeRef = useRef(null)
  const photo = site.gallery[index]
  const [missing, setMissing] = useState(false)

  useEffect(() => setMissing(false), [index])

  // Focus management: enter the dialog on open, restore on close.
  useEffect(() => {
    const prev = document.activeElement
    closeRef.current?.focus()
    return () => prev?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowRight') onMove(1)
      else if (e.key === 'ArrowLeft') onMove(-1)
      else if (e.key === 'Tab') {
        const focusables = rootRef.current?.querySelectorAll('button')
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!rootRef.current.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose, onMove])

  return (
    <div
      className="lightbox"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${site.gallery.length}`}
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches.length === 1 ? e.touches[0].clientX : null
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        if (e.touches.length > 0) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 48) onMove(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <div className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
        {!missing ? (
          <img
            src={photo.src}
            alt={photo.alt}
            decoding="async"
            onError={() => setMissing(true)}
          />
        ) : (
          <span className="gallery-tile__ph gallery-tile__ph--big display">
            PHOTO
          </span>
        )}
      </div>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        aria-label="Previous photo"
        onClick={(e) => {
          e.stopPropagation()
          onMove(-1)
        }}
      >
        ‹
      </button>
      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        aria-label="Next photo"
        onClick={(e) => {
          e.stopPropagation()
          onMove(1)
        }}
      >
        ›
      </button>
      <button
        type="button"
        className="lightbox__close"
        aria-label="Close photo"
        onClick={onClose}
        ref={closeRef}
      >
        ✕
      </button>
    </div>
  )
}
