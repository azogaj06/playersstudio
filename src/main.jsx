import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from './lib/router.jsx'
import site from './config/site.js'
import './styles/tokens.css'
import './styles/app.css'

// ============================================================================
// SEO head — every business fact comes from src/config/site.js.
// ============================================================================

const origin = window.location.origin
// Site paths already carry import.meta.env.BASE_URL (see config/site.js), so
// absolutizing is just prepending the origin. pageUrl is the canonical home —
// e.g. https://azogaj06.github.io/playersstudio/ on GitHub Pages.
const abs = (path) => origin + path
const pageUrl = origin + import.meta.env.BASE_URL
const [street, city, region] = site.address.split(',').map((s) => s.trim())

function setMeta(attr, key, content) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

document.title = site.seo.title
setMeta('name', 'description', site.seo.description)
setLink('canonical', pageUrl)

// Open Graph + Twitter cards (link previews in Messages/Instagram/etc. too)
setMeta('property', 'og:type', 'business.business')
setMeta('property', 'og:title', site.seo.title)
setMeta('property', 'og:description', site.seo.description)
setMeta('property', 'og:url', pageUrl)
setMeta('property', 'og:image', abs(site.assets.interior))
setMeta('property', 'og:site_name', site.name)
setMeta('name', 'twitter:card', 'summary_large_image')
setMeta('name', 'twitter:title', site.seo.title)
setMeta('name', 'twitter:description', site.seo.description)
setMeta('name', 'twitter:image', abs(site.assets.interior))

// LocalBusiness structured data: the machine-readable version of everything
// on the page — name, address, geo, phone, hours, rating, services, booking.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Barbershop',
  '@id': pageUrl + '#business',
  name: site.name,
  description: site.seo.description,
  url: pageUrl,
  image: abs(site.assets.interior),
  logo: abs(site.assets.logo),
  telephone: site.phoneHref.replace('tel:', ''),
  priceRange: site.seo.priceRange,
  address: {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: city,
    addressRegion: (region || '').split(' ')[0],
    postalCode: (region || '').split(' ').slice(1).join(' '),
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: site.shopCoords.lat,
    longitude: site.shopCoords.lng,
  },
  hasMap: site.directionsUrl,
  sameAs: [site.instagram, site.bookingUrl].filter(Boolean),
  openingHoursSpecification: (site.hours || []).map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.dayOfWeek,
    opens: h.opens,
    closes: h.closes,
  })),
  makesOffer: (site.services || []).map((s) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.name },
    price: s.priceNumber,
    priceCurrency: 'CAD',
  })),
}
if (site.reviews?.rating) {
  jsonLd.aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: site.reviews.rating,
    bestRating: 5,
    ratingCount: parseInt(site.reviews.countLabel, 10) || undefined,
  }
}
if (site.bookingUrl) {
  jsonLd.potentialAction = {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: site.bookingUrl,
      actionPlatform: [
        'https://schema.org/DesktopWebPlatform',
        'https://schema.org/MobileWebPlatform',
      ],
    },
    result: { '@type': 'Reservation', name: 'Barber appointment' },
  }
}
const ldScript = document.createElement('script')
ldScript.type = 'application/ld+json'
ldScript.textContent = JSON.stringify(jsonLd)
document.head.appendChild(ldScript)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </React.StrictMode>,
)
