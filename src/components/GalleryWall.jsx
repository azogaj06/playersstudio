import { useState } from 'react'
import site from '../config/site.js'
import Lightbox from './Lightbox.jsx'

function Photo({ photo, index, onOpen, eager }) {
  const [missing, setMissing] = useState(false)
  return (
    <li className="wall__item">
      <button
        type="button"
        className="wall__btn"
        onClick={() => onOpen(index)}
        aria-label={`View photo: ${photo.alt}`}
      >
        {!missing ? (
          <img
            src={photo.src}
            alt={photo.alt}
            width="1069"
            height="1600"
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setMissing(true)}
          />
        ) : (
          <span className="wall__ph display">Photo</span>
        )}
        <span className="wall__num display" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </button>
    </li>
  )
}

/**
 * The gallery: big, full-bleed photos — two columns on desktop, one on a
 * phone, each tile roughly the height of the screen. `limit` trims it for
 * the home-page preview; the lightbox always steps through the full set.
 */
export default function GalleryWall({ limit, className = '' }) {
  const [lightbox, setLightbox] = useState(null)
  const photos = limit ? site.gallery.slice(0, limit) : site.gallery
  const move = (dir) =>
    setLightbox((i) => (i + dir + site.gallery.length) % site.gallery.length)
  return (
    <>
      <ul className={`wall ${className}`}>
        {photos.map((photo, i) => (
          <Photo key={photo.src} photo={photo} index={i} onOpen={setLightbox} eager={i < 2} />
        ))}
      </ul>
      {lightbox != null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onMove={move} />
      )}
    </>
  )
}
