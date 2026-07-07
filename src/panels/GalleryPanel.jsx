import { useEffect, useRef, useState } from 'react'
import Panel from '../components/Panel.jsx'
import site from '../config/site.js'

function Tile({ photo, index, onOpen }) {
  const [missing, setMissing] = useState(false)
  return (
    <li className="gallery-tile">
      <button
        type="button"
        className="gallery-tile__btn"
        onClick={() => onOpen(index)}
        aria-label={missing ? `Photo ${index + 1} coming soon` : `View ${photo.alt}`}
      >
        {!missing ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
          />
        ) : (
          <span className="gallery-tile__ph display">PHOTO</span>
        )}
      </button>
    </li>
  )
}

function Lightbox({ index, onClose, onMove }) {
  const touchX = useRef(null)
  const photo = site.gallery[index]
  const [missing, setMissing] = useState(false)

  useEffect(() => setMissing(false), [index])

  // Capture-phase so Escape closes the lightbox without also closing the
  // panel underneath (Panel skips defaultPrevented events).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowRight') onMove(1)
      else if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose, onMove])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${site.gallery.length}`}
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
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
      >
        ✕
      </button>
    </div>
  )
}

/** The Gallery (the canvas). Grid renders from config.gallery; real photos
 *  are drop-in files plus config entries. Everything lazy-loads. */
export default function GalleryPanel({ onClose }) {
  const [lightbox, setLightbox] = useState(null)
  const move = (dir) =>
    setLightbox((i) => (i + dir + site.gallery.length) % site.gallery.length)

  return (
    <Panel title="The Gallery" onClose={onClose}>
      <ul className="gallery-grid">
        {site.gallery.map((photo, i) => (
          <Tile key={photo.src} photo={photo} index={i} onOpen={setLightbox} />
        ))}
      </ul>
      {lightbox != null && (
        <Lightbox
          index={lightbox}
          onClose={() => setLightbox(null)}
          onMove={move}
        />
      )}
    </Panel>
  )
}
