'use client';

// ============================================================
// app/ThemeContext.jsx — THEME CONTEXT (CLIENT COMPONENT)
//
// WHY THIS FILE EXISTS:
//   Next.js App Router does NOT allow prop injection through
//   cloneElement because layout children are server-rendered.
//   This file is the correct solution — a lightweight Context
//   that any Client Component in the tree can consume.
//
// CONNECTION MAP:
//   layout.jsx      → imports ThemeProvider, wraps entire app
//   page.jsx        → imports useTheme(), reads theme state
//   ThemeToggle.jsx → imports useTheme(), calls toggleTheme()
//   All 5 components→ import useTheme(), read theme for styling
//
// WHAT IT DOES:
//   1. Holds theme state ('day' | 'night')
//   2. Reads localStorage on mount to restore last preference
//   3. Applies .day-mode / .night-mode class to <body>
//   4. Provides { theme, toggleTheme } to entire component tree
//   5. Initialises Lenis smooth scroll for floating page feel
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

// ── CREATE CONTEXT ────────────────────────────────────────────
const ThemeContext = createContext({
  theme: 'day',
  toggleTheme: () => {},
});

// ── THEME PROVIDER ────────────────────────────────────────────
// Wrap your entire app with this in layout.jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('day');
  // Prevent hydration flash — don't render until client reads localStorage
  const [mounted, setMounted] = useState(false);

  // ── MOUNT: read saved preference ─────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'day' || saved === 'night') {
      setTheme(saved);
    }
    setMounted(true);
  }, []);

  // ── SYNC body className whenever theme changes ────────────
  useEffect(() => {
    if (!mounted) return;
    const body = document.body;
    body.classList.remove('day-mode', 'night-mode');
    body.classList.add(theme === 'day' ? 'day-mode' : 'night-mode');
  }, [theme, mounted]);

  // ── LENIS SMOOTH SCROLL initialisation ───────────────────
  // Gives the portfolio that buttery floating sky/space feel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lenis;
    let rafId;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default;

        lenis = new Lenis({
          duration: 1.4,          // scroll duration in seconds
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.5,
        });

        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Lenis not available — graceful fallback to native scroll
        console.info('Lenis not available, using native scroll');
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  // ── TOGGLE FUNCTION ──────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'day' ? 'night' : 'day';
      localStorage.setItem('portfolio-theme', next);
      return next;
    });
  }, []);

  // ── CONTEXT VALUE ────────────────────────────────────────
  const value = { theme, toggleTheme };

  // Prevent hydration mismatch — render children only after mount
  // This stops the brief flash of wrong theme on page load
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── useTheme HOOK ─────────────────────────────────────────────
// Import this in any component to get theme + toggleTheme
// Usage:  const { theme, toggleTheme } = useTheme();
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}