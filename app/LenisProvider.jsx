'use client';

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
          // PERF FIX: wheel events are passive by default in modern browsers,
          // but making it explicit prevents the browser from waiting to check
          // if preventDefault() was called — removes scroll jank on mobile.
          wheelEventsTarget: typeof window !== 'undefined' ? window : undefined,
        });

        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };

        // PERF FIX: Use requestIdleCallback to defer Lenis init until after
        // the first paint, so it doesn't compete with critical rendering.
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            rafId = requestAnimationFrame(raf);
          });
        } else {
          rafId = requestAnimationFrame(raf);
        }
      } catch (err) {
        console.warn('[LenisProvider] Smooth scroll init failed:', err);
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis)  lenis.destroy();
    };
  }, []);

  return children;
}
