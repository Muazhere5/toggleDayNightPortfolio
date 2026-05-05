'use client';

// ============================================================
// DayVision/page.jsx — ANIMATED DAYTIME SKY BACKGROUND
//
// CONNECTION MAP:
//   page.jsx (root) → dynamically imports this file
//   globals.css     → provides --day-* CSS variables used here
//   layout.jsx      → applies .day-mode class to <body>
//
// This component renders as a FIXED full-viewport background
// layer (z-index: 0) behind all content sections.
// It is only mounted when theme === 'day' in page.jsx.
//
// All objects are pure inline SVG + CSS/framer-motion.
// Zero external image files required for the background itself.
// ============================================================

import { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

// ── CLOUD SVG SHAPES ─────────────────────────────────────────
// Three sizes, all pure SVG — no image files needed
const CloudLarge = ({ opacity = 0.82 }) => (
  <svg width="320" height="100" viewBox="0 0 320 100" fill="none">
    <ellipse cx="160" cy="75" rx="145" ry="38" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="100" cy="58" rx="72" ry="42" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="175" cy="48" rx="88" ry="52" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="245" cy="60" rx="65" ry="38" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="55"  cy="68" rx="48" ry="28" fill={`rgba(255,255,255,${opacity * 0.9})`} />
  </svg>
);

const CloudMedium = ({ opacity = 0.75 }) => (
  <svg width="210" height="70" viewBox="0 0 210 70" fill="none">
    <ellipse cx="105" cy="52" rx="95"  ry="26" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="70"  cy="40" rx="52"  ry="32" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="118" cy="33" rx="62"  ry="38" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="168" cy="44" rx="44"  ry="26" fill={`rgba(255,255,255,${opacity})`} />
  </svg>
);

const CloudSmall = ({ opacity = 0.62 }) => (
  <svg width="130" height="46" viewBox="0 0 130 46" fill="none">
    <ellipse cx="65"  cy="34" rx="58"  ry="18" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="42"  cy="26" rx="32"  ry="22" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="78"  cy="22" rx="38"  ry="24" fill={`rgba(255,255,255,${opacity})`} />
    <ellipse cx="108" cy="30" rx="26"  ry="16" fill={`rgba(255,255,255,${opacity})`} />
  </svg>
);

// ── SUN ───────────────────────────────────────────────────────
const Sun = () => (
  <motion.div
    style={{ position: 'absolute', top: '5%', left: '6%', zIndex: 1 }}
    animate={{ scale: [1, 1.06, 1], opacity: [0.92, 1, 0.92] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      {/* Outer glow rays */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
        <line
          key={i}
          x1="44" y1="44"
          x2={44 + 38 * Math.cos((angle * Math.PI) / 180)}
          y2={44 + 38 * Math.sin((angle * Math.PI) / 180)}
          stroke="rgba(255,215,0,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      {/* Sun body */}
      <circle cx="44" cy="44" r="22" fill="#FFD700" opacity="0.95" />
      <circle cx="44" cy="44" r="17" fill="#FFEC6E" opacity="0.9" />
      {/* Inner glow */}
      <circle cx="44" cy="44" r="28" fill="rgba(255,215,0,0.15)" />
      <circle cx="44" cy="44" r="34" fill="rgba(255,215,0,0.07)" />
    </svg>
  </motion.div>
);

// ── KITE ─────────────────────────────────────────────────────
const Kite = () => (
  <motion.div
    style={{ position: 'absolute', top: '7%', right: '7%', zIndex: 1 }}
    animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
      {/* Kite body */}
      <polygon points="30,2 58,40 30,72 2,40" fill="#FF6B6B" opacity="0.88" />
      <polygon points="30,2 58,40 30,72 2,40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      {/* Cross lines */}
      <line x1="2" y1="40" x2="58" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <line x1="30" y1="2" x2="30" y2="72" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      {/* Tail */}
      <path d="M30 72 Q22 85 30 95 Q38 105 30 115" stroke="rgba(255,107,107,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tail bows */}
      {[80, 92, 104].map((y, i) => (
        <ellipse key={i} cx="30" cy={y} rx="5" ry="3" fill="#FFD700" opacity="0.8" />
      ))}
    </svg>
  </motion.div>
);

// ── BIRD FLOCK ────────────────────────────────────────────────
const BirdShape = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <path d="M0,0 Q-8,-5 -14,0" stroke="rgba(60,80,100,0.7)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M0,0 Q8,-5 14,0"  stroke="rgba(60,80,100,0.7)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </g>
);

// ── HOT AIR BALLOON ───────────────────────────────────────────
const HotAirBalloon = () => (
  <motion.div
    style={{ position: 'absolute', left: '3%', top: '38%', zIndex: 1 }}
    animate={{ y: [0, -25, 0] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg width="55" height="80" viewBox="0 0 55 80" fill="none">
      {/* Balloon */}
      <ellipse cx="27" cy="28" rx="22" ry="26" fill="rgba(255,160,80,0.85)" />
      <path d="M5,28 Q27,2 49,28" fill="rgba(255,200,100,0.7)" />
      {/* Stripes */}
      <path d="M12,12 Q27,2 42,12 Q27,30 12,12" fill="rgba(255,255,255,0.25)" />
      <path d="M8,30 Q27,18 46,30 Q27,48 8,30" fill="rgba(255,255,255,0.15)" />
      {/* Ropes */}
      <line x1="16" y1="52" x2="19" y2="62" stroke="rgba(150,100,50,0.6)" strokeWidth="1.2" />
      <line x1="27" y1="54" x2="27" y2="62" stroke="rgba(150,100,50,0.6)" strokeWidth="1.2" />
      <line x1="38" y1="52" x2="35" y2="62" stroke="rgba(150,100,50,0.6)" strokeWidth="1.2" />
      {/* Basket */}
      <rect x="17" y="62" width="21" height="12" rx="3" fill="rgba(180,130,70,0.8)" />
      <rect x="17" y="62" width="21" height="12" rx="3" fill="none" stroke="rgba(150,100,50,0.5)" strokeWidth="1" />
    </svg>
  </motion.div>
);

// ── FIGHTER JET ───────────────────────────────────────────────
const FighterJet = ({ direction = 1 }) => (
  <svg width="70" height="28" viewBox="0 0 70 28" fill="none" style={{ transform: direction < 0 ? 'scaleX(-1)' : 'none' }}>
    <path d="M65,14 L10,8 L2,14 L10,20 Z" fill="rgba(160,180,200,0.75)" />
    <path d="M40,8 L28,2 L24,8 Z" fill="rgba(140,160,180,0.7)" />
    <path d="M40,20 L28,26 L24,20 Z" fill="rgba(140,160,180,0.7)" />
    <path d="M18,10 L10,6 L8,10 Z" fill="rgba(120,140,160,0.65)" />
    <path d="M18,18 L10,22 L8,18 Z" fill="rgba(120,140,160,0.65)" />
    <circle cx="58" cy="14" r="3" fill="rgba(100,130,160,0.6)" />
    {/* Exhaust trail */}
    <path d="M2,14 Q-8,14 -20,14" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ── PRIVATE PLANE ─────────────────────────────────────────────
const PrivatePlane = () => (
  <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
    <path d="M72,15 L8,10 L2,15 L8,20 Z" fill="rgba(220,230,240,0.78)" />
    <path d="M50,10 L34,2 L30,10 Z" fill="rgba(200,215,230,0.72)" />
    <path d="M50,20 L34,28 L30,20 Z" fill="rgba(200,215,230,0.72)" />
    <path d="M22,12 L14,8 L12,12 Z" fill="rgba(180,200,220,0.68)" />
    <ellipse cx="62" cy="15" rx="6" ry="4" fill="rgba(160,200,220,0.55)" />
    <ellipse cx="52" cy="15" rx="4" ry="3" fill="rgba(160,200,220,0.5)" />
    <path d="M2,15 Q-12,15 -22,15" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ══════════════════════════════════════════════════════════════
// MAIN DAY BACKGROUND COMPONENT
// ══════════════════════════════════════════════════════════════
export default function DayBackground() {

  // ── CLOUD CONFIGS ─────────────────────────────────────────
  // Each cloud: type, vertical position, animation duration, delay, opacity, blur
  const clouds = [
    { id: 'c1', Type: CloudLarge,  top: '6%',  duration: 62, delay: 0,  opacity: 0.88, blur: 0 },
    { id: 'c2', Type: CloudMedium, top: '14%', duration: 44, delay: 8,  opacity: 0.78, blur: 0 },
    { id: 'c3', Type: CloudLarge,  top: '22%', duration: 70, delay: 18, opacity: 0.72, blur: 0.5 },
    { id: 'c4', Type: CloudSmall,  top: '30%', duration: 35, delay: 5,  opacity: 0.65, blur: 0 },
    { id: 'c5', Type: CloudMedium, top: '42%', duration: 52, delay: 22, opacity: 0.70, blur: 0.3 },
    { id: 'c6', Type: CloudSmall,  top: '55%', duration: 30, delay: 12, opacity: 0.58, blur: 0 },
    { id: 'c7', Type: CloudLarge,  top: '65%', duration: 66, delay: 30, opacity: 0.62, blur: 0.8 },
    { id: 'c8', Type: CloudMedium, top: '78%', duration: 40, delay: 3,  opacity: 0.55, blur: 0 },
    { id: 'c9', Type: CloudSmall,  top: '88%', duration: 28, delay: 16, opacity: 0.48, blur: 0 },
  ];

  // ── BIRD FLOCK CONFIGS ────────────────────────────────────
  const birdFlocks = [
    { id: 'b1', top: '12%', duration: 32, delay: 4,  scale: 1.0 },
    { id: 'b2', top: '28%', duration: 42, delay: 18, scale: 0.8 },
    { id: 'b3', top: '50%', duration: 38, delay: 28, scale: 0.7 },
  ];

  // ── PLANE CONFIGS ─────────────────────────────────────────
  const planes = [
    { id: 'p1', top: '4%',  type: 'fighter',  duration: 48, delay: 10, direction: 1  },
    { id: 'p2', top: '18%', type: 'private',  duration: 72, delay: 35, direction: -1 },
    { id: 'p3', top: '8%',  type: 'fighter',  duration: 55, delay: 55, direction: 1  },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        // Multi-layer sky gradient — deep blue at top, lighter at horizon
        background: `
          linear-gradient(
            180deg,
            #5BB8E8 0%,
            #87CEEB 25%,
            #A8DCEE 50%,
            #C5E8F5 72%,
            #D8F0FA 88%,
            #E8F6FC 100%
          )
        `,
      }}
    >
      {/* ── ATMOSPHERIC DEPTH OVERLAY ──────────────────────
          Subtle radial gradient gives depth — brighter center
          fades to slightly deeper blue at edges               */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── HORIZON HAZE ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: 'linear-gradient(to top, rgba(220,245,255,0.55) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── SUN ──────────────────────────────────────────── */}
      <Sun />

      {/* ── KITE ─────────────────────────────────────────── */}
      <Kite />

      {/* ── HOT AIR BALLOON ──────────────────────────────── */}
      <HotAirBalloon />

      {/* ── CLOUDS ───────────────────────────────────────── */}
      {clouds.map(({ id, Type, top, duration, delay, opacity, blur }) => (
        <motion.div
          key={id}
          style={{
            position: 'absolute',
            top,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
            pointerEvents: 'none',
          }}
          initial={{ x: '-300px' }}
          animate={{ x: '110vw' }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'linear',
            // Randomise restart so clouds don't bunch up
            repeatDelay: Math.random() * 8,
          }}
        >
          <Type opacity={opacity} />
        </motion.div>
      ))}

      {/* ── BIRD FLOCKS ──────────────────────────────────── */}
      {birdFlocks.map(({ id, top, duration, delay, scale }) => (
        <motion.div
          key={id}
          style={{ position: 'absolute', top, pointerEvents: 'none' }}
          initial={{ x: '-120px' }}
          animate={{ x: '110vw' }}
          transition={{ duration, delay, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
        >
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
            {/* V-formation: lead bird + 4 followers */}
            <BirdShape x={50} y={12} scale={scale} />
            <BirdShape x={35} y={22} scale={scale * 0.9} />
            <BirdShape x={65} y={22} scale={scale * 0.9} />
            <BirdShape x={22} y={32} scale={scale * 0.8} />
            <BirdShape x={78} y={32} scale={scale * 0.8} />
          </svg>
        </motion.div>
      ))}

      {/* ── PLANES ───────────────────────────────────────── */}
      {planes.map(({ id, top, type, duration, delay, direction }) => (
        <motion.div
          key={id}
          style={{ position: 'absolute', top, pointerEvents: 'none' }}
          initial={{ x: direction > 0 ? '-120px' : '110vw' }}
          animate={{ x: direction > 0 ? '110vw' : '-120px' }}
          transition={{ duration, delay, repeat: Infinity, ease: 'linear', repeatDelay: 10 }}
        >
          {type === 'fighter'
            ? <FighterJet direction={direction} />
            : <PrivatePlane />
          }
        </motion.div>
      ))}

      {/* ── SMALL FLOATING WISPY STREAKS ─────────────────── 
          Thin horizontal light streaks add realism to sky      */}
      {[18, 38, 62, 82].map((top, i) => (
        <motion.div
          key={`streak-${i}`}
          style={{
            position: 'absolute',
            top: `${top}%`,
            height: '2px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.22)',
            pointerEvents: 'none',
            width: `${80 + i * 30}px`,
          }}
          initial={{ x: '-200px', opacity: 0 }}
          animate={{ x: '110vw', opacity: [0, 0.5, 0.5, 0] }}
          transition={{
            duration: 25 + i * 8,
            delay: i * 7 + 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

    </div>
  );
}
