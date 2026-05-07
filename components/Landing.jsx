'use client';

// ============================================================
// components/Landing.jsx — HERO / LANDING SECTION
//
// CONNECTION MAP:
//   page.jsx       → mounts <Landing theme={theme} />
//   globals.css    → base styles, CSS variables, fonts
//   DayVision/     → sky background already fixed behind this
//   NightVision/   → space background already fixed behind this
//   public/assets/character/character-day.gif   → day GIF
//   public/assets/character/character-night.gif → night GIF
//
// PROPS:
//   theme {string} 'day' | 'night' — controls all conditional styles
//
// SECTIONS INSIDE:
//   1. GIF bubble (with orbiting decorations)
//   2. Text block (greeting, typing name, subtitle, tags)
//   3. Explore button (scrolls to #projects)
//   4. Scroll indicator (bouncing arrow at bottom)
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// ── TECH STACK TAGS ──────────────────────────────────────────
const TECH_TAGS = ['ReactJS', 'Next.js', 'Node.js', 'MongoDB', 'Express'];

// ── TYPING HOOK — animates text letter by letter ─────────────
function useTypingEffect(text, startDelay = 700, speed = 85) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i     = 0;
    let timer = null;

    const start = setTimeout(() => {
      timer = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(timer);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => { clearTimeout(start); clearInterval(timer); };
  }, [text, startDelay, speed]);

  return { displayed, done };
}

// ── SMALL CLOUD (day decoration around bubble) ───────────────
const MiniCloud = ({ style }) => (
  <svg width="72" height="30" viewBox="0 0 72 30" fill="none" style={style}>
    <ellipse cx="36" cy="22" rx="32" ry="12" fill="rgba(255,255,255,0.72)" />
    <ellipse cx="22" cy="16" rx="16" ry="12" fill="rgba(255,255,255,0.72)" />
    <ellipse cx="40" cy="13" rx="20" ry="14" fill="rgba(255,255,255,0.72)" />
    <ellipse cx="58" cy="18" rx="14" ry="10" fill="rgba(255,255,255,0.65)" />
  </svg>
);

// ── ORBITING STAR (night decoration around bubble) ───────────
const OrbitStar = ({ radius, duration, delay, size = 4 }) => (
  <motion.div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: size,
      height: size,
      marginTop: -size / 2,
      marginLeft: -size / 2,
      pointerEvents: 'none',
    }}
    animate={{
      rotate: [0, 360],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    transformTemplate={({ rotate }) =>
      `rotate(${rotate}) translateX(${radius}px)`
    }
  >
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.9)',
      boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.6)`,
    }} />
  </motion.div>
);

// ── SCROLL INDICATOR ─────────────────────────────────────────
const ScrollIndicator = ({ isDay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2.2, duration: 0.6 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      marginTop: '48px',
    }}
  >
    <span style={{
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: '0.68rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(200,210,240,0.6)',
    }}>
      {isDay ? 'Explore Below' : 'Begin Mission'}
    </span>

    {/* Bouncing arrow */}
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {isDay ? (
        // Paper plane pointing down
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2 L20 11 L11 8 L2 11 Z" fill="rgba(255,255,255,0.85)" />
          <path d="M11 8 L11 20" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 16 L11 20 L15 16" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ) : (
        // Mini rocket pointing down
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2 Q16 6 16 13 L11 16 L6 13 Q6 6 11 2Z" fill="rgba(200,210,240,0.85)" />
          <circle cx="11" cy="9" r="2.5" fill="rgba(100,180,255,0.7)" />
          <path d="M8 14 L6 18 L8 17Z" fill="rgba(160,160,190,0.75)" />
          <path d="M14 14 L16 18 L14 17Z" fill="rgba(160,160,190,0.75)" />
          <ellipse cx="11" cy="17" rx="2.5" ry="3.5" fill="rgba(255,140,0,0.7)" />
        </svg>
      )}
    </motion.div>
  </motion.div>
);

// ── FRAMER MOTION VARIANTS ────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial:    { opacity: 0, x: -32 },
  animate:    { opacity: 1, x: 0   },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const scaleIn = (delay = 0) => ({
  initial:    { opacity: 0, scale: 0.82 },
  animate:    { opacity: 1, scale: 1    },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Landing({ theme }) {
  const isDay = theme === 'day';

  // Typing effect for name — restarts when theme switches
  const { displayed: typedName, done: typingDone } = useTypingEffect(
    'Muaz', 750, 90
  );

  // Explore button smooth scroll
  const handleExplore = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ── STYLES ─────────────────────────────────────────────────
  const sectionStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px 40px',
    position: 'relative',
    zIndex: 1,
  };

  const innerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '64px',
    width: '100%',
    maxWidth: '1000px',
    flexWrap: 'wrap',
  };

  // GIF bubble outer ring
  const bubbleWrapStyle = {
    position: 'relative',
    width: '280px',
    height: '280px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // GIF bubble container
  const bubbleStyle = {
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    overflow: 'hidden',
    position: 'relative',
    background: isDay
      ? 'rgba(255,255,255,0.25)'
      : 'rgba(10,10,30,0.6)',
    border: isDay
      ? '3px solid rgba(255,255,255,0.7)'
      : '3px solid rgba(123,104,238,0.5)',
    boxShadow: isDay
      ? '0 0 0 8px rgba(255,255,255,0.12), 0 12px 50px rgba(46,134,193,0.3), 0 0 80px rgba(135,206,235,0.2)'
      : '0 0 0 8px rgba(123,104,238,0.08), 0 12px 50px rgba(0,0,0,0.7), 0 0 60px rgba(123,104,238,0.25)',
    backdropFilter: 'blur(8px)',
    transition: 'border 0.8s ease, box-shadow 0.8s ease',
  };

  const gifStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
  };

  // Text block
  const textBlockStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '14px',
    maxWidth: '420px',
  };

  const greetingStyle = {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '1.05rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: isDay ? 'rgba(255,255,255,0.85)' : 'rgba(200,210,240,0.75)',
  };

  const nameStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
    fontWeight: 900,
    lineHeight: 1.05,
    color: isDay ? '#ffffff' : '#E8E8F0',
    textShadow: isDay
      ? '0 2px 20px rgba(46,134,193,0.5), 0 0 40px rgba(255,255,255,0.3)'
      : '0 2px 20px rgba(123,104,238,0.6), 0 0 40px rgba(123,104,238,0.2)',
    letterSpacing: '0.04em',
  };

  const cursorStyle = {
    display: 'inline-block',
    width: '3px',
    height: '0.85em',
    background: isDay ? '#ffffff' : '#a898ff',
    marginLeft: '4px',
    verticalAlign: 'middle',
    borderRadius: '2px',
    animation: typingDone ? 'none' : 'blink 0.75s step-end infinite',
  };

  const subtitleStyle = {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
    fontWeight: 600,
    color: isDay ? 'rgba(255,255,255,0.82)' : 'rgba(200,210,240,0.78)',
    lineHeight: 1.5,
    maxWidth: '360px',
  };

  const tagsRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  };

  const tagStyle = {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: '20px',
    background: isDay
      ? 'rgba(255,255,255,0.22)'
      : 'rgba(123,104,238,0.15)',
    color: isDay ? 'rgba(255,255,255,0.95)' : 'rgba(180,170,255,0.9)',
    border: isDay
      ? '1px solid rgba(255,255,255,0.45)'
      : '1px solid rgba(123,104,238,0.35)',
    backdropFilter: 'blur(6px)',
  };

  const buttonStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '14px 36px',
    borderRadius: '50px',
    border: isDay
      ? '2px solid rgba(255,255,255,0.85)'
      : '2px solid rgba(123,104,238,0.6)',
    background: isDay
      ? 'rgba(255,255,255,0.18)'
      : 'rgba(123,104,238,0.12)',
    color: isDay ? '#ffffff' : '#c8c0ff',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      {/* Blinking cursor keyframe */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (max-width: 700px) {
          .landing-inner {
            flex-direction: column !important;
            gap: 36px !important;
            text-align: center;
          }
          .landing-text {
            align-items: center !important;
          }
        }
      `}</style>

      <section id="landing" style={sectionStyle}>
        <div style={innerStyle} className="landing-inner">

          {/* ══ LEFT — TEXT BLOCK ══════════════════════════ */}
          <motion.div
            style={textBlockStyle}
            className="landing-text"
            {...fadeLeft(0.1)}
          >
            {/* Greeting line */}
            <motion.p style={greetingStyle} {...fadeLeft(0.3)}>
              {isDay ? '✈ Welcome to my sky' : '🛸 Incoming transmission'}
            </motion.p>

            {/* Hi line */}
            <motion.div {...fadeLeft(0.5)}>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                fontWeight: 700,
                color: isDay ? 'rgba(255,255,255,0.9)' : 'rgba(200,210,240,0.85)',
              }}>
                Hey there! I&apos;m 👋
              </span>
            </motion.div>

            {/* Typing name */}
            <motion.h1 style={nameStyle} {...fadeLeft(0.6)}>
              {typedName}
              <span style={cursorStyle} />
            </motion.h1>

            {/* Subtitle */}
            <motion.p style={subtitleStyle} {...fadeUp(1.0)}>
              {isDay
                ? 'Full Stack Developer soaring through the MERN stack & Next.js — building things that live in the cloud.'
                : 'Full Stack Developer navigating the MERN stack & Next.js — launching ideas into orbit.'}
            </motion.p>

            {/* Tech tags */}
            <motion.div style={tagsRowStyle} {...fadeUp(1.2)}>
              {TECH_TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  style={tagStyle}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                  whileHover={{ scale: 1.08, y: -2 }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Explore button */}
            <motion.div {...fadeUp(1.7)}>
              <motion.button
                style={buttonStyle}
                onClick={handleExplore}
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDay
                    ? '0 0 30px rgba(255,255,255,0.4), 0 8px 24px rgba(46,134,193,0.3)'
                    : '0 0 30px rgba(123,104,238,0.5), 0 8px 24px rgba(0,0,0,0.4)',
                  background: isDay
                    ? 'rgba(255,255,255,0.28)'
                    : 'rgba(123,104,238,0.22)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Shimmer overlay */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
                    borderRadius: '50px',
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                />

                {/* Icon */}
                <span style={{ fontSize: '1.1rem', position: 'relative' }}>
                  {isDay ? '✈' : '🚀'}
                </span>

                <span style={{ position: 'relative' }}>
                  {isDay ? 'Explore My Work' : 'Begin Mission'}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ══ RIGHT — GIF BUBBLE ═════════════════════════ */}
          <motion.div style={bubbleWrapStyle} {...scaleIn(0.2)}>

            {/* Day: mini clouds around bubble */}
            {isDay && (
              <>
                <motion.div
                  style={{ position: 'absolute', top: '-18px', left: '-10px', zIndex: 2 }}
                  animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MiniCloud style={{ opacity: 0.9 }} />
                </motion.div>
                <motion.div
                  style={{ position: 'absolute', bottom: '-10px', right: '-12px', zIndex: 2, transform: 'scaleX(-1)' }}
                  animate={{ y: [0, -6, 0], x: [0, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                  <MiniCloud style={{ opacity: 0.75 }} />
                </motion.div>
              </>
            )}

            {/* Night: orbiting stars around bubble */}
            {!isDay && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <OrbitStar radius={130} duration={8}  delay={0}   size={5} />
                <OrbitStar radius={145} duration={12} delay={2}   size={3.5} />
                <OrbitStar radius={122} duration={6}  delay={1}   size={4} />
                <OrbitStar radius={150} duration={15} delay={3.5} size={2.5} />
              </div>
            )}

            {/* Night: nebula glow behind bubble */}
            {!isDay && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '-30px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(123,104,238,0.2) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* The GIF bubble itself */}
            <motion.div
              style={bubbleStyle}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Glassy inner highlight ring */}
              <div style={{
                position: 'absolute',
                top: '8px', left: '8px', right: '8px', bottom: '8px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                zIndex: 2,
                pointerEvents: 'none',
              }} />

              {/* The actual GIF */}
              <img
                src={isDay
                  ? '/assets/character/character-day.gif'
                  : '/assets/character/character-night.gif'}
                alt="Muaz waving hello"
                style={gifStyle}
                // Fallback to static image if GIF not yet added
                onError={(e) => {
                  e.target.src = '/assets/character/character-fallback.png';
                }}
              />
            </motion.div>

          </motion.div>
          {/* ══ END RIGHT ══ */}

        </div>

        {/* ── SCROLL INDICATOR ───────────────────────────── */}
        <ScrollIndicator isDay={isDay} />

      </section>
    </>
  );
}
