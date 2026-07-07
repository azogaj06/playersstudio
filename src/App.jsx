import { useCallback, useEffect, useRef, useState } from 'react'
import site from './config/site.js'
import { destroy as destroyMap, flyToShop } from './lib/mapProvider.js'
import LoadingScreen from './components/LoadingScreen.jsx'
import SatelliteIntro from './components/SatelliteIntro.jsx'
import Blackout from './components/Blackout.jsx'
import InteriorStage from './components/InteriorStage.jsx'
import BottomNav from './components/BottomNav.jsx'
import Logo from './components/Logo.jsx'
import BookingPanel from './panels/BookingPanel.jsx'
import BarbersPanel from './panels/BarbersPanel.jsx'
import GalleryPanel from './panels/GalleryPanel.jsx'

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
  // Returning visitors on phones skip the movie entirely — they're here to book.
  const autoSkip = site.autoSkipIntroOnReturn && isPhone() && introSeen()
  const reduced = prefersReduced()

  // intro | interior — plus fine-grained flags for the choreography
  const [phase, setPhase] = useState(autoSkip ? 'interior' : 'intro')
  const [loaderFading, setLoaderFading] = useState(false)
  const [loaderGone, setLoaderGone] = useState(autoSkip)
  const [blackout, setBlackout] = useState('off') // off | in | hold | out
  const [mapAlive, setMapAlive] = useState(!autoSkip && !reduced)
  const [animateIn, setAnimateIn] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [progress, setProgress] = useState(0.1)

  const timeoutsRef = useRef([])
  const abortedRef = useRef(false)
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
  const onMapReady = useCallback(() => {
    readyRef.current.map = true
    setProgress((p) => Math.min(1, p + 0.5))
  }, [])
  const onMapFail = useCallback(() => {
    readyRef.current.mapFailed = true
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
      await waitForReady()
      if (abortedRef.current || cancelled) return
      setProgress(1)

      // Reduced motion: loader -> simple 400ms fade -> settled interior.
      if (reduced || readyRef.current.mapFailed) {
        setLoaderFading(true)
        await sleep(400)
        if (abortedRef.current || cancelled) return
        destroyMap()
        setMapAlive(false)
        setLoaderGone(true)
        setAnimateIn(false)
        setPhase('interior')
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
      markIntroSeen()
    }

    run()
    return () => {
      cancelled = true
    }
  }, [autoSkip, reduced, sleep])

  // Destroy the map if the app unmounts mid-intro.
  useEffect(() => () => destroyMap(), [])

  const openPanel = useCallback((id) => setActivePanel(id), [])
  const closePanel = useCallback(() => setActivePanel(null), [])

  const interiorShown = phase === 'interior'

  return (
    <div className="app">
      {/* Satellite map sits under the loader; destroyed during the blackout */}
      {mapAlive && <SatelliteIntro onReady={onMapReady} onFail={onMapFail} />}

      {interiorShown && (
        <InteriorStage animateIn={animateIn} onHotspot={openPanel} />
      )}

      <Blackout state={blackout} />

      {!loaderGone && !autoSkip && (
        <LoadingScreen progress={progress} fading={loaderFading} />
      )}

      {/* SKIP INTRO: visible from the very first frame until the interior shows */}
      {!interiorShown && (
        <button
          type="button"
          className="skip-intro"
          onClick={jumpToInterior}
        >
          Skip intro
        </button>
      )}

      {/* Chrome appears once we're inside the shop */}
      {interiorShown && (
        <>
          <header className="chrome">
            <Logo size="small" className="chrome__logo" />
            <button
              type="button"
              className="btn btn--primary chrome__book"
              onClick={() => openPanel('book')}
            >
              Book
            </button>
          </header>
          <BottomNav onOpen={openPanel} active={activePanel} />
        </>
      )}

      {activePanel === 'book' && <BookingPanel onClose={closePanel} />}
      {activePanel === 'barbers' && <BarbersPanel onClose={closePanel} />}
      {activePanel === 'gallery' && <GalleryPanel onClose={closePanel} />}
    </div>
  )
}
