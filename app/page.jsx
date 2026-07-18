'use client';

// ============================================================
// app/page.jsx — HOME PAGE
//
// PERFORMANCE FIX (Phase 3):
//   OLD: Both DayBackground + NightBackground were always mounted
//        simultaneously, with visibility toggled via opacity.
//        This meant 220 animating stars + 9 drifting clouds were
//        running on the GPU even when the user was in Day mode.
//
//   NEW: Only the ACTIVE background is mounted at any time.
//        AnimatePresence handles the crossfade on toggle —
//        it keeps the exiting component mounted just long enough
//        for its exit animation to complete, then destroys it.
//        Result: ~50% less animation work at any given moment.
// ============================================================

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import { useTheme } from './ThemeContext';

import ThemeToggle   from '@/components/ThemeToggle';
import Landing       from '@/components/Landing';
import WhatsAppFooter from '@/components/WhatsAppFooter';
import EmailObject   from '@/components/EmailObject';
import Skills        from '@/components/Skills';
import Projects      from '@/components/Projects';
import Achievements  from '@/components/Achievements';
import TestMe        from '@/components/TestMe';

// ── DYNAMIC BACKGROUND IMPORTS ───────────────────────────────
// ssr:false is required because these use framer-motion's
// useScroll / window APIs which don't exist on the server.
const DayBackground = dynamic(
  () => import('./DayVision/page'),
  { ssr: false, loading: () => null }
);

const NightBackground = dynamic(
  () => import('./NightVision/page'),
  { ssr: false, loading: () => null }
);

// ── HOME PAGE ─────────────────────────────────────────────────
export default function HomePage() {
  const { theme } = useTheme();

  return (
    <main className="relative overflow-x-hidden">

      {/* ======================================================
          FIXED BACKGROUND LAYER — only ONE is mounted at a time.
          AnimatePresence: mounts the incoming background,
          crossfades it in, then unmounts the outgoing one.
          Key prop forces remount on theme change.
      ====================================================== */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <AnimatePresence mode="sync">
          {theme === 'day' ? (
            <motion.div
              key="day-bg"
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <DayBackground />
            </motion.div>
          ) : (
            <motion.div
              key="night-bg"
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <NightBackground />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ======================================================
          THEME TOGGLE — fixed top-right, above everything
      ====================================================== */}
      <ThemeToggle />

      {/* ======================================================
          MAIN CONTENT LAYER
      ====================================================== */}
      <div className="relative z-10">
        <Landing      theme={theme} />
        <Skills       theme={theme} />
        <Projects     theme={theme} />
        <Achievements theme={theme} />
        <TestMe       theme={theme} />
        <WhatsAppFooter theme={theme} />
      </div>

      {/* ======================================================
          ROAMING INTERACTIVE OBJECTS
      ====================================================== */}
      <EmailObject    theme={theme} />

    </main>
  );
}