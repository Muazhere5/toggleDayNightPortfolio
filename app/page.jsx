'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from './ThemeContext';
import Landing from '@/components/Landing';

// ─── Fixed backgrounds: client-only, inactive layer deferred until idle/intent ─
const DayBackground = dynamic(() => import('@/components/backgrounds/DayBackground'), {
  ssr: false,
  loading: () => null,
});
const NightBackground = dynamic(() => import('@/components/backgrounds/NightBackground'), {
  ssr: false,
  loading: () => null,
});

// ─── Page sections: below-the-fold client widgets dynamically split ───────────
const ThemeToggle    = dynamic(() => import('@/components/ThemeToggle'),    { ssr: false });
const MobileNavDock  = dynamic(() => import('@/components/MobileNavDock'),  { ssr: false });
const Skills         = dynamic(() => import('@/components/Skills'),         { ssr: false });
const Projects       = dynamic(() => import('@/components/Projects'),       { ssr: false });
const Achievements   = dynamic(() => import('@/components/Achievements'),   { ssr: false });
const TestMe         = dynamic(() => import('@/components/TestMe'),         { ssr: false });
const WhatsAppFooter = dynamic(() => import('@/components/WhatsAppFooter'), { ssr: false });
const EmailObject    = dynamic(() => import('@/components/EmailObject'),    { ssr: false });

// ─── Lazy gate for TestMe (defers Firebase Firestore + EmailJS chunks until near view) ─
function LazyTestMe({ theme }) {
  const [shouldLoad, setShouldLoad] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#testme'
  );
  const gateRef = useRef(null);

  useEffect(() => {
    if (shouldLoad) return;
    const node = gateRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setShouldLoad(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  if (shouldLoad) {
    return <TestMe theme={theme} />;
  }

  return (
    <section
      id="testme"
      ref={gateRef}
      aria-label="Test Me"
      style={{ minHeight: '420px', width: '100%' }}
    />
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const isDay = theme === 'day';
  const [idleReady, setIdleReady] = useState(false);

  // Defer mounting the inactive background until browser is idle (or user hovers toggle)
  useEffect(() => {
    if (idleReady) return;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => setIdleReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(idleId);
    }
    const timer = setTimeout(() => setIdleReady(true), 1500);
    return () => clearTimeout(timer);
  }, [idleReady]);

  const mountDay = isDay || idleReady;
  const mountNight = !isDay || idleReady;

  return (
    <main className="relative overflow-x-hidden">

      {/* ── Background Layer ────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {mountDay && (
          <div
            className={`bg-panel${isDay ? '' : ' bg-paused'}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isDay ? 1 : 0,
              visibility: isDay ? 'visible' : 'hidden',
              transition: isDay
                ? 'opacity 1.0s ease-in-out, visibility 0s linear 0s'
                : 'opacity 1.0s ease-in-out, visibility 0s linear 1.0s',
              pointerEvents: 'none',
            }}
          >
            <DayBackground isActive={isDay} />
          </div>
        )}

        {mountNight && (
          <div
            className={`bg-panel${!isDay ? '' : ' bg-paused'}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isDay ? 0 : 1,
              visibility: isDay ? 'hidden' : 'visible',
              transition: !isDay
                ? 'opacity 1.0s ease-in-out, visibility 0s linear 0s'
                : 'opacity 1.0s ease-in-out, visibility 0s linear 1.0s',
              pointerEvents: 'none',
            }}
          >
            <NightBackground isActive={!isDay} />
          </div>
        )}
      </div>

      {/* Theme toggle — mounts inactive background early on hover/focus intent */}
      <div
        onMouseEnter={() => { if (!idleReady) setIdleReady(true); }}
        onFocus={() => { if (!idleReady) setIdleReady(true); }}
      >
        <ThemeToggle />
      </div>

      {/* Content sections — Landing renders on SSR for immediate FCP/LCP */}
      <div className="relative z-10">
        <Landing theme={theme} />
        <Skills theme={theme} />
        <Projects theme={theme} />
        <Achievements theme={theme} />
        <LazyTestMe theme={theme} />
        <WhatsAppFooter theme={theme} />
      </div>

      {/* Floating email widget */}
      <EmailObject theme={theme} />

      {/* Mobile thumb-zone navigation dock (< 768px) */}
      <MobileNavDock onIntent={() => { if (!idleReady) setIdleReady(true); }} />

    </main>
  );
}
