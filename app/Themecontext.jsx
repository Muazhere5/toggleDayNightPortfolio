'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ============================================================
// THEME CONTEXT
// ============================================================

const ThemeContext = createContext({
  theme: 'day',
  toggleTheme: () => {},
});

// ============================================================
// THEME PROVIDER
// ============================================================

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('day');
  const [mounted, setMounted] = useState(false);

  // ==========================================================
  // READ SAVED THEME
  // ==========================================================

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('portfolio-theme');

      if (savedTheme === 'day' || savedTheme === 'night') {
        setTheme(savedTheme);
      }
    } catch (err) {
      console.warn('Theme localStorage read failed:', err);
    } finally {
      setMounted(true);
    }
  }, []);

  // ==========================================================
  // APPLY BODY CLASS
  // ==========================================================

  useEffect(() => {
    if (!mounted) return;

    const body = document.body;

    body.classList.remove('day-mode', 'night-mode');
    body.classList.add(theme === 'day' ? 'day-mode' : 'night-mode');

    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch (err) {
      console.warn('Theme localStorage write failed:', err);
    }
  }, [theme, mounted]);

  // ==========================================================
  // TOGGLE THEME
  // ==========================================================

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  }, []);

  // ==========================================================
  // LENIS SMOOTH SCROLL
  // ==========================================================

  useEffect(() => {
    if (!mounted) return;

    let lenis;
    let rafId;

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
        console.warn('Lenis initialization failed:', err);
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);

      if (lenis) {
        lenis.destroy();
      }
    };
  }, [mounted]);

  // ==========================================================
  // MEMOIZED CONTEXT VALUE
  // ==========================================================

  const value = useMemo(() => {
    return {
      theme,
      toggleTheme,
    };
  }, [theme, toggleTheme]);

  // ==========================================================
  // PREVENT HYDRATION FLASH
  // ==========================================================

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================
// CUSTOM HOOK
// ============================================================

export function useTheme() {
  return useContext(ThemeContext);
}