import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import site from '../config/site.js'
import Hotspot from './Hotspot.jsx'
import PlaceholderInterior from './PlaceholderInterior.jsx'

const PHONE_QUERY = '(max-width: 820px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * The full-bleed interior scene.
 *
 * The stage preserves the photo's aspect ratio while covering the screen:
 *   height: max(100dvh, 100vw / AR)   width: max(100vw, 100dvh * AR)
 * Hotspots are positioned in percentages OF THE STAGE, so a button placed on
 * the desk stays glued to the desk at every screen size.
 *
 * ≤820px: the viewport becomes a horizontally swipeable panorama (hidden
 * scrollbars, initial scroll centred, hint chip that fades after 4s).
 * Desktop: overflow hidden + subtle ±8px mouse parallax (config.parallax,
 * disabled under reduced motion).
 */
export default function InteriorStage({ animateIn, onHotspot }) {
  const viewportRef = useRef(null)
  const stageRef = useRef(null)
  const [photoState, setPhotoState] = useState('loading') // loading | ok | missing
  const [hintGone, setHintGone] = useState(false)

  const srcSet = `${site.assets.interiorSmall} 1600w, ${site.assets.interior} ${site.assets.interiorFullWidth}w`
  // On phones the stage is (100dvh * aspect) wide — derive the hint from
  // config so updating interiorAspect never requires touching this file.
  const sizes = `(max-width: 820px) ${Math.round(site.interiorAspect * 100)}vh, 100vw`

  // Settle animation: scale 1.04 -> 1 over 900ms, hotspots rise in staggered
  // 120ms apart after the settle begins. Skipped entirely when animateIn is
  // false (SKIP INTRO, reduced motion, returning phone visitor).
  useLayoutEffect(() => {
    const stage = stageRef.current
    const spots = stage.querySelectorAll('.hotspot__anim')
    if (!animateIn || window.matchMedia(REDUCED_QUERY).matches) {
      gsap.set(stage, { scale: 1 })
      gsap.set(spots, { opacity: 1, y: 0 })
      return
    }
    const tl = gsap.timeline()
    tl.fromTo(
      stage,
      { scale: 1.04 },
      { scale: 1, duration: 0.9, ease: 'power2.out' },
      0,
    ).fromTo(
      spots,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.12 },
      0.15,
    )
    return () => tl.kill()
  }, [animateIn])

  // Phone panorama: centre the initial scroll so the visitor lands looking at
  // the barber chair; re-centre on orientation change / resize.
  useEffect(() => {
    const vp = viewportRef.current
    const center = () => {
      if (!window.matchMedia(PHONE_QUERY).matches) return
      vp.scrollLeft = (vp.scrollWidth - vp.clientWidth) / 2
    }
    center()
    window.addEventListener('resize', center)
    window.addEventListener('orientationchange', center)
    return () => {
      window.removeEventListener('resize', center)
      window.removeEventListener('orientationchange', center)
    }
  }, [])

  // "swipe to look around" hint fades after 4s (or on first swipe).
  useEffect(() => {
    const t = setTimeout(() => setHintGone(true), 4000)
    const vp = viewportRef.current
    const onScroll = () => setHintGone(true)
    vp.addEventListener('scroll', onScroll, { passive: true, once: true })
    return () => {
      clearTimeout(t)
      vp.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Desktop mouse parallax: ±8px translate on the stage, transform-only.
  useEffect(() => {
    if (!site.parallax) return
    if (window.matchMedia(REDUCED_QUERY).matches) return
    if (window.matchMedia(PHONE_QUERY).matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const stage = stageRef.current
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      gsap.to(stage, {
        x: nx * -16, // ±8px
        y: ny * -16,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const showPhoto = photoState !== 'missing'

  return (
    <div className="stage-viewport" ref={viewportRef}>
      <div
        className="stage"
        ref={stageRef}
        style={{ '--ar': site.interiorAspect }}
      >
        {showPhoto ? (
          <img
            className="stage__photo"
            src={site.assets.interior}
            srcSet={srcSet}
            sizes={sizes}
            alt="Inside Players Studio barbershop"
            draggable="false"
            onLoad={() => setPhotoState('ok')}
            onError={(e) => {
              // If the phone-optimized srcset candidate is missing, retry with
              // plain src (full interior.jpg); if that is missing too, fall
              // back to the placeholder room. Zero code changes on drop-in.
              if (e.currentTarget.getAttribute('srcset')) {
                e.currentTarget.removeAttribute('srcset')
                e.currentTarget.removeAttribute('sizes')
                e.currentTarget.src = site.assets.interior
              } else {
                setPhotoState('missing')
              }
            }}
          />
        ) : (
          <PlaceholderInterior />
        )}
        {site.hotspots.map((spot) => (
          <Hotspot key={spot.id} spot={spot} onOpen={onHotspot} />
        ))}
      </div>
      <div
        className={`stage-hint${hintGone ? ' stage-hint--gone' : ''}`}
        aria-hidden="true"
      >
        ‹ swipe to look around ›
      </div>
    </div>
  )
}
