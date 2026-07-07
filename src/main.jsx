import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import site from './config/site.js'
import './styles/tokens.css'
import './styles/app.css'

// Business facts live only in src/config/site.js — stamp the document
// title/description from there instead of hardcoding them in index.html.
document.title = `${site.name} — ${site.address.split(',').slice(1, 2).join('').trim()} Barbershop`
document
  .querySelector('meta[name="description"]')
  ?.setAttribute(
    'content',
    `${site.name} — barbershop at ${site.address}. Book your chair.`,
  )

// LocalBusiness structured data so the site's own SEO carries the same
// facts as the Google/Booksy listings. Built entirely from config.
const [street, city, region] = site.address.split(',').map((s) => s.trim())
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Barbershop',
  name: site.name,
  telephone: site.phone,
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
  url: window.location.origin,
  sameAs: [site.instagram, site.bookingUrl].filter(Boolean),
  openingHours: (site.hours || []).map((h) => `${h.days} ${h.time}`),
}
if (site.reviews?.rating) {
  jsonLd.aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: site.reviews.rating,
    bestRating: 5,
    ratingCount: parseInt(site.reviews.countLabel, 10) || undefined,
  }
}
const ldScript = document.createElement('script')
ldScript.type = 'application/ld+json'
ldScript.textContent = JSON.stringify(jsonLd)
document.head.appendChild(ldScript)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
