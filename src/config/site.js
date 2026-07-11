// ============================================================================
// PLAYERS STUDIO — SITE CONFIG
// This is the ONLY place business data, asset paths and copy live. Swapping
// a drop-in asset or changing a business fact should never require touching
// any other file.
// ============================================================================

const site = {
  // --- Business facts -------------------------------------------------------
  name: 'Players Studio',
  address: '295 Lakeshore Rd E, Oakville, ON L6J 1J3, Canada',
  phone: '905-844-4443',
  phoneHref: 'tel:+19058444443',
  instagram: 'https://www.instagram.com/playersstudiooakville',

  // Booksy booking link — the shop's live Booksy page (Players Fade Studio,
  // 295 Lakeshore Rd E — name/address/phone all match). If this is ever
  // cleared, every Book button falls back to an enabled "#" link with a
  // "Booksy link coming soon" note; no code changes either way.
  bookingUrl:
    'https://booksy.com/en-ca/9047_players-fade-studio_barbershop_773207_oakville',

  // --- Geography -------------------------------------------------------------
  // 295 Lakeshore Rd E — derived from the verified RBC pin two doors west
  // (279 Lakeshore @ 43.44730,-79.66679, Lakeshore & Trafalgar corner),
  // extrapolated along the street's bearing. North side of Lakeshore Rd E.
  // Nudge here if the final frame is a door off.
  shopCoords: { lat: 43.4476, lng: -79.6665 },

  // Intro flight starting camera: slightly northwest of the shop so the
  // Lake Ontario shoreline and Sixteen Mile Creek read in the opening frame.
  introStartCenter: { lat: 43.4664, lng: -79.6989 },
  introStartZoom: 9.5,

  // --- Assets (drop-in slots) ------------------------------------------------
  assets: {
    logo: '/assets/logo.png', // ~600px wide transparent PNG
    interior: '/assets/interior.jpg', // >=2400px wide landscape photo
    // OPTIONAL phone-optimized copy (~1600px wide) served to small screens
    // via srcset. If the file is absent the site silently falls back to the
    // full-resolution interior.jpg — nothing breaks.
    interiorSmall: '/assets/interior-1600.jpg',
    interiorSmallWidth: 1100, // real pixel width of the phone copy
    interiorFullWidth: 1535, // current photo's real pixel width
    interiorHeight: 1024, // full photo's pixel height (for layout stability)
  },

  // --- SEO -------------------------------------------------------------------------
  seo: {
    // <title>: keep under ~60 characters, keyword + place up front
    title: 'Players Studio | Barbershop in Downtown Oakville',
    // meta description: ~155 characters, services + proof + call to action
    description:
      'Barbershop at 295 Lakeshore Rd E in downtown Oakville. Haircuts, fades, beard trims & kids cuts. Rated 4.9 from 600+ reviews. Book online or walk in.',
    priceRange: '$24–$50',
  },

  // --- Copy ----------------------------------------------------------------------
  tagline: 'Barbershop in Downtown Oakville',
  heroLine: 'Cuts, fades and beard work on Lakeshore — walk-ins welcome.',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Players+Studio+295+Lakeshore+Rd+E+Oakville+ON',

  // --- Barbers -----------------------------------------------------------------
  // Adding a barber later = one line here + dropping their photo into
  // /public/assets/barbers/.
  // img: null renders the initial-avatar and requests nothing. When a photo
  // is dropped into /public/assets/barbers/, set img to its path.
  barbers: [
    { id: 'rafael', name: 'Rafael', specialty: 'Specialty coming soon', img: null },
    { id: 'edward', name: 'Edward', specialty: 'Specialty coming soon', img: null },
  ],

  // --- Gallery -------------------------------------------------------------------
  // Real shop photos (owner's originals live in raw-assets/gallery/; these are
  // the web-optimized versions). thumb feeds the square grid tile, src feeds
  // the lightbox. To add a photo: drop cut-07.jpg + cut-07-thumb.jpg into
  // /public/gallery/ and add a line here.
  gallery: [
    {
      src: '/gallery/cut-01.jpg',
      thumb: '/gallery/cut-01-thumb.jpg',
      alt: 'Low taper fade being detailed with a trimmer at Players Studio Oakville',
    },
    {
      src: '/gallery/cut-02.jpg',
      thumb: '/gallery/cut-02-thumb.jpg',
      alt: 'Beard trim and lineup blended into a fade at Players Studio',
    },
    {
      src: '/gallery/cut-03.jpg',
      thumb: '/gallery/cut-03-thumb.jpg',
      alt: 'Kids haircut with a clean fade at Players Studio Oakville',
    },
    {
      src: '/gallery/cut-04.jpg',
      thumb: '/gallery/cut-04-thumb.jpg',
      alt: 'Custom freestyle design shaved into a taper at Players Studio',
    },
    {
      src: '/gallery/cut-05.jpg',
      thumb: '/gallery/cut-05-thumb.jpg',
      alt: 'Players Studio barber finishing up a haircut in the Oakville shop',
    },
    {
      src: '/gallery/cut-06.jpg',
      thumb: '/gallery/cut-06-thumb.jpg',
      alt: 'Barber shaping a curly top haircut at Players Studio Oakville',
    },
  ],

  // --- Reviews (from the shop's Booksy/Google listings) -------------------------------
  // Rating/count sourced from the public Booksy listing (4.9, 600+ reviews,
  // July 2026). The quotes below are lightly paraphrased from review
  // snippets on that listing — REPLACE with verbatim favourites from the
  // Booksy dashboard when convenient. Everything renders from here; an empty
  // quotes array simply hides the quotes section.
  reviews: {
    rating: 4.9,
    countLabel: '600+',
    sources: [
      {
        id: 'booksy',
        label: 'Booksy',
        url: 'https://booksy.com/en-ca/9047_players-fade-studio_barbershop_773207_oakville',
      },
      {
        id: 'google',
        label: 'Google',
        url: 'https://www.google.com/maps/search/?api=1&query=Players+Studio+295+Lakeshore+Rd+E+Oakville+ON',
      },
    ],
    quotes: [
      {
        text: 'Raf is a great all-around person and always provides a great cut. The only place I go now.',
        author: 'Booksy review',
      },
      {
        text: 'Edward is always on point — I leave looking fresh every time. Never disappoints.',
        author: 'Booksy review',
      },
      {
        text: 'He listens to what you want, takes his time and works professionally. Amazing.',
        author: 'Booksy review',
      },
      {
        text: 'Another great cut, and a nice hot towel to freshen up at the end.',
        author: 'Booksy review',
      },
    ],
  },

  // --- Services & hours (from the Booksy listing — keep in sync with Booksy) ---------
  services: [
    { name: 'Haircut / Fade', price: '$40', priceNumber: 40 },
    { name: 'Haircut / Fade + Beard', price: '$50', priceNumber: 50 },
    { name: 'Beard Trim / Lineup', price: '$24', priceNumber: 24 },
    { name: 'Kids Haircut (10 & under)', price: '$30', priceNumber: 30 },
  ],
  // days/time are display strings; dayOfWeek/opens/closes feed the
  // schema.org openingHoursSpecification search engines read.
  hours: [
    { days: 'Mon – Thu', time: '9:00 AM – 9:00 PM', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '21:00' },
    { days: 'Fri', time: '9:00 AM – 8:00 PM', dayOfWeek: ['Friday'], opens: '09:00', closes: '20:00' },
    { days: 'Sat', time: '9:00 AM – 7:00 PM', dayOfWeek: ['Saturday'], opens: '09:00', closes: '19:00' },
    { days: 'Sun', time: '9:00 AM – 7:00 PM', dayOfWeek: ['Sunday'], opens: '09:00', closes: '19:00' },
  ],

  // --- Behaviour flags -------------------------------------------------------------
  autoSkipIntroOnReturn: true, // returning phone visitors skip the movie
  ghostLogoDuringBlackout: true, // logo at 15% opacity during the black hold
}

export default site
