'use client';

// ============================================================
// page.jsx — HOMEPAGE ASSEMBLER
// This file is the conductor. It:
//   1. Receives { theme, toggleTheme } injected by layout.jsx
//   2. Renders the correct background layer (Day or Night)
//   3. Renders the ThemeToggle button (fixed, always visible)
//   4. Stacks all 5 portfolio sections in order
//   5. Passes theme prop into every section component
//
// CONNECTION MAP:
//   layout.jsx → injects props → page.jsx
//   page.jsx   → imports       → DayVision/page.jsx (background)
//   page.jsx   → imports       → NightVision/page.jsx (background)
//   page.jsx   → imports       → all 6 components in /components
// ============================================================

import dynamic from 'next/dynamic';

// ── BACKGROUND LAYERS ─────────────────────────────────────
// Dynamic import with ssr:false prevents hydration mismatch
// because these components use window/animation APIs.
const DayBackground  = dynamic(() => import('./DayVision/page'),  { ssr: false });
const NightBackground = dynamic(() => import('./NightVision/page'), { ssr: false });

// ── COMPONENTS ────────────────────────────────────────────
import ThemeToggle   from '@/components/ThemeToggle';
import Landing       from '@/components/Landing';
import Projects      from '@/components/Projects';
import Skills        from '@/components/Skills';
import TestMe        from '@/components/TestMe';
import Achievements  from '@/components/Achievements';

// ============================================================
// HOME PAGE COMPONENT
// Props come from layout.jsx via cloneElement injection.
// ============================================================
export default function Home({ theme = 'day', toggleTheme = () => {} }) {
  const isDay = theme === 'day';

  return (
    <>
      {/*
        ── BACKGROUND LAYER ────────────────────────────────
        Only one background renders at a time based on theme.
        Both are position:fixed, full-viewport, z-index:0.
        They sit BEHIND all content sections.
        DayBackground  → clouds, sun, birds, kite animations
        NightBackground → star field, nebula blobs, rocket, planets
      */}
      {isDay ? <DayBackground /> : <NightBackground />}

      {/*
        ── THEME TOGGLE ────────────────────────────────────
        Fixed to top-right corner, always visible on scroll.
        Receives theme (to show current state visually)
        and toggleTheme (to fire the switch on click).
        Defined in: components/ThemeToggle.jsx
      */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      {/*
        ── MAIN CONTENT ────────────────────────────────────
        position:relative, z-index:1 so it floats above background.
        All 5 sections stack vertically in a single scroll flow.
        Each receives theme prop for conditional day/night styling.
      */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
        }}
      >
        {/* 1. LANDING — hero, anime gif, your intro */}
        <Landing theme={theme} />

        
        <Projects theme={theme} />

        
        <Skills theme={theme} />

        
        <TestMe theme={theme} />

        
        <Achievements theme={theme} />
      </main>
    </>
  );
}
