// ============================================================================
// PLAYERS STUDIO — SITE CONFIG
// This is the ONLY place business data, asset paths, and hotspot positions
// live. Swapping a drop-in asset or changing a business fact should never
// require touching any other file.
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
  // VERIFY: pin should sit on the correct building — north side of
  // Lakeshore Rd E in downtown Oakville. Check against Google Maps
  // satellite view and nudge lat/lng if it lands on the road or a neighbour.
  shopCoords: { lat: 43.4444, lng: -79.6649 },

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
    interiorFullWidth: 1535, // current photo's real pixel width — bump if a higher-res original arrives
  },

  // Aspect ratio of the interior photo (real photo is 3:2 landscape).
  interiorAspect: 3 / 2,

  // --- Hotspots ----------------------------------------------------------------
  // x,y = center of the button as % of the interior image; w = button width
  // as % of image width. Aimed at the real photo's layout: reception desk
  // bottom-right, front-right barber chair centre, waiting chairs bottom-left.
  // FINE-TUNE once the photo file is dropped in.
  hotspots: [
    { id: 'book',    label: 'Book an Appointment', x: 85, y: 72, w: 16, img: '/assets/buttons/book.png' },    // reception desk, bottom right
    { id: 'barbers', label: 'Meet the Barbers',    x: 58, y: 57, w: 13, img: '/assets/buttons/barbers.png' }, // front-right barber chair
    { id: 'gallery', label: 'The Gallery',         x: 13, y: 77, w: 18, img: '/assets/buttons/gallery.png' }, // waiting chairs, bottom left
  ],

  // --- Barbers -----------------------------------------------------------------
  // Adding a barber later = one line here + dropping their photo into
  // /public/assets/barbers/.
  barbers: [
    { id: 'rafael', name: 'Rafael', specialty: 'Specialty coming soon', img: '/assets/barbers/rafael.jpg' },
    { id: 'edward', name: 'Edward', specialty: 'Specialty coming soon', img: '/assets/barbers/edward.jpg' },
  ],

  // --- Gallery -------------------------------------------------------------------
  // Real photos are drop-in files in /public/gallery/ plus entries here.
  gallery: [
    { src: '/gallery/cut-01.jpg', alt: 'Haircut by Players Studio' },
    { src: '/gallery/cut-02.jpg', alt: 'Haircut by Players Studio' },
    { src: '/gallery/cut-03.jpg', alt: 'Haircut by Players Studio' },
    { src: '/gallery/cut-04.jpg', alt: 'Haircut by Players Studio' },
    { src: '/gallery/cut-05.jpg', alt: 'Haircut by Players Studio' },
    { src: '/gallery/cut-06.jpg', alt: 'Haircut by Players Studio' },
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
    { name: 'Haircut / Fade', price: '$40' },
    { name: 'Haircut / Fade + Beard', price: '$50' },
    { name: 'Beard Trim / Lineup', price: '$24' },
    { name: 'Kids Haircut (10 & under)', price: '$30' },
  ],
  hours: [
    { days: 'Mon – Thu', time: '9:00 AM – 9:00 PM' },
    { days: 'Fri', time: '9:00 AM – 8:00 PM' },
    { days: 'Sat', time: '9:00 AM – 7:00 PM' },
    { days: 'Sun', time: '9:00 AM – 7:00 PM' },
  ],

  // --- Behaviour flags -------------------------------------------------------------
  parallax: true, // subtle desktop mouse parallax on the interior stage
  autoSkipIntroOnReturn: true, // returning phone visitors skip the movie
  ghostLogoDuringBlackout: true, // logo at 15% opacity during the black hold
}

export default site
