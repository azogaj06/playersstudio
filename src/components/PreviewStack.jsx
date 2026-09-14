import { useState } from 'react'
import site from '../config/site.js'
import Lightbox from './Lightbox.jsx'

/**
 * Home-page taste of the gallery: three photos overlapping like prints
 * dropped on a table — rounded corners, slight tilt, the middle one on top.
 * Tap any one to open the full lightbox.
 */
export default function PreviewStack({ count = 3 }) {
  const [lightbox, setLightbox] = useState(null)
  const photos = site.gallery.slice(0, count)
  const move = (dir) =>
    setLightbox((i) => (i + dir + site.gallery.length) % site.gallery.length)
  return (
    <>
      <div className="stack">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className={`stack__item stack__item--${i + 1}`}
            onClick={() => setLightbox(i)}
            aria-label={`View photo: ${photo.alt}`}
          >
            <img src={photo.src} alt={photo.alt} width="1069" height="1600" decoding="async" />
          </button>
        ))}
      </div>
      {lightbox != null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onMove={move} />
      )}
    </>
  )
}
