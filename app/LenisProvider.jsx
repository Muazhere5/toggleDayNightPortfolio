'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }) {
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    let lenis = null;
    let idleId = null;
    let fallbackTimer = null;
    let destroyed = false;

    const onVisibilityChange = () => {
      if (!lenis) return;
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default;

        if (destroyed) return;

        lenis = new Lenis({
          duration: 1.2,
          smoothWheel: true,
          autoRaf: true,
        });

        if (document.hidden) {
          lenis.stop();
        }

        document.addEventListener('visibilitychange', onVisibilityChange);
        setLenisInstance(lenis);
      } catch (err) {
        console.warn('[LenisProvider] Smooth scroll init failed:', err);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        if (!destroyed) initLenis();
      });
    } else {
      fallbackTimer = setTimeout(() => {
        if (!destroyed) initLenis();
      }, 1);
    }

    return () => {
      destroyed = true;
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (fallbackTimer !== null) {
        clearTimeout(fallbackTimer);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
