'use client';

// ============================================================
// app/ThemeContext.jsx — THEME STATE (REBUILT)
//
// RESPONSIBILITIES:
//   ✅ Holds 'day' | 'night' state
//   ✅ Reads saved preference from localStorage on first mount
//   ✅ Applies .day-mode / .night-mode class to <html>
//   ✅ Saves preference back to localStorage on change
//   ✅ Removes .no-transitions after first paint (prevents FOUC)
//   ✅ Exposes { theme, toggleTheme } via useTheme() hook
//
// NOT RESPONSIBLE FOR:
//   ✗ Lenis scroll — now in LenisProvider.jsx (single concern)
//
// HYDRATION STRATEGY:
//   layout.jsx inline script runs before React hydrates and
//   sets the correct class on <html> + adds .no-transitions.
//   This context then syncs React state to match that class,
//   so there is never a server/client mismatch.
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ── CONTEXT (default = day so SSR never renders without a value) ──
const ThemeContext = createContext({
  theme: 'day',
  toggleTheme: () => {},
});

// ============================================================
// THEME PROVIDER
// ============================================================
export function ThemeProvider({ children }) {
  // Start with 'day' — the inline script in layout.jsx has
  // already set the correct HTML class before this runs,
  // so there is no visible flash even if localStorage says 'night'.
  const [theme, setTheme] = useState('day');

  // ── MOUNT: read localStorage and sync state ───────────────
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('portfolio-theme');
      if (saved === 'day' || saved === 'night') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(saved);
      }
    } catch {
      // localStorage unavailable (private browsing etc.) — stay on 'day'
    }
  }, []); // runs once on client mount

  // ── APPLY CLASS + SAVE ────────────────────────────────────
  // Runs after every theme change (including the mount sync above).
  // Removes the old class, adds the new one, saves to localStorage.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('day-mode', 'night-mode');
    html.classList.add(theme === 'day' ? 'day-mode' : 'night-mode');

    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // ignore write failures
    }
  }, [theme]);

  // ── REMOVE .no-transitions AFTER FIRST PAINT ─────────────
  // The inline script adds .no-transitions so the initial
  // class application has no animated flash.
  // We remove it after a short delay so subsequent theme
  // toggles DO animate smoothly.
  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
    }, 150);
    return () => clearTimeout(timer);
  }, []); // runs once only

  // ── TOGGLE ───────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  }, []);

  // ── MEMOISED VALUE ────────────────────────────────────────
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

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