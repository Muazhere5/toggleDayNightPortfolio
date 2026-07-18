// ============================================================
// app/layout.jsx — ROOT LAYOUT (SERVER COMPONENT)
//
// ARCHITECTURE:
//   This file is intentionally NOT a Client Component.
//   Keeping it a Server Component allows:
//     ✅ export const metadata (SEO — only works in server components)
//     ✅ Static HTML shell rendered on the server
//     ✅ No React hydration mismatch on <html>/<body>
//
// FOUC PREVENTION:
//   The inline <script> in <head> runs synchronously before
//   the browser paints. It reads localStorage, sets the correct
//   .day-mode or .night-mode class on <html>, and adds
//   .no-transitions so the initial class has no animated flash.
//   ThemeContext.jsx removes .no-transitions after 150ms so
//   subsequent theme toggles animate smoothly.
//
// PROVIDERS:
//   ThemeProvider — holds day/night state + context
//   LenisProvider — smooth scroll (single responsibility)
// ============================================================

import { ThemeProvider } from './ThemeContext';
import LenisProvider     from './LenisProvider';
import './globals.css';
import { Orbitron, Rajdhani, Nunito } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

// ── SEO METADATA ─────────────────────────────────────────────
export const metadata = {
  title: 'YOU TECH BD — Portfolio',
  description: 'Full Stack Developer Portfolio — Sky & Space Edition by Muaz',
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
  },
};

// ── ROOT LAYOUT ───────────────────────────────────────────────
export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the inline script modifies <html> classNames
    // before React hydrates — this tells React to accept that difference
    <html lang="en" suppressHydrationWarning className={`${orbitron.variable} ${rajdhani.variable} ${nunito.variable}`}>
      <head>
        {/*
          FOUC PREVENTION — runs synchronously before first paint.
          Sets the correct theme class and disables transitions so
          there is zero flash of the wrong theme or animated jump.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = window.localStorage.getItem('portfolio-theme');
                  var theme = saved === 'night' ? 'night' : 'day';
                  var html  = document.documentElement;
                  html.classList.add(theme + '-mode');
                  html.classList.add('no-transitions');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body id="app-root">
        {/*
          ThemeProvider: provides { theme, toggleTheme } via context
          LenisProvider: initialises smooth scroll once on mount
          Both are Client Components wrapping Server-rendered children
        */}
        <ThemeProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}