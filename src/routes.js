// Plain data (no Vite env access) so scripts/postbuild.mjs can import it too.
// `path` is relative to the site base ('' = home). Every entry becomes a
// real folder in dist/ at build time so GitHub Pages serves deep links.
export const routes = [
  { path: '', label: 'Home', title: 'Players Studio | Barbershop in Downtown Oakville' },
  { path: 'about', label: 'About', title: 'About | Players Studio, Oakville' },
  { path: 'services', label: 'Services', title: 'Services & Prices | Players Studio, Oakville' },
  { path: 'barbers', label: 'Barbers', title: 'The Barbers | Players Studio, Oakville' },
  { path: 'gallery', label: 'Gallery', title: 'Gallery | Players Studio, Oakville' },
  { path: 'contact', label: 'Contact', title: 'Hours & Location | Players Studio, Oakville' },
  { path: 'hiring', label: 'Hiring', title: "We're Hiring | Players Studio, Oakville" },
]
