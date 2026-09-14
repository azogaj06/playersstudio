// ============================================================================
// PLAYERS STUDIO — SITE CONFIG
// This is the ONLY place business data, asset paths and copy live. Swapping
// a drop-in asset or changing a business fact should never require touching
// any other file.
// ============================================================================

// Prefix for every local file path below. import.meta.env.BASE_URL is '/'
// in dev/Netlify and '/playersstudio/' on GitHub Pages, so the same config
// works wherever the site is mounted.
const asset = (path) => import.meta.env.BASE_URL + path

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
  // 295 Lakeshore Rd E, north side, a few doors east of Trafalgar. The
  // intro dive AND the Contact page map both land on this one point, so a
  // correction here fixes both. Placed by the owner on the Contact map
  // (Sept 2026): the building just up-left of the previous pin. To
  // fine-tune: right-click the shop's roof in Google Maps, copy the
  // numbers, paste them here.
  shopCoords: { lat: 43.44783, lng: -79.66636 },

  // Intro flight starting camera: slightly northwest of the shop so the
  // Lake Ontario shoreline and Sixteen Mile Creek read in the opening frame.
  introStartCenter: { lat: 43.4664, lng: -79.6989 },
  introStartZoom: 9.5,

  // --- Assets (drop-in slots) ------------------------------------------------
  assets: {
    logo: asset('assets/logo.png'), // ~600px wide transparent PNG
    interior: asset('assets/interior.jpg'), // >=2400px wide landscape photo
    // OPTIONAL phone-optimized copy (~1600px wide) served to small screens
    // via srcset. If the file is absent the site silently falls back to the
    // full-resolution interior.jpg — nothing breaks.
    interiorSmall: asset('assets/interior-1600.jpg'),
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
      'Barbershop at 295 Lakeshore Rd E in downtown Oakville. Haircuts, fades, beard trims & kids cuts. Rated 5.0 from 600+ reviews. Book online or walk in.',
    priceRange: '$24–$50',
    // meta descriptions for the inner pages
    pages: {
      about:
        'Players Studio is a barbershop on Lakeshore Rd E in downtown Oakville. Fades, tapers, beards and kids cuts, walk-ins welcome, booking on Booksy.',
      services:
        'Haircuts and fades from $40, beard trims $24, kids cuts $30 at Players Studio, 295 Lakeshore Rd E, Oakville. Book on Booksy or walk in.',
      barbers:
        'Meet the barbers at Players Studio in downtown Oakville and book directly with the one you want.',
      gallery:
        'Recent fades, tapers, beard work and designs from the chairs at Players Studio, Oakville.',
      contact:
        'Players Studio hours, address and directions. 295 Lakeshore Rd E, Oakville, ON. Open 7 days. Call 905-844-4443.',
    },
  },

  // --- Copy ----------------------------------------------------------------------
  tagline: 'Barbershop in Downtown Oakville',
  heroLine: 'Cuts, fades and beard work on Lakeshore.',
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
    { id: 'hamza', name: 'Hamza', specialty: 'Specialty coming soon', img: null },
    { id: 'ahmed', name: 'Ahmed', specialty: 'Specialty coming soon', img: null },
  ],

  // --- Gallery -------------------------------------------------------------------
  // Real shop photos (owner's originals live in raw-assets/gallery/; these are
  // the web-optimized versions). thumb feeds the square grid tile, src feeds
  // the lightbox. To add a photo: drop cut-07.jpg + cut-07-thumb.jpg into
  // /public/gallery/ and add a line here.
  gallery: [
    {
      src: asset('gallery/cut-01.jpg'),
      thumb: asset('gallery/cut-01-thumb.jpg'),
      alt: 'Low taper fade being detailed with a trimmer at Players Studio Oakville',
    },
    {
      src: asset('gallery/cut-02.jpg'),
      thumb: asset('gallery/cut-02-thumb.jpg'),
      alt: 'Beard trim and lineup blended into a fade at Players Studio',
    },
    {
      src: asset('gallery/cut-03.jpg'),
      thumb: asset('gallery/cut-03-thumb.jpg'),
      alt: 'Kids haircut with a clean fade at Players Studio Oakville',
    },
    {
      src: asset('gallery/cut-04.jpg'),
      thumb: asset('gallery/cut-04-thumb.jpg'),
      alt: 'Custom freestyle design shaved into a taper at Players Studio',
    },
    {
      src: asset('gallery/cut-05.jpg'),
      thumb: asset('gallery/cut-05-thumb.jpg'),
      alt: 'Players Studio barber finishing up a haircut in the Oakville shop',
    },
    {
      src: asset('gallery/cut-06.jpg'),
      thumb: asset('gallery/cut-06-thumb.jpg'),
      alt: 'Barber shaping a curly top haircut at Players Studio Oakville',
    },
  ],

  // --- Shop photos (About page collage) -------------------------------------
  // First photo runs full width across the top; the rest sit in a row
  // beneath it. Originals live in raw-assets/shop/, web copies (2000px,
  // ~300 KB) in public/assets/shop/. Add a line here to add a photo.
  shopPhotos: [
    { src: asset('assets/shop/exterior.jpg'), alt: 'Players Studio storefront on Lakeshore Road East, downtown Oakville' },
    { src: asset('assets/interior.jpg'), alt: 'The chairs inside Players Studio, Oakville' },
    { src: asset('assets/shop/waiting-area.jpg'), alt: 'Front desk and waiting chairs at Players Studio' },
    { src: asset('assets/shop/paintings.jpg'), alt: 'Pop-art paintings and the clothing rack by the door at Players Studio' },
  ],

  // --- Reviews (from the shop's Booksy/Google listings) -------------------------------
  // Rating/count per the owner (5.0, 600+ reviews, Sept 2026). `rating` is
  // the number search engines read; `ratingLabel` is what's printed. The quotes below are lightly paraphrased from review
  // snippets on that listing — REPLACE with verbatim favourites from the
  // Booksy dashboard when convenient. Everything renders from here; an empty
  // quotes array simply hides the quotes section.
  reviews: {
    rating: 5,
    ratingLabel: '5.0',
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
  // `blurb` is the one-line description on the Services page. Prices are
  // the ones on Booksy — change them here and there together.
  services: [
    {
      name: 'Haircut / Fade',
      price: '$40',
      priceNumber: 40,
      blurb:
        'Skin fade, taper, scissor cut, crop — whatever you\'re after. Consult first, then cut, lineup and styled to finish.',
    },
    {
      name: 'Haircut / Fade + Beard',
      price: '$50',
      priceNumber: 50,
      blurb:
        'The full reset. Your cut plus beard shaping, lineup and a hot towel to close it out.',
    },
    {
      name: 'Beard Trim / Lineup',
      price: '$24',
      priceNumber: 24,
      blurb:
        'Length, shape and clean edges. Straight razor on the neck and cheeks, hot towel finish.',
    },
    {
      name: 'Kids Haircut (10 & under)',
      price: '$30',
      priceNumber: 30,
      blurb:
        'Same chair, same care, a bit more patience. Fades and scissor cuts for the little ones.',
    },
    // `tag` prints as a small label next to the name (price list, ticker).
    {
      name: 'First Cut',
      tag: 'New clients',
      price: '$35',
      priceNumber: 35,
      blurb: 'First time in the shop? Your first haircut or fade is $35.',
    },
  ],
  // days/time are display strings; dayOfWeek/opens/closes feed the
  // schema.org openingHoursSpecification search engines read.
  hours: [
    { days: 'Mon – Thu', time: '9:00 AM – 9:00 PM', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '21:00' },
    { days: 'Fri', time: '9:00 AM – 8:00 PM', dayOfWeek: ['Friday'], opens: '09:00', closes: '20:00' },
    { days: 'Sat', time: '9:00 AM – 7:00 PM', dayOfWeek: ['Saturday'], opens: '09:00', closes: '19:00' },
    { days: 'Sun', time: '9:00 AM – 7:00 PM', dayOfWeek: ['Sunday'], opens: '09:00', closes: '19:00' },
  ],

  // --- Page copy ----------------------------------------------------------------
  // Everything a visitor reads on the About / Services / Contact pages. Edit
  // freely — it's plain text. Keep the facts true to the shop.
  copy: {
    // Home
    homeStatement:
      'A barbershop on Lakeshore. Fades, tapers, beards, kids cuts. Book on Booksy or just walk in.',
    // About page
    aboutLead:
      'Players Studio is a barbershop on the north side of Lakeshore Road East, a few doors from Trafalgar, in the middle of downtown Oakville.',
    aboutBody: [
      'Players Studio opened on Lakeshore in 2023. A bright room, a row of chairs, and barbers who take their time.',
      'Most of the work is fades and tapers, but we do it all: scissor cuts, beards, kids. Tell us what you\'re after, or bring a photo.',
      'Walk in any day we\'re open, or book on Booksy if you want a specific barber at a specific time.',
    ],
    // Services page
    servicesLead:
      'Straightforward services, straightforward prices. What\'s listed on Booksy is what you pay in the chair.',
    servicesNotes: [
      'Walk-ins are welcome. Booking on Booksy guarantees your barber and your time.',
      'Running late? Give us a call and we\'ll do our best to hold the chair.',
      'Kids pricing is for 10 and under. Same barbers, same chairs.',
    ],
    // Contact page
    contactLead:
      'Downtown Oakville, north side of Lakeshore Road East. Street and lot parking nearby; the lake is a two-minute walk.',
  },

  // --- Behaviour flags -------------------------------------------------------------
  autoSkipIntroOnReturn: true, // returning phone visitors skip the movie
  ghostLogoDuringBlackout: true, // logo at 15% opacity during the black hold
}

export default site
