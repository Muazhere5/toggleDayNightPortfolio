'use client';

// ============================================================
// app/page.jsx — HOMEPAGE ASSEMBLER (FIXED)
//
// WHAT WAS WRONG:
//   export default function Home({ theme = 'day', toggleTheme = () => {} })
//   This expected props from layout.jsx via cloneElement.
//   App Router NEVER delivers props this way.
//   theme was always 'day' (the default), toggle did nothing.
//
// WHAT IS FIXED:
//   useTheme() reads directly from ThemeContext.
//   ThemeProvider in layout.jsx makes this available.
//   theme and toggleTheme are now REAL values that work.
//
// CONNECTION MAP:
//   ThemeContext.jsx → ThemeProvider wraps app in layout.jsx
//   page.jsx         → useTheme() pulls { theme, toggleTheme }
//   page.jsx         → passes theme as prop to all 5 sections
//   page.jsx         → passes toggleTheme to ThemeToggle
// ============================================================

import dynamic from 'next/dynamic';
import { useTheme } from './ThemeContext';

// ── BACKGROUND LAYERS ─────────────────────────────────────────
// ssr: false prevents hydration errors from framer-motion
// scroll hooks and window references used inside these files
const DayBackground = dynamic(
  () => import('./DayVision/page'),
  { ssr: false }
);
const NightBackground = dynamic(
  () => import('./NightVision/page'),
  { ssr: false }
);

// ── SECTION COMPONENTS ───────────────────────────────────────
import ThemeToggle  from '@/components/ThemeToggle';
import Landing      from '@/components/Landing';
import Projects     from '@/components/Projects';
import Skills       from '@/components/Skills';
import TestMe       from '@/components/TestMe';
import Achievements from '@/components/Achievements';

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
export default function Home() {
  // ── THE FIX: read theme from Context, not from props ──────
  const { theme, toggleTheme } = useTheme();
  const isDay = theme === 'day';

  return (
    <>
      {/* ── BACKGROUND LAYER (z-index 0, position fixed) ──
          Fills entire viewport behind all content.
          Swaps instantly when theme toggles.
          DayBackground   → sky gradient, clouds, birds, planes
          NightBackground → space gradient, stars, rocket, planets */}
      {isDay
        ? <DayBackground />
        : <NightBackground />
      }

      {/* ── THEME TOGGLE (z-index 9999, position fixed) ───
          Sun/Moon Horizon Switch.
          Always visible in top-right corner while scrolling.
          theme     → controls visual state (sun vs moon)
          toggleTheme → fires state change on click           */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      {/* ── MAIN CONTENT (z-index 1) ─────────────────────
          Sits above the fixed background layer.
          Single vertical scroll flow — no routing needed.
          Each section gets theme as prop for styling.        */}
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* Section 1 — Hero: GIF bubble, typing name, explore button */}
        <Landing theme={theme} />

        {/* Section 2 — Projects: GIF cards, Live Demo + GitHub */}
        <Projects theme={theme} />

        {/* Section 3 — Skills + Socials: kite string / orbit */}
        <Skills theme={theme} />

        {/* Section 4 — TestMe: challenge arena + EmailJS */}
        <TestMe theme={theme} />

        {/* Section 5 — Achievements: cloud banners / star map */}
        <Achievements theme={theme} />

      </main>
    </>
  );
}