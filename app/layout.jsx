// ============================================================
// app/layout.jsx — ROOT LAYOUT (FIXED)
//
// PROBLEMS FIXED FROM YOUR PREVIOUS VERSION:
//
//   OLD ❌  'use client' at top
//   NEW ✅  Removed completely — layout is now a Server Component
//           This makes metadata work correctly
//
//   OLD ❌  export const metadata = { ... } (broken with 'use client')
//   NEW ✅  metadata works perfectly now (Server Component only)
//
//   OLD ❌  useState, useEffect, cloneElement imported here
//   NEW ✅  All removed — state lives in ThemeContext.jsx instead
//
//   OLD ❌  cloneElement(children, { theme, toggleTheme })
//   NEW ✅  Removed — ThemeProvider shares state via Context
//
//   OLD ❌  <body className={theme === 'day' ? ...}>
//           This caused server/client hydration mismatch
//   NEW ✅  <body> has no className here
//           ThemeContext.jsx sets it on client via useEffect
//           No more hydration mismatch or theme flash
//
// HOW IT WORKS NOW:
//   layout.jsx wraps the whole app in <ThemeProvider>
//   ThemeProvider (in ThemeContext.jsx) holds all state
//   page.jsx and all components get theme via useTheme()
//   ThemeToggle still works exactly the same — zero changes
//
// FILE LOCATION: src/app/layout.jsx
// ============================================================

// ── Import ThemeProvider from the new ThemeContext file ──────
// ThemeProvider is a Client Component ('use client' is in
// ThemeContext.jsx). layout.jsx itself stays a Server Component.
// This is the correct Next.js App Router pattern.
import { ThemeProvider } from './ThemeContext';

// ── Import your global styles ────────────────────────────────
import './globals.css';

// ── Metadata — works correctly now (Server Component) ────────
// This is what controls your browser tab title, SEO description,
// and social media preview when someone shares your portfolio.
export const metadata = {
  title: 'YOU TECH BD — Portfolio',
  description: 'Full Stack Developer Portfolio — Sky & Space Edition',
  keywords: [
    'Full Stack Developer',
    'MERN Stack',
    'Next.js',
    'React',
    'MongoDB',
    'Portfolio',
  ],
  authors: [{ name: 'Muaz' }],
  openGraph: {
    title: 'YOU TECH BD — Portfolio',
    description: 'Sky & Space themed developer portfolio by Muaz',
    type: 'website',
    images: ['/assets/og/og-image.png'],
  },
};

// ── Root Layout Component ─────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        ── WHY <body> HAS NO className HERE ──────────────────

        OLD (broken):
          <body className={theme === 'day' ? 'day-mode' : 'night-mode'}>
          This caused a React hydration mismatch error because:
          - Server renders with className="day-mode"
          - Client reads localStorage, finds "night"
          - React sees a mismatch and throws a warning
          - Sometimes causes visual flash or broken styling

        NEW (correct):
          <body> has no className
          ThemeContext.jsx adds the class via:
            document.body.classList.add('day-mode')
          This runs only on the client after localStorage is read
          No server/client mismatch, no flash, no errors ✅

        globals.css handles the styling via:
          .day-mode  { --bg-primary: #87CEEB; ... all sky vars }
          .night-mode { --bg-primary: #000000; ... all space vars }
      */}
      <body id="app-root">

        {/*
          ── ThemeProvider EXPLAINED ────────────────────────

          ThemeProvider comes from src/app/ThemeContext.jsx
          It is a Client Component that:
            ✅ Holds theme state ('day' | 'night')
            ✅ Reads localStorage on first load
            ✅ Sets .day-mode / .night-mode class on <body>
            ✅ Provides { theme, toggleTheme } to entire app
            ✅ Initialises Lenis smooth scroll
            ✅ Prevents hydration flash

          {children} = your page.jsx and all components inside it
          They all get access to theme state automatically via
          the useTheme() hook — no prop drilling through layout.
        */}
        <ThemeProvider>
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}