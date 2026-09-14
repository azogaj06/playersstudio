import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import site from '../config/site.js'
import Stars from './Stars.jsx'

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Full-viewport hero: the shop photo with a clear, labelled call-to-action
 * block — big BOOK button, call button, rating, address. Settles from
 * scale(1.04) as the blackout reveals; content rises in after it.
 */
export default function Hero({ animateIn, settleDelay = 0 }) {
  const photoRef = useRef(null)
  const contentRef = useRef(null)
  const [photoMissing, setPhotoMissing] = useState(false)
  const [logoMissing, setLogoMissing] = useState(false)
  const hasUrl = Boolean(site.bookingUrl)

  useLayoutEffect(() => {
    const photo = photoRef.current
    const content = contentRef.current
    if (!animateIn || window.matchMedia(REDUCED_QUERY).matches) {
      gsap.set([photo, content], { clearProps: 'all' })
      return
    }
    const tl = gsap.timeline({ delay: settleDelay })
    tl.fromTo(
      photo,
      { scale: 1.04 },
      { scale: 1, duration: 0.9, ease: 'power2.out' },
      0,
    ).fromTo(
      content,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0.25,
    )
    return () => tl.kill()
  }, [animateIn, settleDelay])

  return (
    <header className="hero" id="top">
      <div className="hero__media" ref={photoRef}>
        {!photoMissing ? (
          <img
            className="hero__photo"
            src={site.assets.interior}
            srcSet={`${site.assets.interiorSmall} ${site.assets.interiorSmallWidth}w, ${site.assets.interior} ${site.assets.interiorFullWidth}w`}
            sizes="100vw"
            alt={`Inside ${site.name}, barbershop in downtown Oakville`}
            width={site.assets.interiorFullWidth}
            height={site.assets.interiorHeight}
            fetchpriority="high"
            draggable="false"
            onError={(e) => {
              if (e.currentTarget.getAttribute('srcset')) {
                e.currentTarget.removeAttribute('srcset')
                e.currentTarget.removeAttribute('sizes')
                e.currentTarget.src = site.assets.interior
              } else {
                setPhotoMissing(true)
              }
            }}
          />
        ) : (
          <div className="hero__fallback" />
        )}
        <div className="hero__scrim" />
      </div>

      <div className="hero__content" ref={contentRef}>
        {/* The wordmark image is the visible brand; the visually-hidden text
            keeps a real keyword h1 for search engines. If the logo file is
            missing, the styled text steps back in. */}
        <p className="hero__est display">Est. {site.established}</p>
        <h1 className="hero__heading">
          {/* No visible kicker: it was too faint over the photo. The
              keyword line stays in the h1 for search engines only. */}
          <span className="visually-hidden">
            {site.name} — {site.tagline}
          </span>
          {!logoMissing ? (
            <img
              className="hero__wordmark"
              src={site.assets.logo}
              alt=""
              width="800"
              height="340"
              fetchpriority="high"
              draggable="false"
              onError={() => setLogoMissing(true)}
            />
          ) : (
            <span className="hero__title display" aria-hidden="true">
              {site.name}
            </span>
          )}
        </h1>
        <p className="hero__line">{site.heroLine}</p>

        <a className="hero__rating" href="#reviews">
          <Stars rating={site.reviews.rating} size={16} />
          <span>
            <strong>{site.reviews.ratingLabel}</strong> · {site.reviews.countLabel}{' '}
            reviews
          </span>
        </a>

        <div className="hero__actions">
          <a
            className="btn btn--primary btn--big hero__book"
            href={hasUrl ? site.bookingUrl : '#'}
            target={hasUrl ? '_blank' : undefined}
            rel={hasUrl ? 'noopener noreferrer' : undefined}
            onClick={hasUrl ? undefined : (e) => e.preventDefault()}
          >
            Book an Appointment
          </a>
          <a className="btn btn--secondary btn--big" href={site.phoneHref}>
            Call {site.phone}
          </a>
        </div>

        <p className="hero__meta">
          {site.address.replace(', Canada', '')} · Walk-ins welcome
        </p>
      </div>

      <a className="hero__scrollcue" href="#services" aria-label="Scroll down">
        <span>Scroll</span>
        <span className="hero__chevron" aria-hidden="true">
          ⌄
        </span>
      </a>
    </header>
  )
}
