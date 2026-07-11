import { useCallback, useEffect, useRef, useState } from 'react'
import site from './config/site.js'
import { destroy as destroyMap, flyToShop } from './lib/mapProvider.js'
import LoadingScreen from './components/LoadingScreen.jsx'
import SatelliteIntro from './components/SatelliteIntro.jsx'
import Blackout from './components/Blackout.jsx'
import Hero from './components/Hero.jsx'
import TopNav from './components/TopNav.jsx'
import MobileBar from './components/MobileBar.jsx'
import {
  ServicesSection,
  BarbersSection,
  GallerySection,
  ReviewsSection,
  VisitSection,
  Footer,
} from './sections/Sections.jsx'

const SEEN_KEY = 'players-studio-intro-seen'
const PHONE_QUERY = '(max-width: 820px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const TILE_FAILSAFE_MS = 4000 // phones: never stall a booking customer on tiles
const TILE_FAILSAFE_DESKTOP_MS = 10000 // desktop backstop so the loader can never hang forever

const isPhone = () => window.matchMedia(PHONE_QUERY).matches
const prefersReduced = () => window.matchMedia(REDUCED_QUERY).matches

function introSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
function markIntroSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* private mode — intro simply replays */
  }
}

export default function App() {
  // ?intro (or #intro) forces the full satellite drop to replay — overrides
  // the returning-visitor auto-skip AND the reduced-motion bypass so the
  // owner can always preview the movie on demand.
  const [forceIntro] = useState(() =>
    /[?&#]intro/.test(window.location.search + window.location.hash),
  )
  // Returning visitors on phones skip the movie entirely — they're here to
  // book. Frozen at first render: recomputing per render could flip true
  // mid-intro (e.g. desktop window resized under 820px with the seen-flag
  // set) and kill the running choreography.
  const [autoSkip] = useState(
    () =>
      !forceIntro && site.autoSkipIntroOnReturn && isPhone() && introSeen(),
  )
  // Also frozen: a live matchMedia read used as an effect dep would re-run
  // the whole choreography if the OS motion setting flips mid-session.
  const [reduced] = useState(() => !forceIntro && prefersReduced())

  // intro | interior — plus fine-grained flags for the choreography
  const [phase, setPhase] = useState(autoSkip ? 'interior' : 'intro')
  const [loaderFading, setLoaderFading] = useState(false)
  const [loaderGone, setLoaderGone] = useState(autoSkip)
  const [blackout, setBlackout] = useState('off') // off | in | hold | out
  const [mapAlive, setMapAlive] = useState(!autoSkip && !reduced)
  const [animateIn, setAnimateIn] = useState(false)
  const [progress, setProgress] = useState(0.1)
  // Shown (only under ?intro) when the flight had to be skipped, so testing
  // "where is the map?" gives an actionable answer instead of silence.
  const [skipNote, setSkipNote] = useState(null)

  const timeoutsRef = useRef([])
  const abortedRef = useRef(false)
  const doneRef = useRef(false) // latched: a finished intro never replays
  const readyRef = useRef({ map: false, interior: false, mapFailed: false })

  const sleep = useCallback((ms) => {
    return new Promise((resolve) => {
      const id = setTimeout(resolve, ms)
      timeoutsRef.current.push(id)
    })
  }, [])

  const killIntro = useCallback(() => {
    abortedRef.current = true
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const jumpToInterior = useCallback(() => {
    doneRef.current = true
    killIntro()
    destroyMap()
    setMapAlive(false)
    setLoaderFading(true)
    setLoaderGone(true)
    setBlackout('off')
    setAnimateIn(false)
    setPhase('interior')
    markIntroSeen()
  }, [killIntro])

  // ---- Readiness: interior photo decode ------------------------------------
  useEffect(() => {
    if (autoSkip) return
    const img = new Image()
    img.src = site.assets.interior
    const done = () => {
      readyRef.current.interior = true
      setProgress((p) => Math.min(1, p + 0.4))
    }
    // A missing interior photo is fine — the placeholder room renders instead.
    img
      .decode()
      .then(done)
      .catch(done)
  }, [autoSkip])

  // ---- Map readiness callbacks (from SatelliteIntro) ------------------------
  const onMapReady = useCallback((result) => {
    readyRef.current.map = true
    // Map initialized but no imagery tile ever rendered (offline/blocked
    // network): flying over a black void is worse than no flight — take the
    // graceful straight-to-interior path instead.
    if (result && result.tilesVisible === false) {
      readyRef.current.mapFailed = true
      readyRef.current.failReason = 'satellite imagery could not be downloaded on this network'
    }
    setProgress((p) => Math.min(1, p + 0.5))
  }, [])
  const onMapFail = useCallback(() => {
    readyRef.current.mapFailed = true
    readyRef.current.failReason = 'the map engine failed to start in this browser'
    readyRef.current.map = true
    setProgress((p) => Math.min(1, p + 0.5))
  }, [])

  // ---- Intro choreography ----------------------------------------------------
  // Restartable: StrictMode's dev double-mount cancels the first run via the
  // local `cancelled` flag and the second run drives the real sequence.
  useEffect(() => {
    if (autoSkip) return
    let cancelled = false

    const waitForReady = async () => {
      const failsafeMs = isPhone() ? TILE_FAILSAFE_MS : TILE_FAILSAFE_DESKTOP_MS
      const started = performance.now()
      const needMap = !reduced
      while (!cancelled && !abortedRef.current) {
        const r = readyRef.current
        const mapOk = !needMap || r.map
        if (mapOk && r.interior) return
        // Slow cellular failsafe: advance with whatever has loaded.
        if (performance.now() - started > failsafeMs) return
        await sleep(120)
      }
    }

    const run = async () => {
      if (doneRef.current) return
      await waitForReady()
      if (abortedRef.current || cancelled) return
      setProgress(1)

      // Reduced motion, map failure, or map simply not ready in time (the
      // failsafe advanced) -> loader -> simple 400ms fade -> settled
      // interior. Never fly the camera without imagery on screen.
      if (reduced || readyRef.current.mapFailed || !readyRef.current.map) {
        const reason = reduced
          ? 'this device has the "Reduce Motion" accessibility setting on'
          : readyRef.current.mapFailed
            ? readyRef.current.failReason || 'the map was unavailable'
            : 'the map was still loading when the wait limit was reached'
        console.info(`Intro flight skipped: ${reason}`)
        if (forceIntro) setSkipNote(reason)
        setLoaderFading(true)
        await sleep(400)
        if (abortedRef.current || cancelled) return
        destroyMap()
        setMapAlive(false)
        setLoaderGone(true)
        setAnimateIn(false)
        setPhase('interior')
        doneRef.current = true
        markIntroSeen()
        return
      }

      // 1. Fade the loader out over 400ms revealing the wide satellite view.
      setLoaderFading(true)
      await sleep(400)
      if (abortedRef.current || cancelled) return
      setLoaderGone(true)

      // 2. Hold the bird's-eye for 1000ms.
      await sleep(1000)
      if (abortedRef.current || cancelled) return

      // 3. One continuous dive to the rooftop.
      await new Promise((resolve) => {
        flyToShop(resolve)
        // Belt-and-braces: if moveend never fires (tab hidden etc.) continue
        // shortly after the flight duration.
        const backstop = setTimeout(resolve, (isPhone() ? 3200 : 4200) + 1500)
        timeoutsRef.current.push(backstop)
      })
      if (abortedRef.current || cancelled) return

      // 4. Hold the rooftop 450ms, then cut to black over 400ms.
      await sleep(450)
      if (abortedRef.current || cancelled) return
      setBlackout('in')
      await sleep(400)
      if (abortedRef.current || cancelled) return

      // 5. While pure black: destroy the map (free WebGL + memory), mount the
      //    interior underneath, hold 350ms.
      destroyMap()
      setMapAlive(false)
      setAnimateIn(true)
      setPhase('interior')
      setBlackout('hold')
      await sleep(350)
      if (abortedRef.current || cancelled) return

      // 6. Fade black 1 -> 0 over 600ms; interior settle runs underneath.
      setBlackout('out')
      await sleep(600)
      if (abortedRef.current || cancelled) return
      setBlackout('off')
      doneRef.current = true
      markIntroSeen()
    }

    run()
    return () => {
      cancelled = true
    }
  }, [autoSkip, reduced, forceIntro, sleep])

  // Auto-hide the diagnostic note
  useEffect(() => {
    if (!skipNote) return
    const t = setTimeout(() => setSkipNote(null), 10000)
    return () => clearTimeout(t)
  }, [skipNote])

  // Destroy the map if the app unmounts mid-intro.
  useEffect(() => () => destroyMap(), [])

  const interiorShown = phase === 'interior'

  // The page scrolls only once the site is shown; the intro is a fixed scene.
  useEffect(() => {
    document.documentElement.classList.toggle('site-ready', interiorShown)
  }, [interiorShown])

  return (
    <div className="app">
      {/* Satellite map sits under the loader; destroyed during the blackout */}
      {mapAlive && <SatelliteIntro onReady={onMapReady} onFail={onMapFail} />}

      {/* The site itself: hero photo with clear buttons, then normal
          scrollable sections — services, barbers, gallery, reviews, hours.
          ALWAYS in the DOM (search engines index the full page immediately);
          during the intro it sits occluded under the fixed map/loader
          overlays with scrolling locked. Only the nav bars wait. */}
      {interiorShown && <TopNav />}
      <main className="site">
        <Hero
          animateIn={animateIn}
          // Settle begins when the blackout starts revealing (350ms
          // hold), not while the screen is still pure black.
          settleDelay={animateIn ? 0.35 : 0}
        />
        <ServicesSection />
        <BarbersSection />
        <GallerySection />
        <ReviewsSection />
        <VisitSection />
        <Footer />
      </main>
      {interiorShown && <MobileBar />}

      <Blackout state={blackout} />

      {!loaderGone && !autoSkip && (
        <LoadingScreen progress={progress} fading={loaderFading} />
      )}

      {/* SKIP INTRO: visible from the very first frame until the site shows */}
      {!interiorShown && (
        <button type="button" className="skip-intro" onClick={jumpToInterior}>
          Skip intro
        </button>
      )}

      {skipNote && interiorShown && (
        <div className="intro-note" role="status">
          Satellite intro skipped: {skipNote}.
        </div>
      )}
    </div>
  )
}
