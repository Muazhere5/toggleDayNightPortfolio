'use client';

// ============================================================
// app/LenisProvider.jsx — SMOOTH SCROLL (ISOLATED)
//
// Extracted from ThemeContext so scroll init has zero coupling
// to theme state — it runs once on mount and cleans up on
// unmount. No re-initialisation, no RAF leak.
//
// HOW IT WORKS:
//   1. Dynamically imports Lenis (avoids SSR issues)
//   2. Creates one Lenis instance
//   3. Runs RAF loop: lenis.raf(time) → requestAnimationFrame
//   4. Cleanup: cancels RAF + calls lenis.destroy()
//
// PERFORMANCE:
//   - Dynamic import means the Lenis bundle is NOT in the
//     initial JS payload — it loads after hydration
//   - RAF only runs while the component is mounted
// ============================================================

import { useEffect } from 'react';

export default function LenisProvider({ children }) {
  useEffect(() => {
    let lenis = null;
    let rafId = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default;

        lenis = new Lenis({
          duration: 1.2,
          smoothWheel: true,
          smoothTouch: false,
        });

        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.warn('[LenisProvider] Smooth scroll init failed:', err);
      }
    };

    initLenis();

    return () => {
      // Cancel RAF first so lenis.raf() is never called after destroy
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []); // empty deps — runs exactly once on mount, cleans up on unmount

  // LenisProvider is purely behavioural — renders children as-is
  return children;
}
