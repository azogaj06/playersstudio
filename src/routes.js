// Plain data (no Vite env access) so scripts/postbuild.mjs can import it too.
// `path` is relative to the site base ('' = home). Every entry becomes a
// real folder in dist/ at build time so GitHub Pages serves deep links, and
// the title/description here are baked into that folder's index.html so
// link previews and crawlers see them without running any JavaScript.
export const routes = [
  {
    path: '',
    label: 'Home',
    title: 'Players Studio | Barbershop in Downtown Oakville',
    description:
      'Barbershop at 295 Lakeshore Rd E in downtown Oakville. Haircuts, fades, beard trims & kids cuts. Rated 5.0 from 600+ reviews. Book online or walk in.',
  },
  {
    path: 'about',
    label: 'About',
    title: 'About | Players Studio, Oakville',
    description:
      'Players Studio is a barbershop on Lakeshore Rd E in downtown Oakville, open since 2023. Fades, tapers, beards and kids cuts, walk-ins welcome, booking on Booksy.',
  },
  {
    path: 'services',
    label: 'Services',
    title: 'Services & Prices | Players Studio, Oakville',
    description:
      'Haircuts and fades from $40, beard trims $24, kids cuts $30, first cut $35 for new clients at Players Studio, 295 Lakeshore Rd E, Oakville. Book on Booksy or walk in.',
  },
  {
    path: 'barbers',
    label: 'Barbers',
    title: 'The Barbers | Players Studio, Oakville',
    description:
      'Meet the barbers at Players Studio in downtown Oakville and book directly with the one you want.',
  },
  {
    path: 'gallery',
    label: 'Gallery',
    title: 'Gallery | Players Studio, Oakville',
    description:
      'Recent fades, tapers, beard work and custom designs from the chairs at Players Studio, Oakville.',
  },
  {
    path: 'contact',
    label: 'Contact',
    title: 'Hours & Location | Players Studio, Oakville',
    description:
      'Players Studio hours, address and directions. 295 Lakeshore Rd E, Oakville, ON. Open 7 days. Call 905-844-4443.',
  },
  {
    path: 'hiring',
    label: 'Join Us!',
    title: "We're Hiring | Players Studio, Oakville",
    description:
      'Players Studio in downtown Oakville is hiring barbers. Busy chair on Lakeshore Rd E, open 7 days. Message us on Instagram or call 905-844-4443.',
  },
]
