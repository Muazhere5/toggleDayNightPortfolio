'use client';

import dynamic from 'next/dynamic';
import { useTheme } from './ThemeContext';

// ─── Fixed backgrounds: client-only, no SSR ─────────────────────────────────
// Loaded once, both stay in DOM — theme visibility controlled via CSS opacity.
// This ELIMINATES the AnimatePresence dual-background compositor overload.
const DayBackground = dynamic(() => import('./DayVision/page'), {
  ssr: false,
  loading: () => null,
});
const NightBackground = dynamic(() => import('./NightVision/page'), {
  ssr: false,
  loading: () => null,
});

// ─── Page sections: dynamically imported to split the initial bundle ─────────
const ThemeToggle   = dynamic(() => import('@/components/ThemeToggle'),   { ssr: false });
const Landing       = dynamic(() => import('@/components/Landing'),       { ssr: false });
const Skills        = dynamic(() => import('@/components/Skills'),        { ssr: false });
const Projects      = dynamic(() => import('@/components/Projects'),      { ssr: false });
const Achievements  = dynamic(() => import('@/components/Achievements'),  { ssr: false });
const TestMe        = dynamic(() => import('@/components/TestMe'),        { ssr: false });
const WhatsAppFooter= dynamic(() => import('@/components/WhatsAppFooter'),{ ssr: false });
const EmailObject   = dynamic(() => import('@/components/EmailObject'),   { ssr: false });


export default function HomePage() {
  const { theme } = useTheme();
  const isDay = theme === 'day';

  return (
    <main className="relative overflow-x-hidden">

      {/*
        ── Background Layer ────────────────────────────────────────────────────
        PERF FIX: Both backgrounds are always mounted (avoids re-mount cost).
        Visibility is controlled by CSS opacity transition only — zero JS,
        zero Framer Motion, zero AnimatePresence compositor thrashing.
        The `will-change: opacity` + `contain: strict` on `.bg-panel` ensures
        each background lives on its own GPU compositing layer.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Day background — visible when day-mode, fades out when night-mode */}
        <div
          className="bg-panel"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: isDay ? 1 : 0,
            transition: 'opacity 1.0s ease-in-out',
            pointerEvents: 'none',
          }}
        >
          <DayBackground />
        </div>

        {/* Night background — visible when night-mode, fades out when day-mode */}
        <div
          className="bg-panel"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: isDay ? 0 : 1,
            transition: 'opacity 1.0s ease-in-out',
            pointerEvents: 'none',
          }}
        >
          <NightBackground />
        </div>
      </div>

      {/* Theme toggle — fixed position, always visible */}
      <ThemeToggle />

      {/* Content sections */}
      <div className="relative z-10">
        <Landing      theme={theme} />
        <Skills       theme={theme} />
        <Projects     theme={theme} />
        <Achievements theme={theme} />
        <TestMe       theme={theme} />
        <WhatsAppFooter theme={theme} />
      </div>

      {/* Floating email widget */}
      <EmailObject theme={theme} />

    </main>
  );
}