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
      
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []); 

  
  return children;
}
