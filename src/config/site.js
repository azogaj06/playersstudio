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

  // Booksy booking link. Ships empty per the drop-in contract: while empty,
  // every Book button renders enabled but links to "#" with a small
  // "Booksy link coming soon" note. Paste the real URL here and every Book
  // button across the site points to it — zero code changes.
  bookingUrl: '',

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
    interiorFullWidth: 2400, // srcset width descriptor — update to the real photo's pixel width
  },

  // Aspect ratio of the interior photo. UPDATE to the real photo's
  // width/height when it arrives (e.g. 3000/2000 -> 1.5).
  interiorAspect: 16 / 9,

  // --- Hotspots ----------------------------------------------------------------
  // x,y = center of the button as % of the interior image; w = button width
  // as % of image width.
  // ADJUST ALL COORDINATES WHEN THE REAL INTERIOR PHOTO ARRIVES
  hotspots: [
    { id: 'book',    label: 'Book an Appointment', x: 78, y: 56, w: 13, img: '/assets/buttons/book.png' },    // reception desk, right side
    { id: 'barbers', label: 'Meet the Barbers',    x: 46, y: 52, w: 12, img: '/assets/buttons/barbers.png' }, // barber chair, ahead
    { id: 'gallery', label: 'The Gallery',         x: 20, y: 33, w: 13, img: '/assets/buttons/gallery.png' }, // canvas above waiting chairs, left
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

  // --- Behaviour flags -------------------------------------------------------------
  parallax: true, // subtle desktop mouse parallax on the interior stage
  autoSkipIntroOnReturn: true, // returning phone visitors skip the movie
  ghostLogoDuringBlackout: true, // logo at 15% opacity during the black hold
}

export default site
