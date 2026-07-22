'use client';

import { motion } from 'framer-motion';

// ─── Cloud SVG shapes ────────────────────────────────────────────────────────
// PERF FIX: Removed `filter: url(#realistic-cloud-filter)` (SVG feTurbulence +
// feDisplacementMap) from all clouds. That filter triggered per-frame CPU
// rasterization on every animated element — the #1 CPU cost in this component.
// The clouds still look great with ellipse-based shapes at normal viewport size.

const CloudLarge = ({ opacity = 0.82 }) => (
  <svg
    width="450" height="180" viewBox="0 0 450 180" fill="none"
    style={{ opacity, overflow: 'visible' }}
  >
    <ellipse cx="225" cy="115" rx="190" ry="50" fill="url(#cloud-grad-large)" />
    <ellipse cx="140" cy="90"  rx="100" ry="60" fill="url(#cloud-grad-large)" />
    <ellipse cx="240" cy="70"  rx="120" ry="70" fill="url(#cloud-grad-large)" />
    <ellipse cx="320" cy="90"  rx="90"  ry="55" fill="url(#cloud-grad-large)" />
    <ellipse cx="80"  cy="110" rx="60"  ry="40" fill="url(#cloud-grad-large)" />
  </svg>
);

const CloudMedium = ({ opacity = 0.75 }) => (
  <svg
    width="320" height="130" viewBox="0 0 320 130" fill="none"
    style={{ opacity, overflow: 'visible' }}
  >
    <ellipse cx="160" cy="85" rx="140" ry="38" fill="url(#cloud-grad-medium)" />
    <ellipse cx="105" cy="65" rx="75"  ry="45" fill="url(#cloud-grad-medium)" />
    <ellipse cx="180" cy="55" rx="90"  ry="55" fill="url(#cloud-grad-medium)" />
    <ellipse cx="240" cy="70" rx="70"  ry="40" fill="url(#cloud-grad-medium)" />
  </svg>
);

const CloudSmall = ({ opacity = 0.62 }) => (
  <svg
    width="200" height="90" viewBox="0 0 200 90" fill="none"
    style={{ opacity, overflow: 'visible' }}
  >
    <ellipse cx="100" cy="60" rx="85"  ry="25" fill="url(#cloud-grad-small)" />
    <ellipse cx="65"  cy="48" rx="45"  ry="30" fill="url(#cloud-grad-small)" />
    <ellipse cx="115" cy="40" rx="55"  ry="35" fill="url(#cloud-grad-small)" />
    <ellipse cx="155" cy="50" rx="40"  ry="24" fill="url(#cloud-grad-small)" />
  </svg>
);

// ─── Gradient defs (shared, rendered once) ───────────────────────────────────
const CloudGradDefs = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <linearGradient id="cloud-grad-large" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#ffffff" />
        <stop offset="65%"  stopColor="#f5f8fa" />
        <stop offset="100%" stopColor="#d2e0ed" />
      </linearGradient>
      <linearGradient id="cloud-grad-medium" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#ffffff" />
        <stop offset="70%"  stopColor="#f0f5fa" />
        <stop offset="100%" stopColor="#c5d6e6" />
      </linearGradient>
      <linearGradient id="cloud-grad-small" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#ffffff" />
        <stop offset="75%"  stopColor="#eef4fa" />
        <stop offset="100%" stopColor="#b9cbdc" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Sun (lightweight Framer — just 1 scale pulse, no heavy filter) ───────────
const Sun = () => (
  <motion.div
    style={{
      position: 'absolute',
      top: '-80px', left: '-80px',
      width: '45vw', height: '45vw',
      maxWidth: '600px', maxHeight: '600px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,248,200,0.4) 0%, rgba(255,220,50,0.15) 30%, rgba(135,206,235,0) 70%)',
      zIndex: 1,
      pointerEvents: 'none',
    }}
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  >
    <div
      style={{
        position: 'absolute',
        top: '32%', left: '32%',
        width: '100px', height: '100px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #FFFFFF 0%, #FFF4B0 30%, #FFD700 70%, #FF9F00 100%)',
        boxShadow: '0 0 50px 20px rgba(255,215,0,0.6), 0 0 100px 45px rgba(255,159,0,0.35)',
        animation: 'sunRotate 60s linear infinite',
      }}
    />
  </motion.div>
);

// ─── Kite (lightweight Framer — small element, acceptable) ────────────────────
const Kite = () => (
  <motion.div
    style={{ position: 'absolute', top: '7%', right: '7%', zIndex: 1 }}
    animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
      <polygon points="30,2 58,40 30,72 2,40" fill="#FF6B6B" opacity="0.88" />
      <polygon points="30,2 58,40 30,72 2,40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <line x1="2" y1="40" x2="58" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <line x1="30" y1="2"  x2="30" y2="72" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <path d="M30 72 Q22 85 30 95 Q38 105 30 115" stroke="rgba(255,107,107,0.7)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[80, 92, 104].map((y, i) => (
        <ellipse key={i} cx="30" cy={y} rx="5" ry="3" fill="#FFD700" opacity="0.8" />
      ))}
    </svg>
  </motion.div>
);

// ─── Hot Air Balloon (lightweight Framer) ─────────────────────────────────────
const HotAirBalloon = () => (
  <motion.div
    style={{ position: 'absolute', left: '3%', top: '38%', zIndex: 1 }}
    animate={{ y: [0, -25, 0] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  >
    <svg width="55" height="80" viewBox="0 0 55 80" fill="none">
      <ellipse cx="27" cy="28" rx="22" ry="26" fill="rgba(255,160,80,0.85)" />
      <path d="M5,28 Q27,2 49,28" fill="rgba(255,200,100,0.7)" />
      <path d="M12,12 Q27,2 42,12 Q27,30 12,12" fill="rgba(255,255,255,0.25)" />
      <path d="M8,30 Q27,18 46,30 Q27,48 8,30" fill="rgba(255,255,255,0.15)" />
      <line x1="16" y1="52" x2="19" y2="62" stroke="rgba(150,100,50,0.6)" strokeWidth="1.2" />
      <line x1="27" y1="54" x2="27" y2="62" stroke="rgba(150,100,50,0.6)" strokeWidth="1.2" />
      <line x1="38" y1="52" x2="35" y2="62" stroke="rgba(150,100,50,0.6)" strokeWidth="1.2" />
      <rect x="17" y="62" width="21" height="12" rx="3" fill="rgba(180,130,70,0.8)" />
      <rect x="17" y="62" width="21" height="12" rx="3" fill="none" stroke="rgba(150,100,50,0.5)" strokeWidth="1" />
    </svg>
  </motion.div>
);

// ─── Aircraft SVGs (static, no animation — they're wrapped in CSS animated divs)
const BirdShape = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <path d="M0,0 Q-8,-5 -14,0" stroke="rgba(60,80,100,0.7)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M0,0 Q8,-5 14,0"  stroke="rgba(60,80,100,0.7)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </g>
);

const FighterJet = ({ direction = 1 }) => (
  <svg width="70" height="28" viewBox="0 0 70 28" fill="none" style={{ transform: direction < 0 ? 'scaleX(-1)' : 'none' }}>
    <path d="M65,14 L10,8 L2,14 L10,20 Z" fill="rgba(160,180,200,0.75)" />
    <path d="M40,8 L28,2 L24,8 Z"         fill="rgba(140,160,180,0.7)" />
    <path d="M40,20 L28,26 L24,20 Z"       fill="rgba(140,160,180,0.7)" />
    <path d="M18,10 L10,6 L8,10 Z"         fill="rgba(120,140,160,0.65)" />
    <path d="M18,18 L10,22 L8,18 Z"        fill="rgba(120,140,160,0.65)" />
    <circle cx="58" cy="14" r="3"          fill="rgba(100,130,160,0.6)" />
    <path d="M2,14 Q-8,14 -20,14" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PrivatePlane = () => (
  <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
    <path d="M72,15 L8,10 L2,15 L8,20 Z"  fill="rgba(220,230,240,0.78)" />
    <path d="M50,10 L34,2 L30,10 Z"        fill="rgba(200,215,230,0.72)" />
    <path d="M50,20 L34,28 L30,20 Z"       fill="rgba(200,215,230,0.72)" />
    <path d="M22,12 L14,8 L12,12 Z"        fill="rgba(180,200,220,0.68)" />
    <ellipse cx="62" cy="15" rx="6" ry="4" fill="rgba(160,200,220,0.55)" />
    <ellipse cx="52" cy="15" rx="4" ry="3" fill="rgba(160,200,220,0.5)" />
    <path d="M2,15 Q-12,15 -22,15" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ─── CSS-animated cloud data ──────────────────────────────────────────────────
// PERF FIX: Reduced from 9 to 5 clouds (odd-indexed ones removed matching the
// original mobile-hidden pattern). All moved to pure CSS @keyframes animation
// which runs on the GPU compositor — zero Framer Motion JS scheduler cost.
const clouds = [
  { id: 'c1', Type: CloudLarge,  top: '6%',  duration: 62, delay: 0,  opacity: 0.88 },
  { id: 'c3', Type: CloudLarge,  top: '22%', duration: 70, delay: 18, opacity: 0.72 },
  { id: 'c5', Type: CloudMedium, top: '42%', duration: 52, delay: 22, opacity: 0.70 },
  { id: 'c7', Type: CloudLarge,  top: '65%', duration: 66, delay: 30, opacity: 0.62 },
  { id: 'c9', Type: CloudSmall,  top: '88%', duration: 28, delay: 16, opacity: 0.48 },
];

const birdFlocks = [
  { id: 'b1', top: '12%', duration: 32, delay: 4,  scale: 1.0 },
  { id: 'b2', top: '28%', duration: 42, delay: 18, scale: 0.8 },
  { id: 'b3', top: '50%', duration: 38, delay: 28, scale: 0.7 },
];

const planes = [
  { id: 'p1', top: '4%',  type: 'fighter', duration: 48, delay: 10, direction:  1 },
  { id: 'p2', top: '18%', type: 'private', duration: 72, delay: 35, direction: -1 },
  { id: 'p3', top: '8%',  type: 'fighter', duration: 55, delay: 55, direction:  1 },
];

// CSS for all the moving elements — runs on compositor thread, not JS thread
const DAY_CSS = `
  @keyframes sunRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @keyframes cloudMove {
    from { transform: translateX(-450px); }
    to   { transform: translateX(110vw);  }
  }
  @keyframes birdMove {
    from { transform: translateX(-120px); }
    to   { transform: translateX(110vw);  }
  }
  @keyframes planeMoveLTR {
    from { transform: translateX(-120px); }
    to   { transform: translateX(110vw);  }
  }
  @keyframes planeMoveRTL {
    from { transform: translateX(110vw);  }
    to   { transform: translateX(-120px); }
  }
  @keyframes streakMove {
    0%   { transform: translateX(-200px); opacity: 0; }
    10%  { opacity: 0.5; }
    90%  { opacity: 0.5; }
    100% { transform: translateX(110vw);  opacity: 0; }
  }

  @media (max-width: 768px) {
    .day-mobile-hidden { display: none !important; }
  }
`;

export default function DayBackground() {
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
          #1d72b4 0%,
          #4ea8de 25%,
          #87CEEB 60%,
          #b8e4f7 85%,
          #d5f0ff 100%
        )`,
      }}
    >
      <style>{DAY_CSS}</style>

      {/* Gradient defs — rendered once, zero cost */}
      <CloudGradDefs />

      {/* Atmospheric haze overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Horizon glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: 'linear-gradient(to top, rgba(220,245,255,0.55) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Sun — 1 Framer pulse (lightweight, acceptable) */}
      <Sun />

      {/* Kite — 1 Framer float (lightweight, acceptable) */}
      <Kite />

      {/* Hot Air Balloon — 1 Framer float (lightweight, acceptable) */}
      <HotAirBalloon />

      {/*
        PERF FIX: Clouds now use pure CSS animation instead of Framer Motion.
        `animation-fill-mode: forwards` + `animation-iteration-count: infinite`
        keeps the loop running entirely on the GPU compositor thread.
      */}
      {clouds.map(({ id, Type, top, duration, delay, opacity }) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            top,
            pointerEvents: 'none',
            animationName: 'cloudMove',
            animationDuration: `${duration}s`,
            animationDelay: `${-delay}s`,   // negative delay = instant start mid-cycle
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        >
          <Type opacity={opacity} />
        </div>
      ))}

      {/* Birds — CSS animated */}
      {birdFlocks.map(({ id, top, duration, delay, scale }) => (
        <div
          key={id}
          className="day-mobile-hidden"
          style={{
            position: 'absolute',
            top,
            pointerEvents: 'none',
            animationName: 'birdMove',
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
            <BirdShape x={50} y={12} scale={scale} />
            <BirdShape x={35} y={22} scale={scale * 0.9} />
            <BirdShape x={65} y={22} scale={scale * 0.9} />
            <BirdShape x={22} y={32} scale={scale * 0.8} />
            <BirdShape x={78} y={32} scale={scale * 0.8} />
          </svg>
        </div>
      ))}

      {/* Planes — CSS animated */}
      {planes.map(({ id, top, type, duration, delay, direction }) => (
        <div
          key={id}
          className="day-mobile-hidden"
          style={{
            position: 'absolute',
            top,
            pointerEvents: 'none',
            animationName: direction > 0 ? 'planeMoveLTR' : 'planeMoveRTL',
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {type === 'fighter'
            ? <FighterJet direction={direction} />
            : <PrivatePlane />
          }
        </div>
      ))}

      {/* Light streaks — CSS animated */}
      {[18, 38, 62, 82].map((top, i) => (
        <div
          key={`streak-${i}`}
          className="day-mobile-hidden"
          style={{
            position: 'absolute',
            top: `${top}%`,
            height: '2px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.22)',
            pointerEvents: 'none',
            width: `${80 + i * 30}px`,
            animationName: 'streakMove',
            animationDuration: `${25 + i * 8}s`,
            animationDelay: `${i * 7 + 3}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
}
