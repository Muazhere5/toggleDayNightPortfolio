'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { useTheme } from './ThemeContext';

import ThemeToggle from '@/components/ThemeToggle';
import Landing from '@/components/Landing';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Achievements from '@/components/Achievements';
import TestMe from '@/components/TestMe';

// ============================================================
// DYNAMIC BACKGROUND IMPORTS
// ============================================================

const DayBackground = dynamic(
  () => import('./DayVision/page'),
  {
    ssr: false,
    loading: () => null,
  }
);

const NightBackground = dynamic(
  () => import('./NightVision/page'),
  {
    ssr: false,
    loading: () => null,
  }
);

// ============================================================
// HOME PAGE
// ============================================================

export default function HomePage() {
  const { theme } = useTheme();

  // ==========================================================
  // MEMOIZED BACKGROUND
  // ==========================================================

  const BackgroundComponent = useMemo(() => {
    return theme === 'day'
      ? <DayBackground />
      : <NightBackground />;
  }, [theme]);

  return (
    <main className="relative overflow-x-hidden">

      {/* ======================================================
          FIXED BACKGROUND LAYER
      ====================================================== */}

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        {BackgroundComponent}
      </div>

      {/* ======================================================
          THEME TOGGLE
      ====================================================== */}

      <ThemeToggle />

      {/* ======================================================
          MAIN CONTENT LAYER
      ====================================================== */}

      <div className="relative z-10">

        {/* HERO / LANDING */}
        <Landing />

        {/* SKILLS */}
        <Skills />

        {/* PROJECTS */}
        <Projects />

        {/* ACHIEVEMENTS */}
        <Achievements />

        {/* CONTACT / TEST ME */}
        <TestMe />

      </div>
    </main>
  );
}