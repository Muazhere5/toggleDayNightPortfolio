'use client';

// ============================================================
// app/NightVision/page.jsx — ANIMATED DEEP SPACE BACKGROUND
//
// CONNECTION MAP:
//   app/page.jsx    → dynamically imports this with ssr:false
//   app/globals.css → --night-* CSS variables available here
//   app/layout.jsx  → ThemeProvider adds .night-mode to <body>
//
// POSITION: Fixed full-viewport, z-index 0, behind all content.
// MOUNTED:  Only when theme === 'night' in page.jsx.
//
// OBJECTS (all inline SVG + framer-motion, zero image files):
//   220 twinkling stars   → deterministic, never re-randomises
//   5 nebula blobs        → soft purple/teal/blue glow
//   1 ringed planet       → top-right, floats gently
//   2 small planets       → sides, floating at different speeds
//   1 rocket              → right side, bobs + rotates
//   2 satellites          → drift across screen both directions
//   4 shooting stars      → fire on staggered timers
//   Parallax star layer   → stars move slower than content
//   Deep space vignette   → darkens edges, content pops
//   Scan line texture     → subtle CRT monitor effect
// ============================================================

import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── STAR FIELD ────────────────────────────────────────────────
// Deterministic random so stars never jump on re-render.
// Uses a linear congruential generator seeded at 42.
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
      y: rand() * 100,
      r: rand() * 1.6 + 0.3,
      delay: rand() * 5,
      duration: rand() * 3 + 2,
      brightness: rand() * 0.6 + 0.4,
    });
  }
  return stars;
}

// ── NEBULA BLOB ───────────────────────────────────────────────
const NebulaBlob = ({ cx, cy, rx, ry, color, duration, delay }) => (
  <motion.ellipse
    cx={cx} cy={cy} rx={rx} ry={ry}
    fill={color}
    style={{ filter: 'blur(60px)' }}
    animate={{ opacity: [0.06, 0.15, 0.06], scale: [1, 1.08, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ── ROCKET ────────────────────────────────────────────────────
const Rocket = () => (
  <svg width="36" height="72" viewBox="0 0 36 72" fill="none">
    {/* Body */}
    <path d="M18,2 Q30,10 30,30 L30,52 L18,60 L6,52 L6,30 Q6,10 18,2Z"
      fill="rgba(200,200,220,0.82)" />
    {/* Window */}
    <circle cx="18" cy="28" r="7" fill="rgba(100,180,255,0.6)" />
    <circle cx="18" cy="28" r="5" fill="rgba(140,210,255,0.45)" />
    {/* Fins */}
    <path d="M6,44 L0,58 L6,54Z"  fill="rgba(160,160,190,0.75)" />
    <path d="M30,44 L36,58 L30,54Z" fill="rgba(160,160,190,0.75)" />
    {/* Flame */}
    <ellipse cx="18" cy="64" rx="6"   ry="10" fill="rgba(255,140,0,0.7)" />
    <ellipse cx="18" cy="64" rx="3.5" ry="7"  fill="rgba(255,220,50,0.8)" />
    <ellipse cx="18" cy="62" rx="2"   ry="4"  fill="rgba(255,255,200,0.9)" />
    {/* Stripe */}
    <rect x="6" y="34" width="24" height="4" rx="2" fill="rgba(123,104,238,0.55)" />
  </svg>
);

// ── SATELLITE ─────────────────────────────────────────────────
const Satellite = ({ size = 1 }) => (
  <svg width={52 * size} height={22 * size} viewBox="0 0 52 22" fill="none">
    {/* Body */}
    <rect x="18" y="6" width="16" height="10" rx="3"
      fill="rgba(180,190,210,0.78)"
      stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    {/* Solar panel left */}
    <rect x="2" y="4" width="14" height="14" rx="2"
      fill="rgba(60,100,180,0.65)"
      stroke="rgba(100,150,220,0.4)" strokeWidth="0.8" />
    <line x1="2"  y1="11" x2="16" y2="11" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="9"  y1="4"  x2="9"  y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    {/* Solar panel right */}
    <rect x="36" y="4" width="14" height="14" rx="2"
      fill="rgba(60,100,180,0.65)"
      stroke="rgba(100,150,220,0.4)" strokeWidth="0.8" />
    <line x1="36" y1="11" x2="50" y2="11" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <line x1="43" y1="4"  x2="43" y2="18" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    {/* Antenna */}
    <line x1="26" y1="6" x2="26" y2="1" stroke="rgba(200,200,220,0.6)" strokeWidth="0.8" />
    <circle cx="26" cy="1" r="1.2" fill="rgba(255,80,80,0.8)" />
  </svg>
);

// ── RINGED PLANET ─────────────────────────────────────────────
const PlanetRinged = ({ r = 28 }) => (
  <svg width={r * 4} height={r * 3} viewBox={`0 0 ${r * 4} ${r * 3}`} fill="none">
    {/* Ring back */}
    <ellipse cx={r * 2} cy={r * 1.5} rx={r * 1.7} ry={r * 0.45}
      stroke="rgba(180,140,255,0.35)" strokeWidth={r * 0.22} fill="none" opacity="0.5" />
    {/* Body */}
    <circle cx={r * 2} cy={r * 1.5} r={r} fill="rgba(140,100,220,0.55)" />
    <circle cx={r * 2} cy={r * 1.5} r={r} fill="rgba(255,255,255,0.06)" />
    {/* Surface bands */}
    <ellipse cx={r * 2} cy={r * 1.2} rx={r * 0.85} ry={r * 0.18} fill="rgba(255,255,255,0.07)" />
    <ellipse cx={r * 2} cy={r * 1.7} rx={r * 0.75} ry={r * 0.14} fill="rgba(255,255,255,0.05)" />
    {/* Ring front */}
    <ellipse cx={r * 2} cy={r * 1.5} rx={r * 1.7} ry={r * 0.45}
      stroke="rgba(180,140,255,0.35)" strokeWidth={r * 0.22} fill="none"
      strokeDasharray={`${r * 5.35} ${r * 5.35}`}
      strokeDashoffset={`${r * 5.35}`} opacity="0.7" />
  </svg>
);

// ── SMALL PLANET ──────────────────────────────────────────────
const PlanetSmall = ({ r = 16, color = 'rgba(80,180,160,0.5)' }) => (
  <svg width={r * 2 + 4} height={r * 2 + 4} viewBox={`0 0 ${r * 2 + 4} ${r * 2 + 4}`} fill="none">
    <circle cx={r + 2} cy={r + 2} r={r} fill={color} />
    <circle cx={r + 2} cy={r + 2} r={r} fill="rgba(255,255,255,0.05)" />
    <ellipse cx={r + 2} cy={r + 2 - r * 0.2} rx={r * 0.7} ry={r * 0.15}
      fill="rgba(255,255,255,0.08)" />
  </svg>
);

// ── SHOOTING STAR ─────────────────────────────────────────────
const ShootingStar = ({ top, delay }) => (
  <motion.div
    style={{
      position: 'absolute',
      top,
      left: '75%',
      width: '120px',
      height: '2px',
      borderRadius: '999px',
      background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 100%)',
      transform: 'rotate(-35deg)',
      transformOrigin: 'right center',
      pointerEvents: 'none',
    }}
    initial={{ opacity: 0, scaleX: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scaleX: [0, 1, 1, 0.3],
      x: [0, -160],
      y: [0, 90],
    }}
    transition={{
      duration: 1.2,
      delay,
      repeat: Infinity,
      repeatDelay: 12 + delay * 3,
      ease: 'easeOut',
    }}
  />
);

// ══════════════════════════════════════════════════════════════
// MAIN NIGHT BACKGROUND COMPONENT
// ══════════════════════════════════════════════════════════════
export default function NightBackground() {

  // Memoised stars — generated once, never re-randomises on re-render
  const stars = useMemo(() => generateStars(220), []);

  // Parallax — star layer drifts slower than page content on scroll
  const { scrollY } = useScroll();
  const starsY = useTransform(scrollY, [0, 3000], [0, -120]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        // Deep space gradient — true black at top, deep navy at bottom
        background: `
          linear-gradient(
            180deg,
            #000000 0%,
            #020208 20%,
            #050510 45%,
            #070715 70%,
            #0a0a1e 88%,
            #0d0d22 100%
          )
        `,
      }}
    >

      {/* ── STAR FIELD — parallax layer ───────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: starsY,
          pointerEvents: 'none',
        }}
      >
        <svg
          width="100%" height="130%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          preserveAspectRatio="none"
        >
          {stars.map(({ id, x, y, r, delay, duration, brightness }) => (
            <motion.circle
              key={id}
              cx={`${x}%`} cy={`${y}%`} r={r}
              fill={`rgba(255,255,255,${brightness})`}
              animate={{ opacity: [brightness, brightness * 0.2, brightness] }}
              transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </svg>
      </motion.div>

      {/* ── NEBULA BLOBS ──────────────────────────────────── */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
      >
        <NebulaBlob cx="15%"  cy="20%"  rx="280" ry="180"
          color="rgba(123,104,238,0.12)" duration={8}  delay={0} />
        <NebulaBlob cx="80%"  cy="15%"  rx="220" ry="150"
          color="rgba(80,140,255,0.09)"  duration={10} delay={2} />
        <NebulaBlob cx="60%"  cy="55%"  rx="300" ry="200"
          color="rgba(160,80,220,0.08)"  duration={12} delay={4} />
        <NebulaBlob cx="20%"  cy="75%"  rx="250" ry="160"
          color="rgba(50,200,180,0.07)"  duration={9}  delay={1} />
        <NebulaBlob cx="90%"  cy="80%"  rx="200" ry="140"
          color="rgba(123,104,238,0.10)" duration={11} delay={3} />
      </svg>

      {/* ── RINGED PLANET — top-right, floats gently ─────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '6%', right: '5%',
          pointerEvents: 'none',
        }}
        animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PlanetRinged r={38} />
      </motion.div>

      {/* ── SMALL PLANET — left side mid ─────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '40%', left: '2%',
          pointerEvents: 'none',
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <PlanetSmall r={20} color="rgba(80,180,160,0.5)" />
      </motion.div>

      {/* ── SMALL PLANET — right side lower ─────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '68%', right: '3%',
          pointerEvents: 'none',
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      >
        <PlanetSmall r={14} color="rgba(220,120,80,0.45)" />
      </motion.div>

      {/* ── ROCKET — right side, floats + tilts ─────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%', right: '10%',
          pointerEvents: 'none',
        }}
        animate={{ y: [0, -30, 0], rotate: [8, 12, 8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Rocket />
      </motion.div>

      {/* ── SATELLITE 1 — drifts left to right slowly ───── */}
      <motion.div
        style={{ position: 'absolute', top: '25%', pointerEvents: 'none' }}
        initial={{ x: '-80px' }}
        animate={{ x: '110vw' }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Satellite size={0.85} />
        </motion.div>
      </motion.div>

      {/* ── SATELLITE 2 — drifts right to left ──────────── */}
      <motion.div
        style={{ position: 'absolute', top: '60%', pointerEvents: 'none' }}
        initial={{ x: '110vw' }}
        animate={{ x: '-100px' }}
        transition={{
          duration: 75,
          repeat: Infinity,
          ease: 'linear',
          delay: 25,
        }}
      >
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          <Satellite size={0.7} />
        </motion.div>
      </motion.div>

      {/* ── SHOOTING STARS ───────────────────────────────── */}
      <ShootingStar top="12%"  delay={3}  />
      <ShootingStar top="28%"  delay={9}  />
      <ShootingStar top="55%"  delay={18} />
      <ShootingStar top="72%"  delay={28} />

      {/* ── DEEP SPACE VIGNETTE ───────────────────────────
          Darkens edges so content cards pop off background  */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 80% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── SCAN LINE TEXTURE ─────────────────────────────
          Very faint horizontal lines — deep-space monitor feel */}
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