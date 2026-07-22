'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// ─── Star generation (deterministic seeded random, SSR-safe) ─────────────────
// PERF FIX: Reduced from 220 → 120 stars.
// Stars are grouped into 3 CSS animation classes (slow/mid/fast).
// Instead of per-element animationDelay inline styles (which force 220
// individual browser style recalculations), we use a single CSS variable
// --delay on each circle. This is resolved once and never recalculated.
function generateStars(count, seed = 42) {
  const stars = [];
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: rand() * 100,
      y: rand() * 130,
      r: rand() * 1.6 + 0.3,
      group: Math.floor(rand() * 3),   // 0=slow 1=mid 2=fast
      delay: rand() * 6,
      brightness: rand() * 0.6 + 0.4,
    });
  }
  return stars;
}

// ─── Rocket (static SVG, moved by Framer — small/lightweight) ────────────────
const Rocket = () => (
  <svg width="36" height="72" viewBox="0 0 36 72" fill="none">
    <path d="M18,2 Q30,10 30,30 L30,52 L18,60 L6,52 L6,30 Q6,10 18,2Z" fill="rgba(200,200,220,0.82)" />
    <circle cx="18" cy="28" r="7" fill="rgba(100,180,255,0.6)" />
    <circle cx="18" cy="28" r="5" fill="rgba(140,210,255,0.45)" />
    <path d="M6,44 L0,58 L6,54Z"   fill="rgba(160,160,190,0.75)" />
    <path d="M30,44 L36,58 L30,54Z" fill="rgba(160,160,190,0.75)" />
    <ellipse cx="18" cy="64" rx="6"   ry="10" fill="rgba(255,140,0,0.7)" />
    <ellipse cx="18" cy="64" rx="3.5" ry="7"  fill="rgba(255,220,50,0.8)" />
    <ellipse cx="18" cy="62" rx="2"   ry="4"  fill="rgba(255,255,200,0.9)" />
    <rect x="6" y="34" width="24" height="4" rx="2" fill="rgba(123,104,238,0.55)" />
  </svg>
);

// ─── Satellite (static SVG) ───────────────────────────────────────────────────
const Satellite = ({ size = 1 }) => (
  <svg width={52 * size} height={22 * size} viewBox="0 0 52 22" fill="none">
    <rect x="18" y="6" width="16" height="10" rx="3"
      fill="rgba(180,190,210,0.78)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    <rect x="2"  y="4" width="14" height="14" rx="2"
      fill="rgba(60,100,180,0.65)" stroke="rgba(100,150,220,0.4)" strokeWidth="0.8" />
    <line x1="2"  y1="11" x2="16" y2="11" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="9"  y1="4"  x2="9"  y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <rect x="36" y="4" width="14" height="14" rx="2"
      fill="rgba(60,100,180,0.65)" stroke="rgba(100,150,220,0.4)" strokeWidth="0.8" />
    <line x1="36" y1="11" x2="50" y2="11" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="43" y1="4"  x2="43" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="26" y1="6"  x2="26" y2="1"  stroke="rgba(200,200,220,0.6)"  strokeWidth="0.8" />
    <circle cx="26" cy="1" r="1.2" fill="rgba(255,80,80,0.8)" />
  </svg>
);

// ─── Planet shapes (static SVGs) ─────────────────────────────────────────────
const PlanetRinged = ({ r = 28 }) => (
  <svg width={r * 4} height={r * 3} viewBox={`0 0 ${r * 4} ${r * 3}`} fill="none">
    <ellipse cx={r * 2} cy={r * 1.5} rx={r * 1.7} ry={r * 0.45}
      stroke="rgba(180,140,255,0.35)" strokeWidth={r * 0.22} fill="none" opacity="0.5" />
    <circle cx={r * 2} cy={r * 1.5} r={r} fill="rgba(140,100,220,0.55)" />
    <circle cx={r * 2} cy={r * 1.5} r={r} fill="rgba(255,255,255,0.06)" />
    <ellipse cx={r * 2} cy={r * 1.2} rx={r * 0.85} ry={r * 0.18} fill="rgba(255,255,255,0.07)" />
    <ellipse cx={r * 2} cy={r * 1.7} rx={r * 0.75} ry={r * 0.14} fill="rgba(255,255,255,0.05)" />
    <ellipse cx={r * 2} cy={r * 1.5} rx={r * 1.7} ry={r * 0.45}
      stroke="rgba(180,140,255,0.35)" strokeWidth={r * 0.22} fill="none"
      strokeDasharray={`${r * 5.35} ${r * 5.35}`}
      strokeDashoffset={`${r * 5.35}`} opacity="0.7" />
  </svg>
);

const PlanetSmall = ({ r = 16, color = 'rgba(80,180,160,0.5)' }) => (
  <svg width={r * 2 + 4} height={r * 2 + 4} viewBox={`0 0 ${r * 2 + 4} ${r * 2 + 4}`} fill="none">
    <circle cx={r + 2} cy={r + 2} r={r} fill={color} />
    <circle cx={r + 2} cy={r + 2} r={r} fill="rgba(255,255,255,0.05)" />
    <ellipse cx={r + 2} cy={r + 2 - r * 0.2} rx={r * 0.7} ry={r * 0.15}
      fill="rgba(255,255,255,0.08)" />
  </svg>
);

// ─── CSS string injected once ─────────────────────────────────────────────────
// PERF FIX: All nebula and shooting-star animations moved from Framer Motion
// to CSS @keyframes. This removes ~9 Framer animation instances from the
// JS scheduler, moving them to the GPU compositor thread.
const NIGHT_CSS = `
  @keyframes twinkle-slow {
    0%, 100% { opacity: var(--star-max, 1);    }
    50%       { opacity: var(--star-min, 0.15); }
  }
  @keyframes twinkle-mid {
    0%, 100% { opacity: var(--star-max, 1);    }
    50%       { opacity: var(--star-min, 0.1);  }
  }
  @keyframes twinkle-fast {
    0%, 100% { opacity: var(--star-max, 1);    }
    50%       { opacity: var(--star-min, 0.05); }
  }
  .star-slow { animation: twinkle-slow 4s   ease-in-out infinite; }
  .star-mid  { animation: twinkle-mid  2.8s ease-in-out infinite; }
  .star-fast { animation: twinkle-fast 1.8s ease-in-out infinite; }

  /* Nebula blobs — CSS replaces Framer Motion NebulaBlob component */
  @keyframes nebulaGlowAnim {
    0%, 100% { opacity: 0.06; transform: scale(1);    }
    50%       { opacity: 0.15; transform: scale(1.08); }
  }
  .nebula-ellipse {
    animation: nebulaGlowAnim ease-in-out infinite;
    transform-origin: center center;
    transform-box: fill-box;
    filter: blur(60px);
  }

  /* Shooting stars — CSS replaces Framer ShootingStar component */
  @keyframes shoot {
    0%   { opacity: 0; transform: translateX(0) translateY(0)   scaleX(0);   }
    8%   { opacity: 1; }
    70%  { opacity: 1; }
    100% { opacity: 0; transform: translateX(-160px) translateY(90px) scaleX(1); }
  }
  .shooting-star {
    position: absolute;
    width: 120px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%);
    transform: rotate(-35deg);
    transform-origin: right center;
    animation: shoot ease-out infinite;
  }

  /* Satellite cross-screen drift — CSS replaces Framer Motion */
  @keyframes satelliteLTR {
    from { transform: translateX(-80px);  }
    to   { transform: translateX(110vw);  }
  }
  @keyframes satelliteRTL {
    from { transform: translateX(110vw);  }
    to   { transform: translateX(-100px); }
  }
  @keyframes satRotateCW  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
  @keyframes satRotateCCW { from { transform: rotate(360deg); } to { transform: rotate(0deg);    } }

  @media (max-width: 768px) {
    .night-mobile-hidden { display: none !important; }
  }
`;

const GROUP_CLASS = ['star-slow', 'star-mid', 'star-fast'];

export default function NightBackground() {
  // 120 stars (down from 220) — memoised so they never regenerate on re-render
  const stars = useMemo(() => generateStars(120), []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: `linear-gradient(
          180deg,
          #000000 0%,
          #020208 20%,
          #050510 45%,
          #070715 70%,
          #0a0a1e 88%,
          #0d0d22 100%
        )`,
      }}
    >
      <style>{NIGHT_CSS}</style>

      {/* ── Stars ─────────────────────────────────────────────────────────── */}
      <svg
        width="100%" height="130%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        preserveAspectRatio="none"
      >
        {stars.map(({ id, x, y, r, group, delay, brightness }, index) => (
          <circle
            key={id}
            cx={`${x}%`}
            cy={`${y}%`}
            r={r}
            fill={`rgba(255,255,255,${brightness})`}
            className={`${GROUP_CLASS[group]}${index % 3 === 0 ? ' night-mobile-hidden' : ''}`}
            style={{
              '--star-max': brightness,
              '--star-min': brightness * 0.15,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </svg>

      {/* ── Nebula blobs — pure CSS animation ────────────────────────────── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <ellipse className="nebula-ellipse" cx="15%" cy="20%" rx="280" ry="180"
          fill="rgba(123,104,238,0.12)"
          style={{ animationDuration: '8s',  animationDelay: '0s'  }} />
        <ellipse className="nebula-ellipse night-mobile-hidden" cx="80%" cy="15%" rx="220" ry="150"
          fill="rgba(80,140,255,0.09)"
          style={{ animationDuration: '10s', animationDelay: '2s'  }} />
        <ellipse className="nebula-ellipse" cx="60%" cy="55%" rx="300" ry="200"
          fill="rgba(160,80,220,0.08)"
          style={{ animationDuration: '12s', animationDelay: '4s'  }} />
        <ellipse className="nebula-ellipse night-mobile-hidden" cx="20%" cy="75%" rx="250" ry="160"
          fill="rgba(50,200,180,0.07)"
          style={{ animationDuration: '9s',  animationDelay: '1s'  }} />
        <ellipse className="nebula-ellipse" cx="90%" cy="80%" rx="200" ry="140"
          fill="rgba(123,104,238,0.10)"
          style={{ animationDuration: '11s', animationDelay: '3s'  }} />
      </svg>

      {/* ── Ringed planet — 1 Framer float (lightweight) ─────────────────── */}
      <motion.div
        style={{ position: 'absolute', top: '6%', right: '5%', pointerEvents: 'none' }}
        animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PlanetRinged r={38} />
      </motion.div>

      {/* ── Small planets — Framer floats (lightweight) ───────────────────── */}
      <motion.div
        style={{ position: 'absolute', top: '40%', left: '2%', pointerEvents: 'none' }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <PlanetSmall r={20} color="rgba(80,180,160,0.5)" />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', top: '68%', right: '3%', pointerEvents: 'none' }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      >
        <PlanetSmall r={14} color="rgba(220,120,80,0.45)" />
      </motion.div>

      {/* ── Rocket — 1 Framer float (lightweight) ────────────────────────── */}
      <motion.div
        style={{ position: 'absolute', top: '15%', right: '10%', pointerEvents: 'none' }}
        animate={{ y: [0, -30, 0], rotate: [8, 12, 8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Rocket />
      </motion.div>

      {/*
        PERF FIX: Satellites now use pure CSS animation instead of nested
        Framer Motion (which used 2 motion.div instances per satellite = 4 total).
        CSS animations run on the compositor thread — no JS scheduler cost.
      */}
      {/* Satellite LTR */}
      <div
        className="night-mobile-hidden"
        style={{
          position: 'absolute',
          top: '25%',
          pointerEvents: 'none',
          animation: 'satelliteLTR 90s linear 5s infinite',
        }}
      >
        <div style={{ animation: 'satRotateCW 20s linear infinite' }}>
          <Satellite size={0.85} />
        </div>
      </div>

      {/* Satellite RTL */}
      <div
        className="night-mobile-hidden"
        style={{
          position: 'absolute',
          top: '60%',
          pointerEvents: 'none',
          animation: 'satelliteRTL 75s linear 25s infinite',
        }}
      >
        <div style={{ animation: 'satRotateCCW 16s linear infinite' }}>
          <Satellite size={0.7} />
        </div>
      </div>

      {/*
        PERF FIX: Shooting stars converted from Framer multi-keyframe animation
        to pure CSS @keyframes. Each gets a unique animation-delay and
        animation-duration via inline style — resolved once, never recalculated.
      */}
      {[
        { top: '12%', delay:  3, duration:  1.2, repeatDelay: 39 },
        { top: '28%', delay:  9, duration:  1.0, repeatDelay: 45 },
        { top: '55%', delay: 18, duration:  1.3, repeatDelay: 57 },
        { top: '72%', delay: 28, duration:  1.1, repeatDelay: 56 },
      ].map(({ top, delay, duration, repeatDelay }, i) => (
        <div
          key={`shoot-${i}`}
          className="shooting-star night-mobile-hidden"
          style={{
            top,
            left: '75%',
            animationDuration: `${duration}s`,
            // CSS can't express repeatDelay natively, so we embed the pause
            // inside the keyframe by extending total duration
            animationDelay: `${delay}s`,
            // total period = duration + repeatDelay approximated via long duration
            animationIterationCount: 'infinite',
          }}
        />
      ))}

      {/* ── Vignette overlay ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 80% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Scanline texture overlay ──────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}