'use client';

// ============================================================
// components/TestMe.jsx — CHALLENGE ARENA SECTION
//
// CONNECTION MAP:
//   page.jsx    → mounts <TestMe theme={theme} /> after Skills
//   globals.css → CSS variables, fonts
//   .env.local  → NEXT_PUBLIC_EMAILJS_SERVICE_ID
//                 NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
//                 NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
//
// PROPS:
//   theme {string} 'day' | 'night'
//
// HOW IT WORKS (no backend needed):
//   1. Visitor picks a category → fills name + challenge text
//   2. EmailJS sends it privately to YOUR email
//   3. You solve it, add it to SOLVED_CHALLENGES array below
//   4. Redeploy to Vercel (30 seconds) → it appears publicly
//   5. Visitors rate solved challenges (stored in localStorage)
//   6. Most-starred problems float to the top automatically
//
// DESIGN:
//   Day Vision   → "Sky Dojo" — challenge arena in the clouds
//                  Paper plane send button, wind-scroll reveal
//   Night Vision → "Mission Control" — deep space terminal
//                  Rocket launch button, transmission decode reveal
//
// CUSTOMISE:
//   Add your solved challenges to the SOLVED_CHALLENGES array below.
//   Set your EmailJS credentials in .env.local
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// ── CHALLENGE CATEGORIES ─────────────────────────────────────
const CATEGORIES = [
  { id: 'problem-solving',  label: 'Problem Solving',        icon: '🧩', desc: 'Algorithms, logic, coding challenges' },
  { id: 'design-strategy',  label: 'Design Strategy',        icon: '🎨', desc: 'UI/UX decisions, design systems'       },
  { id: 'component',        label: 'Unique Component',       icon: '⚙️',  desc: 'Build something creative in code'     },
  { id: 'business',         label: 'Business Idea',          icon: '💼', desc: 'Skill-based startup or product ideas'  },
  { id: 'critical',         label: 'Critical Thinking',      icon: '🧠', desc: 'Puzzles, decision making, analysis'    },
  { id: 'life',             label: 'General Life Problem',   icon: '🌍', desc: 'Real-world situations & solutions'     },
  { id: 'other',            label: 'Other',                  icon: '📦', desc: 'Anything else you can think of'        },
];

// ── SOLVED CHALLENGES — ADD YOUR REAL ONES HERE ─────────────
// After you solve a challenge from your email, add it here and redeploy.
// order: lower number = shown first initially (before ratings accumulate)
const SOLVED_CHALLENGES = [
  {
    id: 1,
    order: 1,
    category: 'problem-solving',
    challengerName: 'Alex R.',
    challenge: 'How would you build a real-time notification system without using WebSockets?',
    solution: `Great challenge! I'd use Server-Sent Events (SSE) combined with a polling fallback.

SSE keeps a long-lived HTTP connection open from server → client, perfect for one-way real-time updates. Here's the approach:

1. Server opens an SSE endpoint (/api/notifications/stream)
2. Client connects with EventSource API
3. Server pushes events as they occur (new message, alert, etc.)
4. For browsers that don't support SSE, fall back to long-polling every 3 seconds

Why not WebSockets? SSE is simpler, works over standard HTTP/2, auto-reconnects, and is ideal when you only need server → client updates. WebSockets shine when you need bi-directional real-time (like chat).

Stack: Node.js + Express for SSE endpoint, React useEffect + EventSource on frontend.`,
    tags: ['Node.js', 'React', 'API Design'],
    solvedAt: 'March 2025',
  },
  {
    id: 2,
    order: 2,
    category: 'design-strategy',
    challengerName: 'Priya M.',
    challenge: 'Design a color system for an app that needs to work for both colorblind and non-colorblind users.',
    solution: `Excellent UX challenge! Here's my strategy:

1. Never rely on color alone — always pair color with shape, icon, or text label
2. Use the WCAG 2.1 contrast ratio minimum (4.5:1 for normal text, 3:1 for large)
3. Build a semantic color system: success/warning/error mapped to patterns + colors
4. Test with Deuteranopia simulation (most common — red/green confusion)

My palette approach:
- Success: Green + checkmark icon + "Success" text
- Warning: Orange + triangle icon + "Warning" text  
- Error: Red + X icon + "Error" text
- Use blue/orange as primary accent pair (safe for all colorblind types)

Tools: Figma's colorblind plugins, Chrome DevTools accessibility audit, Stark plugin.`,
    tags: ['UI/UX', 'Design Strategy', 'Accessibility'],
    solvedAt: 'April 2025',
  },
];

// ── STAR RATING COMPONENT ─────────────────────────────────────
function StarRating({ challengeId, isDay }) {
  const storageKey = `rating_${challengeId}`;
  const [userRating, setUserRating]   = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [allRatings, setAllRatings]   = useState([]);

  useEffect(() => {
    // Load saved ratings from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem(`ratings_all_${challengeId}`) || '[]');
      setAllRatings(saved);
      const myRating = parseInt(localStorage.getItem(storageKey) || '0');
      setUserRating(myRating);
    } catch {}
  }, [challengeId, storageKey]);

  const handleRate = (stars) => {
    if (userRating > 0) return; // already rated
    const newRatings = [...allRatings, stars];
    setUserRating(stars);
    setAllRatings(newRatings);
    localStorage.setItem(storageKey, stars.toString());
    localStorage.setItem(`ratings_all_${challengeId}`, JSON.stringify(newRatings));
  };

  const avgRating = allRatings.length > 0
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
    : '—';

  const display = hoverRating || userRating;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <motion.span
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !userRating && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={!userRating ? { scale: 1.3 } : {}}
            whileTap={!userRating ? { scale: 0.9 } : {}}
            style={{
              fontSize: '1.1rem',
              cursor: userRating ? 'default' : 'pointer',
              color: star <= display
                ? '#FFD700'
                : isDay ? 'rgba(255,255,255,0.3)' : 'rgba(200,210,240,0.2)',
              filter: star <= display ? 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' : 'none',
              transition: 'color 0.15s, filter 0.15s',
            }}
          >★</motion.span>
        ))}
      </div>
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(200,210,240,0.5)',
      }}>
        {avgRating !== '—' ? `${avgRating} · ${allRatings.length} rating${allRatings.length !== 1 ? 's' : ''}` : 'Be first to rate'}
      </span>
      {userRating > 0 && (
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.68rem',
          color: isDay ? 'rgba(255,255,255,0.5)' : 'rgba(123,104,238,0.7)',
          letterSpacing: '0.06em',
        }}>✓ Rated</span>
      )}
    </div>
  );
}

// ── SOLVED CHALLENGE CARD ────────────────────────────────────
function SolvedCard({ challenge, isDay, index, totalRatings }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES.find(c => c.id === challenge.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        background: isDay
          ? 'rgba(255,255,255,0.42)'
          : 'rgba(6,6,20,0.75)',
        border: isDay
          ? '1.5px solid rgba(255,255,255,0.7)'
          : '1.5px solid rgba(123,104,238,0.22)',
        backdropFilter: 'blur(16px)',
        boxShadow: isDay
          ? '0 8px 32px rgba(46,134,193,0.12)'
          : '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(123,104,238,0.08)',
      }}
    >
      {/* Card header — always visible */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '20px 22px',
          cursor: 'pointer',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        {/* Category icon bubble */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          flexShrink: 0,
          background: isDay
            ? 'rgba(255,255,255,0.7)'
            : 'rgba(123,104,238,0.15)',
          border: isDay
            ? '1px solid rgba(255,255,255,0.9)'
            : '1px solid rgba(123,104,238,0.3)',
        }}>
          {cat?.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '2px 10px',
              borderRadius: '20px',
              background: isDay ? 'rgba(46,134,193,0.12)' : 'rgba(123,104,238,0.15)',
              color: isDay ? 'rgba(30,100,160,0.9)' : 'rgba(160,150,255,0.85)',
              border: isDay ? '1px solid rgba(46,134,193,0.2)' : '1px solid rgba(123,104,238,0.3)',
            }}>
              {cat?.label}
            </span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: isDay ? 'rgba(255,255,255,0.55)' : 'rgba(200,210,240,0.4)',
            }}>
              from {challenge.challengerName} · {challenge.solvedAt}
            </span>
            {/* Challenge number badge */}
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.58rem',
              color: isDay ? 'rgba(255,215,0,0.8)' : 'rgba(255,215,0,0.6)',
            }}>
              #{String(challenge.id).padStart(3, '0')}
            </span>
          </div>

          {/* Challenge text */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.92rem',
            fontWeight: 700,
            color: isDay ? '#ffffff' : '#E8E8F0',
            lineHeight: 1.5,
            marginBottom: '10px',
          }}>
            "{challenge.challenge}"
          </p>

          {/* Star rating */}
          <StarRating challengeId={challenge.id} isDay={isDay} />
        </div>

        {/* Expand arrow */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '28px', height: '28px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDay ? 'rgba(255,255,255,0.4)' : 'rgba(123,104,238,0.15)',
            color: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(160,150,255,0.8)',
            fontSize: '0.9rem',
            flexShrink: 0,
          }}
        >▾</motion.div>
      </div>

      {/* Expandable solution */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 22px 22px',
              borderTop: isDay
                ? '1px solid rgba(255,255,255,0.25)'
                : '1px solid rgba(123,104,238,0.15)',
              marginTop: '0',
              paddingTop: '18px',
            }}>
              {/* Solution label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1rem' }}>{isDay ? '✈' : '🚀'}</span>
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isDay ? 'rgba(46,134,193,0.9)' : 'rgba(123,104,238,0.85)',
                }}>
                  {isDay ? "Muaz's Solution" : 'Transmission Decoded'}
                </span>
              </div>

              {/* Solution text — preserves line breaks */}
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.75,
                color: isDay ? 'rgba(255,255,255,0.85)' : 'rgba(200,210,240,0.8)',
                whiteSpace: 'pre-line',
                background: isDay
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(123,104,238,0.06)',
                borderRadius: '12px',
                padding: '16px 18px',
                border: isDay
                  ? '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(123,104,238,0.12)',
              }}>
                {challenge.solution}
              </div>

              {/* Tags */}
              {challenge.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '14px' }}>
                  {challenge.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 11px',
                      borderRadius: '20px',
                      background: isDay ? 'rgba(46,134,193,0.1)' : 'rgba(123,104,238,0.1)',
                      color: isDay ? 'rgba(30,100,160,0.85)' : 'rgba(160,150,255,0.8)',
                      border: isDay ? '1px solid rgba(46,134,193,0.2)' : '1px solid rgba(123,104,238,0.25)',
                    }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── CHALLENGE FORM ───────────────────────────────────────────
// States: 'idle' → 'category' → 'form' → 'sending' → 'success' | 'error'
function ChallengeForm({ isDay }) {
  const [step, setStep]             = useState('idle');
  const [selectedCat, setSelectedCat] = useState(null);
  const [name, setName]             = useState('');
  const [challenge, setChallenge]   = useState('');
  const [sending, setSending]       = useState(false);
  const [result, setResult]         = useState(null); // 'success' | 'error'

  const inputBase = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.25s, box-shadow 0.25s',
    background: isDay
      ? 'rgba(255,255,255,0.35)'
      : 'rgba(6,6,20,0.6)',
    color: isDay ? '#ffffff' : '#E8E8F0',
    border: isDay
      ? '1.5px solid rgba(255,255,255,0.55)'
      : '1.5px solid rgba(123,104,238,0.3)',
  };

  const handleSubmit = async () => {
    if (!name.trim() || !challenge.trim()) return;
    setSending(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          from_name:   name.trim(),
          category:    CATEGORIES.find(c => c.id === selectedCat)?.label || selectedCat,
          challenge:   challenge.trim(),
          sent_at:     new Date().toLocaleString(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY',
      );
      setResult('success');
    } catch {
      setResult('error');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setStep('idle'); setSelectedCat(null);
    setName(''); setChallenge(''); setResult(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>

      {/* ── STEP 0: IDLE — big invite button ─────────── */}
      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <motion.button
              onClick={() => setStep('category')}
              whileHover={{
                scale: 1.04,
                boxShadow: isDay
                  ? '0 0 40px rgba(255,255,255,0.4), 0 12px 40px rgba(46,134,193,0.3)'
                  : '0 0 40px rgba(123,104,238,0.5), 0 12px 40px rgba(0,0,0,0.5)',
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '18px 44px',
                borderRadius: '50px',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: isDay
                  ? '2px solid rgba(255,255,255,0.85)'
                  : '2px solid rgba(123,104,238,0.6)',
                background: isDay
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(123,104,238,0.14)',
                color: isDay ? '#ffffff' : '#c8c0ff',
                backdropFilter: 'blur(12px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2 }}
              />
              <span style={{ fontSize: '1.2rem' }}>🎯</span>
              <span>Throw Challenge to Muaz</span>
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 1: CATEGORY SELECTOR ──────────────── */}
        {step === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '20px',
              color: isDay ? 'rgba(255,255,255,0.75)' : 'rgba(200,210,240,0.6)',
            }}>
              Select Challenge Type
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
            }}>
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => { setSelectedCat(cat.id); setStep('form'); }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    background: isDay
                      ? 'rgba(255,255,255,0.38)'
                      : 'rgba(8,8,24,0.7)',
                    border: isDay
                      ? '1.5px solid rgba(255,255,255,0.65)'
                      : '1.5px solid rgba(123,104,238,0.22)',
                    backdropFilter: 'blur(12px)',
                    transition: 'background 0.25s, box-shadow 0.25s',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{cat.icon}</div>
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isDay ? '#ffffff' : '#E8E8F0',
                    marginBottom: '3px',
                  }}>{cat.label}</div>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '0.72rem',
                    color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(200,210,240,0.5)',
                    lineHeight: 1.4,
                  }}>{cat.desc}</div>
                </motion.button>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={reset} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: isDay ? 'rgba(255,255,255,0.5)' : 'rgba(200,210,240,0.4)',
              }}>← Back</button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: INPUT FORM ──────────────────────── */}
        {step === 'form' && !result && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: '28px 28px',
              borderRadius: '20px',
              background: isDay
                ? 'rgba(255,255,255,0.38)'
                : 'rgba(6,6,20,0.72)',
              border: isDay
                ? '1.5px solid rgba(255,255,255,0.65)'
                : '1.5px solid rgba(123,104,238,0.25)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Selected category pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              <span style={{ fontSize: '1.1rem' }}>
                {CATEGORIES.find(c => c.id === selectedCat)?.icon}
              </span>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(160,150,255,0.85)',
              }}>
                {CATEGORIES.find(c => c.id === selectedCat)?.label}
              </span>
              <button onClick={() => setStep('category')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Rajdhani', sans-serif", fontSize: '0.68rem',
                color: isDay ? 'rgba(255,255,255,0.45)' : 'rgba(200,210,240,0.35)',
                letterSpacing: '0.06em', marginLeft: 'auto',
              }}>change ↩</button>
            </div>

            {/* Name input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(200,210,240,0.6)',
                marginBottom: '8px',
              }}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={isDay ? 'Enter your name...' : 'Identify yourself...'}
                maxLength={50}
                style={inputBase}
              />
            </div>

            {/* Challenge textarea */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(200,210,240,0.6)',
                marginBottom: '8px',
              }}>
                {isDay ? 'Your Challenge' : 'Transmit Your Challenge'}
              </label>
              <textarea
                value={challenge}
                onChange={e => setChallenge(e.target.value)}
                placeholder={isDay
                  ? 'Describe your challenge in plain English...'
                  : 'Transmit your challenge in plain text...'}
                rows={5}
                maxLength={800}
                style={{ ...inputBase, resize: 'vertical', minHeight: '120px' }}
              />
              <div style={{
                textAlign: 'right',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.65rem',
                color: isDay ? 'rgba(255,255,255,0.4)' : 'rgba(200,210,240,0.35)',
                marginTop: '4px',
                letterSpacing: '0.06em',
              }}>
                {challenge.length}/800
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              onClick={handleSubmit}
              disabled={sending || !name.trim() || !challenge.trim()}
              whileHover={!sending && name && challenge ? { scale: 1.03, y: -2 } : {}}
              whileTap={!sending && name && challenge ? { scale: 0.97 } : {}}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '50px',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: sending || !name.trim() || !challenge.trim() ? 'not-allowed' : 'pointer',
                opacity: !name.trim() || !challenge.trim() ? 0.5 : 1,
                border: isDay
                  ? '2px solid rgba(255,255,255,0.8)'
                  : '2px solid rgba(123,104,238,0.55)',
                background: isDay
                  ? 'rgba(255,255,255,0.22)'
                  : 'rgba(123,104,238,0.16)',
                color: isDay ? '#ffffff' : '#c8c0ff',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'opacity 0.3s',
              }}
            >
              {sending
                ? <><span style={{ fontSize: '1rem' }}>⏳</span> Sending...</>
                : <><span style={{ fontSize: '1rem' }}>{isDay ? '✈️' : '🚀'}</span>
                   {isDay ? 'Send Challenge' : 'Launch Challenge'}</>
              }
            </motion.button>
          </motion.div>
        )}

        {/* ── STEP 3: SUCCESS / ERROR ─────────────────── */}
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: 'center',
              padding: '40px 30px',
              borderRadius: '20px',
              background: isDay
                ? 'rgba(255,255,255,0.38)'
                : 'rgba(6,6,20,0.72)',
              border: result === 'success'
                ? isDay
                  ? '1.5px solid rgba(255,255,255,0.7)'
                  : '1.5px solid rgba(80,220,120,0.35)'
                : '1.5px solid rgba(220,80,80,0.35)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
              {result === 'success' ? (isDay ? '☁️✈️' : '🚀✨') : '⚠️'}
            </div>
            <h3 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: isDay ? '#ffffff' : '#E8E8F0',
              marginBottom: '10px',
              letterSpacing: '0.04em',
            }}>
              {result === 'success'
                ? (isDay ? 'Challenge Launched!' : 'Transmission Received!')
                : 'Launch Failed'}
            </h3>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '0.9rem',
              color: isDay ? 'rgba(255,255,255,0.75)' : 'rgba(200,210,240,0.65)',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              {result === 'success'
                ? "I've received your challenge! I'll solve it and post the solution here soon."
                : 'Something went wrong. Please try again in a moment.'}
            </p>
            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '10px 28px',
                borderRadius: '50px',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: isDay
                  ? '1.5px solid rgba(255,255,255,0.5)'
                  : '1.5px solid rgba(123,104,238,0.4)',
                background: 'transparent',
                color: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(160,150,255,0.8)',
              }}
            >
              {result === 'success' ? 'Throw Another →' : 'Try Again →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function TestMe({ theme }) {
  const isDay = theme === 'day';

  // Sort solved challenges: most-rated first, then by original order
  const sortedChallenges = [...SOLVED_CHALLENGES].sort((a, b) => {
    const getRatingCount = (id) => {
      try {
        const r = JSON.parse(localStorage.getItem(`ratings_all_${id}`) || '[]');
        return r.length;
      } catch { return 0; }
    };
    const diff = getRatingCount(b.id) - getRatingCount(a.id);
    return diff !== 0 ? diff : a.order - b.order;
  });

  return (
    <section
      id="testme"
      style={{
        width: '100%',
        padding: '100px 24px 110px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ── SECTION HEADER ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(123,104,238,0.8)',
            marginBottom: '10px',
          }}>
            {isDay ? '⚔️ Sky Dojo' : '🛸 Mission Control'}
          </p>

          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
            fontWeight: 900,
            color: isDay ? '#ffffff' : '#E8E8F0',
            letterSpacing: '0.04em',
            textShadow: isDay
              ? '0 2px 24px rgba(46,134,193,0.4)'
              : '0 2px 24px rgba(123,104,238,0.5)',
            marginBottom: '16px',
          }}>
            Test Me
          </h2>

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '1rem',
            color: isDay ? 'rgba(255,255,255,0.72)' : 'rgba(200,210,240,0.62)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            {isDay
              ? 'Think you can stump me? Throw any challenge — problem-solving, design, business, life. I solve it and post the solution right here.'
              : 'Think your problem can escape my radar? Transmit any challenge. I will decode it and broadcast the solution publicly.'}
          </p>
        </motion.div>

        {/* ── CHALLENGE FORM ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '72px' }}
        >
          <ChallengeForm isDay={isDay} />
        </motion.div>

        {/* ── SOLVED CHALLENGES ────────────────────────── */}
        {SOLVED_CHALLENGES.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Sub-header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '28px',
            }}>
              <div style={{
                flex: 1, height: '1px',
                background: isDay
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(123,104,238,0.15)',
              }} />
              <p style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(200,210,240,0.45)',
                whiteSpace: 'nowrap',
              }}>
                {isDay ? '🏆 Hall of Solved Challenges' : '★ Solved Transmissions'}
              </p>
              <div style={{
                flex: 1, height: '1px',
                background: isDay
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(123,104,238,0.15)',
              }} />
            </div>

            {/* Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sortedChallenges.map((ch, i) => (
                <SolvedCard
                  key={ch.id}
                  challenge={ch}
                  isDay={isDay}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}