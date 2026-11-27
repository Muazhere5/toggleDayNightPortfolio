# ProjectStatus — Forensic Architecture, Performance & Mobile UX Audit

**Project:** `toggleDayNightPortfolio` (`my-portfolio`)  
**Stack:** Next.js `16.2.4` (App Router) · React `19.2.4` · Tailwind CSS v4 · Framer Motion `12.38.0` · Lenis `1.3.23` · Firebase `12.16.0` · EmailJS `4.4.1`  
**Audit Scope:** Exhaustive static forensic review of all files across `app/`, `components/`, `lib/`, `public/`, `notes/`, and root configuration files (zero source files modified).

---

## 1. Executive Summary & Overall Health Score

This portfolio has a genuinely memorable creative concept—the **Day (Sky/Aviation) vs. Night (Space/Orbit)** dual-world experience with interactive `TestMe` challenges—and several solid defensive patterns already exist (e.g., synchronous FOUC script in `app/layout.jsx`, `IntersectionObserver`-deferred Firestore subscription in `TestMe.jsx`, and CSS-migrated cloud/star animations).

However, a deep forensic inspection reveals **serious hidden regressions** that silently degrade correctness, load speed, frame pacing, and mobile polish:
1. **Broken Tailwind v4 compilation & unlayered CSS reset** causing layout/overflow classes (`fixed`, `inset-0`, `overflow-x-hidden`) to fail silently.
2. **Severe Day-mode contrast & color bugs** in `TestMe.jsx`, `Projects.jsx`, and `Achievements.jsx` (dark `#1e293b` text on dark indigo backgrounds, white text on semi-transparent white cards, and invalid `${rgba}22` hex-alpha concatenation).
3. **100% `ssr: false` dynamic splitting on `app/page.jsx`** plus **permanently ticking animations in both mounted backgrounds**, creating a late Initial Load/LCP waterfall and continuous background GPU/JS overhead.
4. **Mobile layout clipping & tiny tap targets** in `Skills.jsx` (`SatelliteOrbitLayout` overflowing its `maxWidth: 100%` container), `Achievements.jsx` (`~10px` SVG star tap targets), and `EmailObject.jsx` (floating `mailto:` link drifting across interactive buttons).

### Overall Health Scorecard

| Audit Pillar | Score | Rating | Primary Bottlenecks |
| :--- | :---: | :---: | :--- |
| **Bug & Code Health** | **54 / 100** | Needs Urgent Fixes | Missing `@import "tailwindcss";`, Day-mode contrast regressions in `TestMe`/`Projects`, invalid `radial-gradient(135deg ...)` & `${rgba}22` CSS syntax, `ThemeContext` mount race, unintended `/DayVision` & `/NightVision` routes |
| **Performance & 60fps Smoothness** | **58 / 100** | Fair / Heavy | 100% client-only `ssr: false` landing waterfall, both `DayBackground` + `NightBackground` animating simultaneously (`opacity: 0` without pause), SVG `filter: blur(60px)` on scaling ellipses, always-on Lenis rAF + Framer infinite loops |
| **Mobile Responsiveness & UX** | **52 / 100** | Below Pro Standard | `SatelliteOrbitLayout` outer orbit clipping & `4px` scaled text, `~10px` Star Map SVG tap targets, no quick-jump mobile nav, floating `EmailObject` intercepting taps, cramped 3-button project action rows |
| **Overall Composite Score** | **55 / 100** | **Action Required** | Fixing Phase 1 & Phase 2 items will realistically elevate this site into the **88–95 / 100** tier without sacrificing any visual personality. |

---

## 2. Complete Component-by-Component Bug & Root Cause Report

### 2.1 Master Defect Summary Table

| # | File Path | Line(s) | Severity | Summary of Issue |
| :---: | :--- | :--- | :---: | :--- |
| 1 | `app/globals.css` | `1–5`, `100–104` | **Critical** | Missing `@import "tailwindcss";` + unlayered `* { margin: 0; padding: 0; }` reset |
| 2 | `app/page.jsx` | `19–26`, `34`, `44`, `78` | **Critical** | All sections use `ssr: false` (blank SSR HTML / delayed LCP) + dead Tailwind utility classes |
| 3 | `components/TestMe.jsx` | `150`, `204`, `407`, `464`, `574`, `609`, `718–750`, `841` | **Critical** | Day mode dark-indigo section background paired with dark `#1e293b` text (near-invisible text) |
| 4 | `components/Projects.jsx` | `370`, `471`, `506`, `644`, `667` | **Critical** | Day mode white text (`rgba(255,255,255,0.8–0.9)`) on light card/sky background (~1.2:1 contrast) |
| 5 | `components/Achievements.jsx` | `349–402` | **Critical** | Star Map SVG nodes (`~10px–19px` touch area) fail 44×44px tap target & lack keyboard accessibility |
| 6 | `components/Skills.jsx` | `273–306` | **High** | `SatelliteOrbitLayout` `maxWidth: 100%` clamps box to `<330px` while `OUTER_R=220px` clips outer skills on mobile |
| 7 | `app/ThemeContext.jsx` | `46–74` | **High** | Mount effect race temporarily overwrites `localStorage` & `<html>` to `night-mode` for returning Day users |
| 8 | `app/DayVision/page.jsx` & `app/NightVision/page.jsx` | File paths + `302–370` / `272–326` | **High** | Exposed as public Next.js routes (`/DayVision`, `/NightVision`) + positive `animationDelay` without `animationFillMode: 'both'` leaves planes/birds/satellites/shooting stars frozen on screen; `repeatDelay` unused |
| 9 | `components/ThreeDCharacter.jsx` | `80`, `256` | **High** | Invalid `radial-gradient(135deg at 35% 35%, ...)` syntax silently dropped by browsers |
| 10 | `components/Projects.jsx` | `37–46`, `57`, `398` | **High** | Broken `TAG_ICONS` keys (`Tailwind` vs `Tailwind CSS`), hardcoded admin credentials in public copy |
| 11 | `components/Achievements.jsx` | `184–186`, `363`, `436–455` | **High** | Invalid `${rgba}22` hex-alpha concatenation breaks badge backgrounds, borders, and card shadows |
| 12 | `components/ThemeToggle.jsx` | `120`, `134`, `147`, `152–159` | **High** | Uncleaned `setTimeout` timers inside `onClick` (dead `return () => clearTimeout`), unguarded `localStorage` |
| 13 | `components/EmailObject.jsx` | `16–40` | **High** | Permanent full-screen infinite JS animation + drifting clickable `mailto:` overlay obstructing mobile taps |
| 14 | `lib/firebase.js` & `components/TestMe.jsx` | `4–15` / `670–685` | **High** | Eager Firebase init with unvalidated env vars; unbounded `onSnapshot` without `limit()`; silent reply errors |
| 15 | `app/LenisProvider.jsx` & `components/Landing.jsx` | `18–45` / `175–178` | **Medium** | Idle-spinning Lenis rAF loop, uncanceled `requestIdleCallback`, native `scrollIntoView` conflict |
| 16 | `components/Landing.jsx` | `24–57`, `338–386`, `516–523` | **Medium** | 750ms empty `<h1>` CLS delay, harsh `WebkitTextStroke`, horizontal `OrbitStar` overflow risk |
| 17 | `app/layout.jsx` | `28`, `52–73`, `83–97` | **Medium** | 1-frame theme mismatch with `ThemeContext`, missing OpenGraph image, `@vercel/analytics/react` vs `/next` |
| 18 | `components/Skills.jsx` | `135–169`, `189–205`, `244`, `461` | **Medium** | Disconnected Kite strings, 10 injected `<style>` tags, `key={theme}` remounting, `7px` scaled-down text |
| 19 | `components/WhatsAppFooter.jsx` | `33–87` | **Medium** | Non-semantic `<div>` footer, continuous shimmer loop, bulky multi-line pill wrapping on 360px screens |
| 20 | `next.config.ts` / `README.md` / `public/` | Various | **Low** | Redundant `transpilePackages: ['framer-motion']`, stale `README.md` live link/docs, unused Next template SVGs |

---

### 2.2 Detailed File-by-File Audit

#### `app/globals.css`
- **Line 1–5 (Critical) — Missing Tailwind v4 `@import "tailwindcss";`:**
  - *Issue:* `postcss.config.mjs` loads `@tailwindcss/postcss` and `package.json` installs `tailwindcss: ^4`, yet `globals.css` omits `@import "tailwindcss";`.
  - *Root Cause:* All Tailwind utility classes (`relative`, `overflow-x-hidden`, `fixed`, `inset-0`, `z-0`, `z-10`, `pointer-events-none`, `rounded-full`, `object-cover`) across `app/page.jsx` and `components/ThreeDCharacter.jsx` are never generated in the stylesheet.
  - *Fix:* Add `@import "tailwindcss";` at line 1 of `app/globals.css`.
- **Lines 100–104 (Critical) — Unlayered Global Reset Overrides Tailwind Utilities:**
  - *Issue:* `*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }` sits outside `@layer base`.
  - *Root Cause:* In Tailwind CSS v4, utility classes live in `@layer utilities`. Unlayered rules always beat `@layer` rules in CSS specificity, wiping out any `m-*` or `p-*` Tailwind classes.
  - *Fix:* Wrap the reset in `@layer base { *, *::before, *::after { ... } }` (or remove margin/padding reset since Tailwind Preflight handles it).
- **Lines 53, 149–151, 180–188 (High) — Non-Transitionable Gradient & Duplicate `body` Rules:**
  - *Issue:* `body` is declared twice (lines 111 and 149). `transition: background 0.8s ease` cannot animate `linear-gradient(...)` values (`var(--bg-gradient)`), causing `body` background to snap while `.bg-panel` crossfades over `1.0s`.
  - *Fix:* Merge the two `body` rules, remove `background: var(--bg-gradient)` from `body` once the fixed background panels handle the sky/space gradients, and keep a solid fallback `background-color` transition (`#e6f4f8` ↔ `#000000`).
- **Lines 165–176, 293–362, 384–393 (Low) — Dead CSS Classes & Keyframes:**
  - *Issue:* `.no-transition` duplicates `.no-transitions` (only `.no-transitions` is used). Keyframes `cloudDrift`, `birdFly`, `sunPulse`, `kiteFloat`, `starTwinkle`, `shootingStar`, `planetOrbit`, `rocketFloat`, `nebulaGlow`, `cloudDriftCSS`, `orbitSpin`, `.float`, `.fade-in`, and `.nebula-blob` are unused.
  - *Fix:* Prune dead rules and consolidate active `@keyframes` from `DayVision`, `NightVision`, and `Skills.jsx` into `globals.css`.
- **Lines 418–426 (Low) — Low-Contrast Day Text Selection:**
  - *Issue:* `.day-mode ::selection` uses `#ffffff` text on `rgba(46, 134, 193, 0.3)` over light backgrounds.
  - *Fix:* Change Day selection background to `rgba(29, 114, 180, 0.85)` with `#ffffff` text (or keep light tint with `#0f172a` text).

#### `app/layout.jsx`
- **Lines 83–97 (Medium) — First-Paint Sync Gap Between Inline Script & React State:**
  - *Issue:* The `<head>` script sets `day-mode` or `night-mode` on `<html>`, while `ThemeContext.jsx` initializes `useState('night')`. Returning Day visitors get `day-mode` CSS variables on `<html>` while React's first client render paints Night components (`NightBackground`, `NightAvatar`).
  - *Fix:* Expose the resolved theme on `window.__PORTFOLIO_THEME__` in the `<head>` script or sync `Day`/`Night` visibility initially via CSS `.day-mode` / `.night-mode` selectors so zero JS state mismatch occurs on initial render.
- **Lines 28, 107 (Low) — Analytics Import Path:**
  - *Issue:* Imports from `@vercel/analytics/react` instead of `@vercel/analytics/next`.
  - *Fix:* Switch to `import { Analytics } from '@vercel/analytics/next';` for App Router route-aware telemetry.
- **Lines 52–73 (Low) — Missing `openGraph.images` & `viewport` Export:**
  - *Issue:* Social shares on LinkedIn/WhatsApp lack an OG preview image.
  - *Fix:* Add `openGraph.images` (e.g., `/assets/og/og-image.png` once generated) and export `viewport` with `themeColor` matching Day (`#1d72b4`) and Night (`#000000`).

#### `app/ThemeContext.jsx`
- **Lines 46–74 (High) — Effect Execution Order Race Overwrites `localStorage` on Mount:**
  - *Issue:* On mount, `theme` defaults to `'night'`. Effect 1 (lines 49–59) calls `setTheme(saved)` (`'day'`), while Effect 2 (lines 64–74) runs **in the same commit** with `theme === 'night'`, stripping `'day-mode'` from `<html>`, adding `'night-mode'`, and writing `'night'` to `localStorage`, before the second render flips it back to `'day'`.
  - *Root Cause:* Unconditionally persisting `theme` to `localStorage` inside a `useEffect([theme])` on initial mount before hydration reconciliation completes.
  - *Fix:* Guard DOM/storage sync with a `hasHydratedRef` or only write `localStorage.setItem` inside `toggleTheme` (never on initial mount effect).
- **Lines 34–37 (Low) — Context Default Mismatch:** `createContext` defaults to `'day'` while provider state defaults to `'night'`. Align both to `'night'`.
- **Lines 84–102 (Medium) — Untracked Nested `setTimeout` & Transition Timing:**
  - *Issue:* `const onReady = () => { setTimeout(remove, 100); }` creates an untracked timer ID that isn't cleaned up on unmount.
  - *Fix:* Store `innerTimer` in a mutable variable in the effect closure and clear both timers in cleanup.

#### `app/LenisProvider.jsx`
- **Lines 18–48 (Medium) — Permanent Idle rAF Loop & Uncancelled `requestIdleCallback`:**
  - *Issue:* `raf` calls `requestAnimationFrame(raf)` continuously at 60–120Hz even when no scroll inertia is active or the tab is hidden; `window.requestIdleCallback(startRaf)` is never cancelled via `cancelIdleCallback` on cleanup; `wheelEventsTarget: window` is redundant.
  - *Fix:* Store and cancel the `idleId` in cleanup (`cancelIdleCallback`), add a `visibilitychange` pause listener, or better yet, enable `autoRaf: true` (supported in Lenis `1.3.x`) / remove Lenis entirely in favor of native CSS `scroll-behavior: smooth` + `overscroll-behavior` to eliminate permanent rAF ticks. Also expose the Lenis instance (or remove it) so `Landing.jsx` doesn't fight it with native `scrollIntoView`.

#### `app/page.jsx`
- **Lines 19–26 (Critical) — `ssr: false` on Every Component Destroys SSR HTML & Delays LCP:**
  - *Issue:* `ThemeToggle`, `Landing`, `Skills`, `Projects`, `Achievements`, `TestMe`, `WhatsAppFooter`, and `EmailObject` all use `dynamic(..., { ssr: false })`.
  - *Root Cause:* Because `HomePage` is `'use client'` and dynamically disables SSR for every section, the server sends an empty `<main>` shell. The browser must download and parse React + Next runtime + `page.jsx` before it even **discovers** `Landing.jsx` and `muazdp.png`.
  - *Fix:* Render `Landing` (above the fold) as a standard SSR-enabled import so `<h1>`, bio, CTAs, and `<Image>` preload immediately in the initial HTML document. Keep `dynamic(..., { ssr: false })` only for non-critical, below-the-fold client-only widgets (`TestMe` with Firebase/EmailJS, `EmailObject`, and deferred `Background` layers).
- **Lines 44–72 (High) — Both Animated Backgrounds Always Active Simultaneously:**
  - *Issue:* Comment cites `contain: strict` (whereas `globals.css` uses `contain: layout style`), and the inactive background uses only `opacity: 0`.
  - *Root Cause:* `opacity: 0` hides pixels visually, **but does not pause CSS animations (`animation-play-state`) or Framer Motion JS loops**, and keeps `visibility: visible` compositing layers alive.
  - *Fix:* Add a `.bg-paused * { animation-play-state: paused !important; }` class + `visibility: hidden` (delayed until after the `1s` opacity fade) on the inactive panel, and pass `isActive={isDay}` / `isActive={!isDay}` so Framer Motion stops ticking inactive planets/kites/sun.

#### `app/DayVision/page.jsx` & `app/NightVision/page.jsx`
- **Architectural Bug (High) — Accidental Public Routes `/DayVision` and `/NightVision`:**
  - *Issue:* Because these components are named `page.jsx` inside `app/DayVision/` and `app/NightVision/`, Next.js App Router compiles them as standalone pages accessible at `/DayVision` and `/NightVision`.
  - *Fix:* Move them to `components/backgrounds/DayBackground.jsx` and `components/backgrounds/NightBackground.jsx` and delete the `app/DayVision` and `app/NightVision` route folders.
- **`app/DayVision/page.jsx` Lines 302–370 (High) — Birds, Planes & Streaks Frozen On-Screen During Delay:**
  - *Issue:* `birdFlocks` (delays `4s–28s`), `planes` (delays `10s–55s`), and `light streaks` (delays `3s–24s`) lack `animationFillMode: 'both'` (or `'backwards'`) and have no initial off-screen transform.
  - *Root Cause:* Until each element's positive `animationDelay` expires, CSS renders it at its static `left: 0` position inside the viewport—meaning fighter jets, a private plane, bird flocks, and white bars sit visibly pinned to the left edge of the screen for up to 55 seconds!
  - *Fix:* Use negative `animationDelay` (`-${delay}s`) + `animationFillMode: 'both'` (matching `clouds` at line 291), or set initial `left: '-140px'` / `opacity: 0`.
- **`app/NightVision/page.jsx` Lines 272–326 (High) — Frozen Satellites & Broken Shooting Star `repeatDelay`:**
  - *Issue:*
    1. Satellites (`5s` and `25s` delay) omit `animationFillMode: 'both'`, leaving them stuck at `left: 0` (`top: 25%` / `60%`) for 5–25 seconds.
    2. Shooting stars destructure `repeatDelay` (line 311) and **never use it**. Instead, `animationDuration` is `1.0s–1.3s`, so after a 3–28s delay (during which static 120px white lines sit frozen at `left: 75%`!), shooting stars fire continuously every `1.0s` instead of once every `40–58s`.
  - *Fix:* Encode the idle pause inside a long keyframe (e.g., `duration: 42s` where `0%–3%` animates the streak and `3.1%–100%` stays `opacity: 0`), use negative `animationDelay`, and add `animationFillMode: 'both'`.
- **`app/NightVision/page.jsx` Lines 117–122 & 210–229 (High) — Heavy SVG `filter: blur(60px)` + Wasted Offscreen Stars:**
  - *Issue:* `.nebula-ellipse` animates `transform: scale()` on 5 large SVG ellipses with `filter: blur(60px)`. Also `generateStars` generates `y: rand() * 130` inside a `height: 130%` SVG clipped by `overflow: hidden`, wasting ~28 off-screen animated `<circle>` nodes.
  - *Fix:* Replace SVG `filter: blur(60px)` ellipses with pre-softened static CSS `radial-gradient()` divs (zero blur filter rasterization), and clamp `y` to `0–100%`.
- **`app/NightVision/page.jsx` Lines 232–264 (Low) — Top-Right Overlap:** `PlanetRinged` (`top: 6%, right: 5%`) and `Rocket` (`top: 15%, right: 10%`) cluster directly behind the fixed `ThemeToggle` (`top: 20px, right: 20px`).

#### `components/ThemeToggle.jsx`
- **Lines 152–159 (High) — Uncleaned Timers & Race on Rapid Toggles:**
  - *Issue:* `handleToggle` returns `() => clearTimeout(t1)` and `() => clearTimeout(t2)` from inside `setTimeout` / `onClick`—React ignores return values of `onClick` handlers, so `clearTimeout` is never called. Rapid clicks cause overlapping burst resets.
  - *Fix:* Store timer IDs in `useRef`, clear existing timers at the start of `handleToggle`, and clear them in a `useEffect` unmount cleanup.
- **Lines 120, 147 (Medium) — Unguarded `localStorage` Access:**
  - *Issue:* Unlike `ThemeContext.jsx`, lines 120 and 147 call `localStorage.getItem` / `setItem` without `try/catch`, crashing in restricted storage contexts.
  - *Fix:* Wrap both in `try/catch`.
- **Lines 125–138 (Medium) — Non-Passive Scroll Listener:**
  - *Issue:* `window.addEventListener('scroll', handleScroll)` lacks `{ passive: true }` and reads `window.scrollY` on every scroll event.
  - *Fix:* Add `{ passive: true }` and track a boolean ref so `setShowNudge` only triggers when crossing the `300px` threshold.
- **Lines 73–102, 330 (Medium) — Dead `<AnimatePresence>` Inside `Burst`:**
  - *Issue:* `Burst` is conditionally rendered `{bursting && <Burst />}`—unmounting the parent kills `<AnimatePresence>` before any exit can occur.
  - *Fix:* Put the conditional `{bursting && ...}` *inside* `<AnimatePresence>` or trigger CSS-only keyframe burst particles.
- **Lines 291–295 (Low) — Redundant `layout` Prop:** Remove `layout` from the sliding thumb `<motion.div>` since `animate={{ x }}` already handles the horizontal spring translation.

#### `components/Landing.jsx`
- **Lines 24–57 & 359–372 (Medium) — 750ms Blank `<h1>` Delay Causes CLS on Mobile:**
  - *Issue:* `useTypingEffect` starts with `''`, waits `750ms`, then types `"Abdullah Al Muaz"` over `1.44s`. During the first `750ms`, the `<h1>` has only 1 line of cursor height; on narrow screens, when `"Abdullah Al Muaz"` wraps to 2 lines, everything below jumps downward (Layout Shift).
  - *Fix:* Reserve `minHeight` (or render the full text invisibly behind an `aria-label`ed animated overlay) and shorten `startDelay` to `150ms` so the name appears fast and never shifts layout.
- **Lines 175–178 (Medium) — Native `scrollIntoView` Conflicts with Lenis:**
  - *Issue:* `el.scrollIntoView({ behavior: 'smooth' })` fights Lenis's smooth-scroll loop.
  - *Fix:* Dispatch scroll through Lenis (`lenis.scrollTo('#projects')`) or replace Lenis with native CSS smooth scroll.
- **Lines 338, 351, 366, 379 (Medium) — Day Mode Typography Contrast & Muddy Text Stroke:**
  - *Issue:* `WebkitTextStroke: '0.5px rgba(0,0,0,0.4)'` makes light `Rajdhani`/`Nunito` glyphs look jagged; bio copy (`rgba(255,255,255,0.82)`) and tags (`rgba(255,255,255,0.95)` on `rgba(255,255,255,0.22)`) over `#87CEEB` / `#b8e4f7` fail WCAG AA 4.5:1 contrast.
  - *Fix:* Remove `WebkitTextStroke` and use deep slate (`#0f172a` / `#1e293b`) with frosted pill backdrops (`rgba(255,255,255,0.78)`) in Day mode.
- **Lines 516–523 (Medium) — `OrbitStar` Horizontal Overflow Risk:**
  - *Issue:* `OrbitStar` orbits at `radius={170}` (`340px` diameter) inside a `320px` container, extending beyond `360px` viewports with `24px` padding when `overflow-x-hidden` is broken.
  - *Fix:* Fix Tailwind CSS import and scale orbit star radii proportionally on `<420px` screens.

#### `components/ThreeDCharacter.jsx`
- **Lines 80 & 256 (High) — Invalid `radial-gradient(135deg ...)` Syntax:**
  - *Issue:* Both `DayAvatar` and `NightAvatar` declare `background: 'radial-gradient(135deg at 35% 35%, ...)'`. Angles (`135deg`) are invalid in `radial-gradient` and cause browsers to ignore the entire `background` property.
  - *Fix:* Change to `radial-gradient(circle at 35% 35%, ...)` (or `ellipse at 35% 35%`).
- **Lines 44–69, 200–210 (Medium) — Continuous Blurred Div Scaling:**
  - *Issue:* Infinite Framer Motion `scale` on `filter: blur(18px/20px)` elements inside the avatar card.
  - *Fix:* Use unblurred radial-gradient layers with CSS `opacity` pulse only.
- **Lines 89–97, 265–273 (Low) — Deprecated `priority` & Missing `sizes` on `next/image`:**
  - *Issue:* `priority` is deprecated in Next.js 16 and ineffective inside `ssr: false` components; missing `sizes="110px"` prevents optimal srcset sizing.
  - *Fix:* Add `sizes="(max-width: 768px) 100px, 110px"` and move `Landing` back to SSR with `preload` / `fetchPriority="high"`.

#### `components/Skills.jsx`
- **Lines 273–306 (High) — `SatelliteOrbitLayout` Clipped Outer Ring on Mobile:**
  - *Issue:* `containerSize` is `560px`, `OUTER_R` is `220px` (ring + badge = `488px` total span). `.orbit-container` sets `width: 560px; maxWidth: 100%;`—on a `375px` screen (`327px` inner width), `maxWidth: 100%` shrinks `.orbit-container`'s width to `327px` (`center = 163.5px`), so icons orbiting at `220px` radius go outside the box and get clipped by `.orbit-container-wrapper { overflow: hidden }` before `transform: scale(0.55)` shrinks it further!
  - *Fix:* Remove `maxWidth: '100%'` from `.orbit-container` (keep fixed `560×560px` scaled via CSS `zoom` or wrapper-measured `transform: scale(...)` inside a `320px` height box), OR better: render a dedicated responsive Orbit Grid / concentric compact view on `< 640px`.
- **Lines 183–255 (High) — 10 Injected `<style>` Tags & Illegible `4px` Mobile Text:**
  - *Issue:* Each `OrbitIcon` injects its own `<style>` tag with unique `@keyframes`. On `< 450px`, `scale(0.55)` turns `0.45rem` (`7.2px`) labels into `~3.96px` and `44px` icons into `~24px`.
  - *Fix:* Use 1 shared CSS `@keyframes orbitRotate` driven by CSS custom properties (`--start-angle`, `--orbit-r`), and on mobile switch to a touch-friendly radial/pill card grid with `12px+` labels.
- **Lines 134–169 (Medium) — Disconnected Kite String Metaphor:**
  - *Issue:* `KiteTop` renders beside Row 1 inside a wrapping flex row, leaving small vertical brown bars hovering above each badge unconnected to the kite.
  - *Fix:* Center `KiteTop` above the grid with a subtle SVG/CSS curved main kite line connecting the rows.
- **Lines 460–468 (Medium) — `key={theme}` Unmounts/Remounts Entire Section on Toggle:**
  - *Issue:* Switching themes destroys and recreates the whole `Skills` visual tree and re-parses 10 `<style>` tags.
  - *Fix:* Render smoothly or animate CSS opacity without re-triggering `whileInView` entrance delays.

#### `components/Projects.jsx`
- **Lines 370, 471, 506, 644, 667 (Critical) — Unreadable Day-Mode White Text on Light Card/Sky:**
  - *Issue:* Card descriptions (`rgba(255,255,255,0.8)`), `GitHub`/`Server` buttons (`rgba(255,255,255,0.9)` transparent), and bottom `"View All on GitHub"` link (`rgba(255,255,255,0.85)`) sit on `rgba(255,255,255,0.48)` cards and light `#87CEEB` sky—nearly invisible (~1.2:1 contrast).
  - *Fix:* Use `#1e293b` / `#334155` for Day card copy and `#1d72b4` with `rgba(255,255,255,0.82)` solid/frosted pill fills for Day buttons.
- **Lines 37–46, 398 (High) — Broken `TAG_ICONS` Key Lookup:**
  - *Issue:* `TAG_ICONS` maps `'Tailwind'` and `'JavaScript'`, whereas `PROJECTS` uses `'Tailwind CSS'`, `'JavaScript (ES6)'`, `'Vite'`, `'Firebase Auth'`, `'JWT'`, `'Stripe'`, `'DaisyUI'`, `'MongoDB Atlas'`, `'Firebase Admin SDK'`, `'Recharts'`. `TAG_ICONS[tag]` is `undefined` for most tags, yet an empty `<span>` with `gap: 5px` still renders.
  - *Fix:* Expand `TAG_ICONS` (including `SiVite`, `SiFirebase`, `SiStripe`, `SiDaisyui`, `SiJsonwebtokens`) and conditionally render the icon `<span>` only when `TAG_ICONS[tag]` exists.
- **Line 57 (High) — Hardcoded Admin Credentials in Public Card Copy:**
  - *Issue:* `(Admin Login: james_cosmo@gameofthron.com / 7654321)` is embedded inside `StyleDecor` description.
  - *Fix:* Remove raw admin credentials from portfolio copy or move demo evaluation instructions into a dedicated read-only demo modal/role switcher on the StyleDecor site itself.
- **Lines 91, 405–518 (Medium) — Missing `HERO.IO` Repo Link & Cramped 3-Button Row on Mobile:**
  - *Issue:* `HERO.IO` has `githubUrl: ''`; 3 `flex: 1` buttons on `StyleDecor` and `Habit Tracker` squeeze to `~80px` each on `360px` phones.
  - *Fix:* Allow `flexWrap: 'wrap'` with `minWidth: '110px'` on secondary action buttons and add the `HERO.IO` GitHub link if available.

#### `components/Achievements.jsx`
- **Lines 349–402 (Critical) — Tiny Star Map Tap Targets (`~10px`) & Zero Keyboard Accessibility:**
  - *Issue:* In `StarMapAchievements`, clickable SVG `<g>` nodes have inner star circles of `r={1.5}` (`~9.6px` diameter on mobile) and glow rings of `r={3}` (`~19px`), far below the `44×44px` mobile minimum, with no `role="button"`, `tabIndex={0}`, or `onKeyDown`.
  - *Fix:* Add an invisible hit-target `<circle r={8} fill="transparent" />` (and/or interactive horizontal milestone pill tabs below the star map on mobile) plus full keyboard/ARIA support.
- **Lines 184–186, 363, 436–455 (High) — Invalid `${rgba}22` Color Concatenation:**
  - *Issue:* Appending hex alpha (`22`, `44`, `18`, `55`) onto `rgba(...)` strings creates invalid CSS (`rgba(100,160,220,0.8)22`), causing category pill backgrounds/borders and active card borders/shadows to fail silently.
  - *Fix:* Store RGB triplets or hex colors in `TYPE_CONFIG` (e.g., `hex: '#64a0dc'`) or separate `color` / `bg` / `border` fields.
- **Lines 168–175, 379–388 (High) — Infinite `filter: drop-shadow` Animation:**
  - *Issue:* Both `CloudBannerCard` and `StarMapAchievements` animate `filter: drop-shadow(...)` continuously via Framer Motion JS loops.
  - *Fix:* Replace with static CSS `text-shadow` / `box-shadow` or simple `transform: scale()` on hover/active state only.
- **Lines 130–157 (Medium) — Fixed `280px` Width & Staggered Margin on Mobile:**
  - *Fix:* Use `width: '100%'; maxWidth: '340px'` centered on `< 640px` screens instead of fixed `280px` staggered margins.

#### `components/TestMe.jsx` & `lib/firebase.js`
- **Lines 718–724 vs 745–757, 150, 204, 407, 464, 574, 609, 841 (Critical) — Day Mode Dark Indigo Backdrop vs. Dark `#1e293b` Text:**
  - *Issue:* `<section id="testme">` applies a dark indigo/purple gradient (`rgba(30,27,75,0.9)`) in Day mode and `SolvedCard` uses `rgba(15,23,42,0.45)`, while headings, quotes, CTA buttons, category labels, submit buttons, and empty states still render `color: '#1e293b'` (dark charcoal on dark indigo!). Meanwhile category badges (`lines 185, 245, 274`) render dark blue on dark indigo, and `RepliesSection` (`lines 105–132`) ignores `isDay` almost completely.
  - *Fix:* Either restore a true light Sky-glass palette in Day mode (matching the rest of the portfolio) OR switch all Day-mode text inside `TestMe` to light `#f8fafc` / `#e2e8f0` with proper contrast tokens.
- **Lines 4–15 (`lib/firebase.js`) & 670–685 (`TestMe.jsx`) (High) — Missing Env Guard & Unbounded Firestore Query:**
  - *Issue:* Missing `NEXT_PUBLIC_FIREBASE_*` env vars cause unguarded `initializeApp` / `onSnapshot` errors; `collection(db, 'problems')` fetches all docs with no `query(..., orderBy(...), limit(20))`. Also `handleReply` (`lines 90–101`) silently fails without restoring input text or alerting the user, lacks `Enter`-key submit, and uses `Date.now()` for keys.
  - *Fix:* Guard `lib/firebase.js` when env vars are absent, wrap `handleReply` & `handleStar` with `withTimeout` + inline error banner, use `crypto.randomUUID()` for reply IDs, add `limit(25)` to Firestore query, and convert `RepliesSection` input row into a `<form>` with `minWidth: 0` on `<input>`.

#### `components/EmailObject.jsx`
- **Lines 16–40 (High) — Permanent Cross-Screen Moving Tap Trap & Constant JS Animation:**
  - *Issue:* Fixed `zIndex: 50` floating `mailto:` link sweeps across `65vh–80vh` forever via Framer Motion JS loops, overlapping interactive buttons/forms on mobile and running continuous `y` & `rotate` loops even during the `18s` horizontal `repeatDelay`.
  - *Fix:* Replace with a clean static/docked floating Mail action pill (or pause/hide on mobile `< 768px` since `Landing.jsx` and `Skills.jsx` already provide direct email links).

#### `components/WhatsAppFooter.jsx`
- **Lines 10–89 (Medium) — Non-Semantic Container & Mobile Pill Overflow:**
  - *Issue:* Uses `<div>` instead of `<footer>`, runs an infinite Framer shimmer loop, and wraps `"Knock me on WhatsApp directly"` awkwardly on `360px` phones due to `padding: '16px 42px'`.
  - *Fix:* Use semantic `<footer>`, replace Framer shimmer with CSS `@keyframes` (paused when off-screen or reduced-motion), and tighten mobile padding (`12px 20px`) with responsive copy (`Chat on WhatsApp`).

#### `next.config.ts`, `README.md`, `public/`
- **Low Issues:**
  - `next.config.ts` line 19: `transpilePackages: ["framer-motion"]` unnecessarily re-transpiles ESM `framer-motion` v12.
  - `README.md` lines 7, 16: Still shows placeholder `[View Live Portfolio](#)` and outdated `AnimatePresence` description.
  - `public/`: Contains 5 unused starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).

---

## 3. Performance, Lag & Buffering Bottlenecks + Creative Solutions

Ranked from **highest impact on Initial Load / 60fps smoothness** to lowest:

### Rank 1 (Critical Impact): 100% `ssr: false` Dynamic Import Waterfall in `app/page.jsx`
- **Bottleneck:** Every component (`Landing`, `ThreeDCharacter`, `Skills`, `Projects`, `Achievements`, `TestMe`, `WhatsAppFooter`, `EmailObject`, `ThemeToggle`, `DayBackground`, `NightBackground`) is loaded via `next/dynamic(..., { ssr: false })` inside a `'use client'` `HomePage`.
- **Why It Lags:** The browser receives blank HTML, downloads the core bundle, executes React, and *then* fires a waterfall of 11 separate JS chunk requests before the Hero `<h1>` or `muazdp.png` can even begin rendering. `TestMe` also triggers eager loading of the entire **Firebase Firestore SDK (`~150KB+`)** and **EmailJS** on initial page load even though `#testme` is at the very bottom of the page.
- **Creative Solution:**
  - Make `Landing.jsx` (and `ThreeDCharacter.jsx`) **normal SSR-rendered components** so the Hero HTML, fonts, and avatar image paint on First Contentful Paint (FCP) with zero chunk waterfall.
  - Dynamically load `TestMe` (which pulls in `firebase/firestore` and `@emailjs/browser`) **only when scrolled near `#testme`** using an `IntersectionObserver` wrapper in `page.jsx` (true lazy bundle splitting, not just `ssr: false` on mount!).

### Rank 2 (Critical Impact): Dual Permanently Mounted Animated Backgrounds (`DayVision` + `NightVision`)
- **Bottleneck:** Both `DayBackground` and `NightBackground` stay mounted at all times, toggled only by `opacity: 1` vs `opacity: 0`.
- **Why It Lags:** CSS `opacity: 0` does **not** stop CSS `@keyframes` or Framer Motion JS `requestAnimationFrame` loops. On every frame, the browser ticks **both** the Day sky (Sun, Kite, Balloon, 5 clouds, 3 bird flocks, 3 planes, 4 streaks) **and** the Night sky (120 twinkling stars, 5 blurred nebula ellipses, 3 planets, Rocket, 2 satellites, 4 shooting stars) simultaneously!
- **Creative Solution:**
  - Keep both mounted for instant zero-jank crossfading, **but immediately pause all animations on the inactive panel** via CSS:
    ```css
    .bg-paused, .bg-paused * { animation-play-state: paused !important; }
    ```
  - Apply `visibility: hidden` after the `1s` fade transition (`transition: opacity 1s ease, visibility 0s linear 1s`) and pass `isActive` to pause Framer Motion infinite loops (`animate={isActive ? ... : false}`).
  - Even better: **defer mounting the inactive background** until the first hover/focus on `<ThemeToggle>` or `requestIdleCallback` (`2s` after initial paint), cutting initial DOM node count and GPU layer memory in half!

### Rank 3 (High Impact): Full Framer Motion Bundle + 25+ Infinite JS Animations
- **Bottleneck:** `framer-motion` (`~40KB+` gzipped full feature bundle) is imported across 9 components, and **25+ components run `repeat: Infinity` JS-driven animations** simultaneously (`Sun`, `Kite`, `HotAirBalloon`, `PlanetRinged`, `PlanetSmall` ×2, `Rocket`, `OrbitStar` ×4, `MiniCloud` ×2, Hero button shimmers ×2, `DayAvatar`/`NightAvatar` blurs & dots, `ProjectPreview` dots ×9, `CloudBannerCard` `drop-shadow` ×5, `StarMap` `drop-shadow` ×5, `EmailObject`, `WhatsAppFooter` shimmer).
- **Why It Lags:** Framer Motion's `repeat: Infinity` animations wake up the JS main-thread `frameloop` every single 16.6ms (or 8.3ms on 120Hz phones) forever, competing with scroll handlers and user taps.
- **Creative Solution:**
  1. Wrap the app in `<LazyMotion features={domAnimation} strict>` and replace `motion.*` with `m.*`, trimming Framer Motion's runtime bundle by **~50%**.
  2. Convert **all decorative ambient loops** (avatar bobbing, mini clouds, orbit stars, button shimmers, 3-dot loaders, WhatsApp shimmer) to pure CSS `@keyframes` on `transform`/`opacity` so the JS thread sleeps at **0% CPU** when the user isn't interacting.
  3. Use `IntersectionObserver` / `useInView` so off-screen section CSS loops pause when scrolled out of view.

### Rank 4 (High Impact): Expensive GPU Filters (`filter: blur(60px)`, `backdrop-filter: blur(18px)`, `filter: drop-shadow`)
- **Bottleneck:**
  - `NightVision`: 5 large SVG ellipses with `filter: blur(60px)` animating `transform: scale()`.
  - `Projects`, `Achievements`, `TestMe`, `Skills`, `Landing`: 20+ overlapping elements using `backdrop-filter: blur(10px–18px)` over animated clouds/stars.
  - `Achievements`: Infinite Framer Motion keyframes on `filter: drop-shadow(...)`.
- **Why It Lags:** Animating `scale` under a `60px` CSS blur forces continuous GPU offscreen buffer reallocation. Combining `backdrop-filter: blur()` over continuously moving background layers forces the compositor to re-blur the backdrop region every frame during scrolling or background drift—the classic cause of **mobile Safari/Chrome scroll stutter ("buffering")**.
- **Creative Solution:**
  - Replace the 5 blurred SVG `<ellipse>` nodes in `NightVision` with pre-feathered static `radial-gradient(circle, color 0%, transparent 70%)` divs (**zero `filter: blur()`**, identical nebula glow at 10× higher frame rate).
  - Cap `backdrop-filter` on mobile (`@media (max-width: 768px)`) to `blur(6px)` or solid translucent frosted backgrounds (`rgba(255,255,255,0.88)` / `rgba(10,12,28,0.88)`) for cards—dramatically reducing GPU overdraw while actually improving text legibility.
  - Eliminate animated `filter: drop-shadow()` in `Achievements.jsx`.

### Rank 5 (Medium Impact): Lenis Always-On rAF Loop + `scrollIntoView` Fighting + `react-icons` Imports
- **Bottleneck:** `LenisProvider.jsx` runs `lenis.raf(time)` on every animation frame forever, even at rest, and `Landing.jsx` triggers native `scrollIntoView({ behavior: 'smooth' })`. Also `app/layout.jsx` loads 12 font weights across 3 Google Fonts (`Orbitron` ×4, `Rajdhani` ×5, `Nunito` ×4).
- **Creative Solution:**
  - Remove Lenis (or gate its rAF loop on active wheel/scroll events and pause on `document.hidden`)—modern browsers already have crisp native momentum scrolling on touch and `scroll-behavior: smooth` on desktop without a 60–120fps JS ticker.
  - Trim unused Google Font weights (e.g., `Rajdhani` `300`/`500`, `Nunito` `300`) to cut font download payload by ~30%.
  - Remove `transpilePackages: ["framer-motion"]` from `next.config.ts`.

---

## 4. Honest Mobile Responsiveness & UX Review (`360px` – `430px` Viewports)

Let's be candid: the portfolio looks imaginative on a desktop monitor, **but on a real 360px–390px smartphone (iPhone SE, Galaxy A-series, iPhone 15), it currently feels scaled-down rather than mobile-designed**. Here is an honest, section-by-section critique:

### 4.1 Global Mobile Layout & Ergonomics
- **Broken Overflow Guard:** Because `@import "tailwindcss";` is missing, `overflow-x-hidden` on `<main>` does not apply, leaving mobile viewports vulnerable to horizontal rubber-banding when absolute/orbiting elements cross viewport edges.
- **No Mobile Navigation:** On mobile, the page spans roughly 6–8 screen heights (`Landing` → `Skills` → `Projects` → `Achievements` → `TestMe` → `WhatsApp`). Without a compact bottom bar or top pill nav, a recruiter on a phone has to thumb-scroll blindly to reach `Projects` or `Resume`.
- **Fixed Top-Right `<ThemeToggle>` (`top: 20px; right: 20px`):** In the top-right corner, it sits **outside the natural one-handed thumb zone** (bottom 40% of the screen) and floats directly over the `Kite`/`PlanetRinged`/`Rocket` and top padding of the Hero section. Its nudge toast (`maxWidth: calc(100vw - 40px)`) covers the upper viewport when triggered past `300px` scroll.

### 4.2 Component-by-Component Mobile Critique
- **`Landing.jsx` & `ThreeDCharacter.jsx`:**
  - Above-the-fold balance is tight on `375×667px` (iPhone SE): `padding: '80px 24px 40px'` + stacked text (`gap: 14px`) + `36px` gap + `380px`-tall `bubbleWrapStyle` pushes the `ThreeDCharacter` card and `ScrollIndicator` below the fold.
  - `OrbitStar` (`radius: 170px` = `340px` width) nearly touches or exceeds the `360px` viewport edges.
  - The 750ms blank `<h1>` typing wait leaves an awkward empty space above the bio on first glance, followed by a sudden 2-line wrap shift when `"Abdullah Al Muaz"` finishes typing.
  - CTA buttons (`Explore My Work` / `Direct Mail`) stack or wrap cleanly via `flexWrap: 'wrap'`, though centered alignment (`landing-text`) looks slightly off-balance if one button wraps onto a second line without `justifyContent: 'center'`.
- **`Skills.jsx`:**
  - **Night Mode (`SatelliteOrbitLayout`) is severely compromised on mobile:** Scaling a `560px` orbital diagram down via `scale(0.55)` while `maxWidth: 100%` clips the outer ring icons (`Tailwind`, `DaisyUI`, `Firebase`, `Supabase`) off the left/right edges, shrinks badges to `~24px`, and reduces labels to `~4px` unreadable specks!
  - **Day Mode (`KiteStringLayout`):** `KiteTop` sits beside the first 3 badges rather than anchoring the top, and `3 + 4 + 3` rows wrap unevenly on `360px` (`72px + padding` badges wrap 2-per-row or 3-per-row leaving orphan rows with floating disconnected string stubs).
- **`Projects.jsx`:**
  - **Critical Day Mode Readability Failure:** White description text (`rgba(255,255,255,0.8)`) on `rgba(255,255,255,0.48)` cards is nearly illegible under mobile sunlight/glare.
  - **Action Buttons:** `StyleDecor` and `Habit Tracker` cram 3 `flex: 1` buttons (`Live Demo`, `GitHub`, `Server`) into a single row (`~80px` wide each on a `360px` screen), causing tight text wrapping and narrow touch width.
  - **Mock Previews:** `210px`-tall placeholders saying `"preview available soon"` consume half a mobile screen height without showing real screenshots of the apps.
- **`Achievements.jsx`:**
  - **Night Mode (`StarMapAchievements`):** Tapping `~10px–19px` SVG stars on a `180px`-tall canvas with a thumb is frustratingly imprecise—users miss the node and think the map isn't interactive.
  - **Day Mode (`CloudBannerCard`):** Hardcoded `280px` alternating left/right staggered cards look cramped on `360px` phones (only `32px` stagger room) and leave awkward empty space on one side.
- **`TestMe.jsx`:**
  - **Day Mode Color Clash:** `#1e293b` dark text inside the dark indigo `#testme` section makes `"Test Me"`, solved challenge quotes, category titles, and CTA buttons almost unreadable on mobile.
  - **Form & Keyboard UX:** Category selector collapses into 7 tall full-width stacked cards; no compact 2-column grid (`minmax(140px, 1fr)`). Inside `RepliesSection`, the `<input>` lacks `minWidth: 0`, risking horizontal push on the `POST` button at `360px`. Soft mobile keyboard opening over the bottom-positioned form can obscure the character counter and submit button without auto-scroll-into-view.
- **`EmailObject.jsx` & `WhatsAppFooter.jsx`:**
  - `EmailObject` drifting across `65vh–80vh` on a small screen is a **mobile anti-pattern**: it crosses directly over tap targets (`Live Demo`, `StarMap`, `TestMe` inputs) and risks accidental `mailto:` launches while scrolling.
  - `WhatsAppFooter` pill (`padding: 16px 42px`) wraps `"Knock me on WhatsApp directly"` onto multiple lines, making a tall awkward oval on `360px` viewports.

### 4.3 Creative Mobile Upgrade Blueprint

1. **Thumb-Zone Bottom Dock (Mobile `< 768px`):**
   - Add a sleek frosted bottom pill dock (`position: fixed; bottom: max(12px, env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%)`) with 4 quick-jump icons (`Home`, `Skills`, `Projects`, `TestMe`) + an integrated compact **Day/Night Toggle** right in the thumb zone, freeing the top-right corner of the hero!
2. **Adaptive `Skills` Mobile Modes (Replace `scale(0.55)`):**
   - **Night Mode (`< 640px`):** Replace the scaled-down `560px` orbit with a crisp **"Mission Control Orbital List"**—3 grouped horizontal orbital tiers (`Core Orbit`, `Backend Ring`, `Cloud & UI`) with `44px+` touch pills and subtle orbital ring accents.
   - **Day Mode (`< 640px`):** Center `KiteTop` at the top with a vertical sky-line spine connecting a clean 2-column grid of swaying skill badges (`min-height: 44px`).
3. **Touch-First `Achievements` Star Map:**
   - Keep the SVG constellation visual on top, add `r={8}` invisible hit circles around every star, **AND** render a horizontally scrollable row of `44px`-tall `#01`–`#05` numbered milestone pills directly beneath the SVG so mobile users can tap effortlessly with one thumb.
4. **Mobile GPU Performance Profile:**
   - Hide `EmailObject` on `< 768px` (`display: none`), reduce `NightBackground` to 45 static/twinkling stars with zero `filter: blur()`, cap card `backdrop-filter` at `6px`, and respect `@media (prefers-reduced-motion: reduce)`.
5. **Fluid Mobile Spacing & Typography:**
   - Set `input, textarea { font-size: 16px; }` on mobile in `TestMe.jsx` so iOS Safari does **not** auto-zoom the viewport when focusing inputs (`font-size: 0.9rem` / `0.95rem` currently triggers iOS zoom!).
   - Use 2-column compact category tiles (`minmax(135px, 1fr)`) in `TestMe` and stack/wrap project action buttons cleanly (`Live Demo` full-width primary pill on top, `GitHub` + `Server` 50/50 below on `< 420px`).

---

## 5. Prioritized Master Action Plan

### Phase 1: Critical Bugs & Accessibility Fixes (Do First)
1. **Fix Tailwind v4 & CSS Layering (`app/globals.css`):** Add `@import "tailwindcss";` at line 1 and wrap `* { margin: 0; padding: 0; box-sizing: border-box; }` inside `@layer base { ... }`.
2. **Fix Day-Mode Unreadable Text Contrast (`components/TestMe.jsx`, `components/Projects.jsx`, `components/Landing.jsx`):**
   - In `TestMe.jsx`, reconcile the Day mode indigo backdrop vs. `#1e293b` text (either use light Sky glass cards with dark text, or switch Day text inside `#testme` to `#f8fafc`).
   - In `Projects.jsx`, change Day card description and secondary button text from `rgba(255,255,255,0.8–0.9)` to `#1e293b` / `#334155` / `#1d72b4`.
3. **Fix Broken CSS & Color Syntax:**
   - `ThreeDCharacter.jsx` (lines 80, 256): Replace `radial-gradient(135deg at ...)` with `radial-gradient(circle at 35% 35%, ...)`.
   - `Achievements.jsx` (lines 184, 363, 436–455): Fix invalid `${rgba}22` hex concatenation using explicit RGB/hex config tokens.
   - `Projects.jsx` (lines 37–46, 398): Fix `TAG_ICONS` key names (`Tailwind CSS`, `JavaScript (ES6)`, etc.) and guard missing icons; remove exposed admin credentials from `StyleDecor` copy.
4. **Fix Background Route Exposure & Animation Delay Bugs:**
   - Move `app/DayVision/page.jsx` and `app/NightVision/page.jsx` out of `app/` into `components/backgrounds/`.
   - Add `animationFillMode: 'both'` + negative delays on birds, planes, streaks, and satellites; bake `repeatDelay` into the shooting-star CSS keyframe duration.
5. **Fix `ThemeContext.jsx` Mount Race & `ThemeToggle.jsx` Timer Leaks:**
   - Only write `localStorage` in `toggleTheme` (not on mount effect); store `ThemeToggle` timer IDs in refs, wrap `localStorage` in `try/catch`, and add `{ passive: true }` to the scroll listener.
6. **Harden `lib/firebase.js` & `TestMe.jsx`:** Guard missing env vars gracefully, add `limit(25)` to Firestore `onSnapshot`, add `withTimeout` + inline error recovery to `handleReply`/`handleStar`, and fix `RepliesSection` `Enter`-submit + `crypto.randomUUID()`.

### Phase 2: Speed, Bundle Size & 60fps Smoothness
1. **Restore SSR for Above-the-Fold Hero (`app/page.jsx`):** Import `Landing` and `ThreeDCharacter` normally (SSR-enabled) so `<h1>`, bio, and `muazdp.png` render immediately in initial HTML. Defer `TestMe` (and Firebase/EmailJS) behind an `IntersectionObserver` dynamic wrapper.
2. **Pause Inactive Background & Off-Screen Animations (`app/page.jsx`, `DayVision`, `NightVision`):** Add `.bg-paused * { animation-play-state: paused !important; }` + `visibility: hidden` on the inactive theme layer, and pass `isActive` to stop inactive Framer Motion loops.
3. **Eliminate GPU Filter Bottlenecks:** Replace `filter: blur(60px)` SVG nebula ellipses in `NightVision` with static radial gradients; remove infinite `filter: drop-shadow()` animations in `Achievements.jsx`; lighten `backdrop-filter` on mobile.
4. **Adopt `LazyMotion` (`domAnimation`) & CSS Micro-Animations:** Swap `motion` for `m` inside `<LazyMotion features={domAnimation}>`, and move infinite avatar bobbing, button shimmers, and 3-dot loaders to pure CSS `@keyframes`.
5. **Tame Smooth Scroll & Config (`app/LenisProvider.jsx`, `next.config.ts`, `app/layout.jsx`):** Pause Lenis rAF when idle/hidden (or remove Lenis in favor of native smooth scroll), remove `transpilePackages: ["framer-motion"]`, trim unused Google Font weights, and switch to `@vercel/analytics/next`.

### Phase 3: Mobile Pro Polish (`360px` – `430px`)
1. **Rebuild Mobile `Skills.jsx`:** Replace `scale(0.55)` `SatelliteOrbitLayout` (which currently clips outer rings and shrinks labels to `~4px`) with a responsive grouped orbital pill layout below `640px`, and center `KiteTop` above a 2-column grid in Day mode.
2. **Upgrade `Achievements.jsx` Tap Targets:** Add `r={8}` invisible SVG hit areas + keyboard accessibility + thumb-friendly `#01`–`#05` selector tabs below the Star Map, and center `CloudBannerCard` at full responsive width on mobile.
3. **Fix Mobile Viewport & Input Ergonomics (`Landing`, `Projects`, `TestMe`, `EmailObject`, `WhatsAppFooter`):**
   - Set `16px` input font-size in `TestMe.jsx` to prevent iOS Safari focus zoom, use a 2-column category grid, and add `minWidth: 0` on the reply input.
   - Wrap project action buttons gracefully (`Live Demo` primary row, `GitHub`/`Server` secondary row on `< 420px`) and add real project preview thumbnails.
   - Disable/hide drifting `EmailObject` on `< 768px` so it never hijacks taps, tighten `WhatsAppFooter` padding on mobile, and add a compact thumb-zone bottom navigation + theme switcher bar.
