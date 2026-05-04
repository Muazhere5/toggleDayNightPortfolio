'use client';

// ============================================================
// layout.jsx — ROOT LAYOUT
// This is the outermost wrapper of your entire portfolio.
// It does three critical jobs:
//   1. Holds the theme state ("day" | "night") globally
//   2. Applies the correct CSS mode class to <body>
//   3. Passes theme + toggleTheme down to page.jsx via children clone
// No Context API needed — props flow directly downward.
// ============================================================

import { useState, useEffect, cloneElement, isValidElement } from 'react';
import './globals.css';

export const metadata = {
  title: 'YOU TECH BD — Portfolio',
  description: 'Full Stack Developer Portfolio — Sky & Space Edition',
};

export default function RootLayout({ children }) {
  // ── THEME STATE ──────────────────────────────────────────
  // "day" = DayVision (sky blue), "night" = NightVision (deep space)
  // Default is "day" until localStorage is read on client
  const [theme, setTheme] = useState('day');

  // ── LOAD SAVED PREFERENCE ────────────────────────────────
  // On first mount, check if the visitor has been here before.
  // If they chose night mode last time, restore it instantly.
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'day' || saved === 'night') {
      setTheme(saved);
    }
  }, []);

  // ── TOGGLE FUNCTION ──────────────────────────────────────
  // Flips between day and night, saves choice to localStorage.
  // This function is passed into page.jsx → ThemeToggle.jsx
  const toggleTheme = () => {
    const next = theme === 'day' ? 'night' : 'day';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
  };

  // ── INJECT PROPS INTO PAGE ───────────────────────────────
  // Next.js App Router passes page.jsx as children here.
  // We clone children and inject { theme, toggleTheme } as props
  // so every section component can receive them via page.jsx.
  const childWithProps = isValidElement(children)
    ? cloneElement(children, { theme, toggleTheme })
    : children;

  return (
    <html lang="en">
      {/*
        The CSS class on <body> controls which set of CSS variables
        is active. globals.css defines:
          .day-mode  { --bg-primary: #87CEEB; ... }
          .night-mode { --bg-primary: #000000; ... }
        Switching this class instantly remaps all CSS variables → theme change.
        The 0.8s transition in globals.css makes it cinematic.
      */}
      <body
        className={theme === 'day' ? 'day-mode' : 'night-mode'}
        id="app-root"
      >
        {childWithProps}
      </body>
    </html>
  );
}
