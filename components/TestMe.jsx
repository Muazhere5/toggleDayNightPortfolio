'use client';

// ============================================================
// components/TestMe.jsx — CHALLENGE ARENA SECTION
// BUG FIX APPLIED:
//   🔴 localStorage called in component body during SSR
//      sortedChallenges used localStorage.getItem() directly
//      in component render = "localStorage is not defined" crash
//   ✅ Fixed by moving sort logic into useState + useEffect
//      so it only runs on client after mount
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, increment, addDoc, deleteDoc } from 'firebase/firestore';

const CATEGORIES = [
  { id: 'problem-solving', label: 'Problem Solving',      icon: '🧩', desc: 'Algorithms, logic, coding challenges'    },
  { id: 'design-strategy', label: 'Design Strategy',      icon: '🎨', desc: 'UI/UX decisions, design systems'         },
  { id: 'component',       label: 'Unique Component',     icon: '⚙️',  desc: 'Build something creative in code'       },
  { id: 'business',        label: 'Business Idea',        icon: '💼', desc: 'Skill-based startup or product ideas'    },
  { id: 'critical',        label: 'Critical Thinking',    icon: '🧠', desc: 'Puzzles, decision making, analysis'      },
  { id: 'life',            label: 'General Life Problem', icon: '🌍', desc: 'Real-world situations & solutions'       },
  { id: 'other',           label: 'Other',                icon: '📦', desc: 'Anything else you can think of'          },
];

// ── ADMIN UTILS (Hidden) ──────────────────────────────────────
// You can uncomment and run these to manage your showcases programmatically:
// const createProblem = async () => {
//   await addDoc(collection(db, 'problems'), {
//     order: 1, category: 'problem-solving', challengerName: 'Alex R.',
//     challenge: 'How would you build a real-time notification system without WebSockets?',
//     solution: 'Great challenge! I would use Server-Sent Events (SSE)...',
//     tags: ['Node.js', 'React'], solvedAt: 'March 2025', stars: 0, comments: []
//   });
// };
// const deleteProblem = async (id) => {
//   await deleteDoc(doc(db, 'problems', id));
// };

// ── STAR RATING ───────────────────────────────────────────────
function StarRating({ challengeId, currentStars, isDay }) {
  const [hasStarred, setHasStarred] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(`starred_${challengeId}`)) setHasStarred(true);
    } catch {}
  }, [challengeId]);

  const handleStar = async () => {
    if (hasStarred) return;
    setHasStarred(true);
    try {
      localStorage.setItem(`starred_${challengeId}`, 'true');
      await updateDoc(doc(db, 'problems', challengeId), {
        stars: increment(1)
      });
    } catch (err) {
      console.error('Failed to star:', err);
      setHasStarred(false); // Revert on failure
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <motion.button
        onClick={handleStar}
        whileHover={!hasStarred ? { scale: 1.15 } : {}}
        whileTap={!hasStarred ? { scale: 0.9 } : {}}
        style={{
          background: 'none', border: 'none', cursor: hasStarred ? 'default' : 'pointer',
          fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
          color: hasStarred || currentStars > 0 ? '#FFD700' : isDay ? 'rgba(255,255,255,0.3)' : 'rgba(200,210,240,0.2)',
          filter: hasStarred || currentStars > 0 ? 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' : 'none',
          transition: 'color 0.2s, filter 0.2s',
        }}
      >
        ★
        <span style={{
          fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.85rem', fontWeight: 700,
          color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(200,210,240,0.6)'
        }}>
          {currentStars || 0}
        </span>
      </motion.button>
      {hasStarred && (
        <span style={{
          fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.68rem',
          color: isDay ? 'rgba(255,255,255,0.5)' : 'rgba(123,104,238,0.7)',
          letterSpacing: '0.06em',
        }}>✓ Starred</span>
      )}
    </div>
  );
}

// ── REPLIES / COMMENTS COMPONENT ──────────────────────────────
function RepliesSection({ challengeId, comments = [], isDay }) {
  const [replyText, setReplyText] = useState('');

  const handleReply = async () => {
    if (!replyText.trim()) return;
    const newReply = { id: Date.now(), text: replyText, date: new Date().toLocaleDateString() };
    setReplyText('');
    try {
      await updateDoc(doc(db, 'problems', challengeId), {
        comments: arrayUnion(newReply)
      });
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  return (
    <div style={{ marginTop: '20px', borderTop: isDay ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(123,104,238,0.15)', paddingTop: '16px' }}>
      <h4 style={{ fontFamily: "var(--font-rajdhani)", fontSize: '0.85rem', color: isDay ? '#c4b5fd' : '#a898ff', marginBottom: '12px' }}>
        Comments & Replies ({comments.length})
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
        {comments.map(r => (
          <div key={r.id} style={{ background: isDay ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', border: isDay ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent' }}>
            <span style={{ fontSize: '0.65rem', color: isDay ? '#a78bfa' : '#7b68ee', display: 'block', marginBottom: '6px', fontWeight: 600 }}>{r.date}</span>
            {r.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={replyText} 
          onChange={(e) => setReplyText(e.target.value)} 
          placeholder="Leave a comment..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', background: isDay ? 'rgba(255,255,255,0.1)' : 'rgba(123,104,238,0.08)', border: isDay ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(123,104,238,0.2)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
        />
        <motion.button 
          onClick={handleReply} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ padding: '0 20px', borderRadius: '10px', background: isDay ? '#8b5cf6' : '#7b68ee', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "var(--font-orbitron)" }}
        >
          POST
        </motion.button>
      </div>
    </div>
  );
}

// ── SOLVED CHALLENGE CARD ─────────────────────────────────────
function SolvedCard({ challenge, isDay, index }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES.find(c => c.id === challenge.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: '18px', overflow: 'hidden',
        background: isDay ? 'rgba(15,23,42,0.45)' : 'rgba(6,6,20,0.75)',
        border: isDay
          ? '1.5px solid rgba(167,139,250,0.4)'
          : '1.5px solid rgba(123,104,238,0.22)',
        backdropFilter: 'blur(16px)',
        boxShadow: isDay
          ? '0 10px 40px rgba(76,29,149,0.3)'
          : '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '20px 22px', cursor: 'pointer',
          display: 'flex', gap: '14px', alignItems: 'flex-start' }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', flexShrink: 0,
          background: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(123,104,238,0.15)',
          border: isDay
            ? '1px solid rgba(255,255,255,0.9)'
            : '1px solid rgba(123,104,238,0.3)',
        }}>
          {cat?.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center',
            gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{
              fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.65rem',
              fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '2px 10px', borderRadius: '20px',
              background: isDay ? 'rgba(46,134,193,0.12)' : 'rgba(123,104,238,0.15)',
              color: isDay ? 'rgba(30,100,160,0.9)' : 'rgba(160,150,255,0.85)',
              border: isDay
                ? '1px solid rgba(46,134,193,0.2)'
                : '1px solid rgba(123,104,238,0.3)',
            }}>{cat?.label}</span>
            <span style={{
              fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: isDay ? 'rgba(255,255,255,0.55)' : 'rgba(200,210,240,0.4)',
            }}>from {challenge.challengerName} · {challenge.solvedAt}</span>
            <span style={{
              fontFamily: "var(--font-orbitron), sans-serif", fontSize: '0.58rem',
              color: isDay ? 'rgba(255,215,0,0.8)' : 'rgba(255,215,0,0.6)',
            }}>#{String(challenge.id).padStart(3, '0')}</span>
          </div>

          <p style={{
            fontFamily: "var(--font-nunito), sans-serif", fontSize: '0.92rem',
            fontWeight: 700,
            color: isDay ? '#ffffff' : '#E8E8F0',
            lineHeight: 1.5, marginBottom: '10px',
          }}>&quot;{challenge.challenge}&quot;</p>

          <StarRating challengeId={challenge.id} currentStars={challenge.stars} isDay={isDay} />
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '28px', height: '28px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isDay ? 'rgba(255,255,255,0.4)' : 'rgba(123,104,238,0.15)',
            color: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(160,150,255,0.8)',
            fontSize: '0.9rem', flexShrink: 0,
          }}
        >▾</motion.div>
      </div>

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
              padding: '18px 22px 22px',
              borderTop: isDay
                ? '1px solid rgba(255,255,255,0.25)'
                : '1px solid rgba(123,104,238,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center',
                gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1rem' }}>{isDay ? '✈' : '🚀'}</span>
                <span style={{
                  fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.72rem',
                  fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: isDay ? 'rgba(46,134,193,0.9)' : 'rgba(123,104,238,0.85)',
                }}>
                  {isDay ? "Muaz's Solution" : 'Transmission Decoded'}
                </span>
              </div>

              <div style={{
                fontFamily: "var(--font-nunito), sans-serif", fontSize: '0.9rem',
                lineHeight: 1.75,
                color: isDay ? 'rgba(255,255,255,0.85)' : 'rgba(200,210,240,0.8)',
                whiteSpace: 'pre-line',
                background: isDay ? 'rgba(255,255,255,0.15)' : 'rgba(123,104,238,0.06)',
                borderRadius: '12px', padding: '16px 18px',
                border: isDay
                  ? '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(123,104,238,0.12)',
              }}>
                {challenge.solution}
              </div>

              {challenge.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap',
                  gap: '7px', marginTop: '14px' }}>
                  {challenge.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.68rem',
                      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '3px 11px', borderRadius: '20px',
                      background: isDay ? 'rgba(46,134,193,0.1)' : 'rgba(123,104,238,0.1)',
                      color: isDay ? 'rgba(30,100,160,0.85)' : 'rgba(160,150,255,0.8)',
                      border: isDay
                        ? '1px solid rgba(46,134,193,0.2)'
                        : '1px solid rgba(123,104,238,0.25)',
                    }}>{tag}</span>
                  ))}
                </div>
              )}

              <RepliesSection challengeId={challenge.id} comments={challenge.comments} isDay={isDay} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── CHALLENGE FORM ────────────────────────────────────────────
function ChallengeForm({ isDay }) {
  const [step, setStep]           = useState('idle');
  const [selectedCat, setSelectedCat] = useState(null);
  const [name, setName]           = useState('');
  const [challenge, setChallenge] = useState('');
  const [sending, setSending]     = useState(false);
  const [result, setResult]       = useState(null);

  const inputBase = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    fontFamily: "var(--font-nunito), sans-serif", fontSize: '0.95rem',
    outline: 'none', transition: 'border 0.25s, box-shadow 0.25s',
    background: isDay ? 'rgba(255,255,255,0.35)' : 'rgba(6,6,20,0.6)',
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
          from_name: name.trim(),
          category:  CATEGORIES.find(c => c.id === selectedCat)?.label || selectedCat,
          challenge: challenge.trim(),
          sent_at:   new Date().toLocaleString(),
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
      <AnimatePresence mode="wait">

        {/* STEP 0 — idle button */}
        {step === 'idle' && (
          <motion.div key="idle"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <motion.button
              onClick={() => setStep('category')}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                padding: '18px 44px', borderRadius: '50px',
                fontFamily: "var(--font-orbitron), sans-serif", fontSize: '0.88rem',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer',
                border: isDay
                  ? '2px solid rgba(255,255,255,0.85)'
                  : '2px solid rgba(123,104,238,0.6)',
                background: isDay ? 'rgba(255,255,255,0.2)' : 'rgba(123,104,238,0.14)',
                color: isDay ? '#ffffff' : '#c8c0ff',
                backdropFilter: 'blur(12px)',
                display: 'inline-flex', alignItems: 'center', gap: '12px',
                position: 'relative', overflow: 'hidden',
              }}
            >
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

        {/* STEP 1 — category selector */}
        {step === 'category' && (
          <motion.div key="category"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.4 }}
          >
            <p style={{
              fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.75rem',
              fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
              textAlign: 'center', marginBottom: '20px',
              color: isDay ? 'rgba(255,255,255,0.75)' : 'rgba(200,210,240,0.6)',
            }}>Select Challenge Type</p>

            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => { setSelectedCat(cat.id); setStep('form'); }}
                  whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '14px 16px', borderRadius: '14px',
                    cursor: 'pointer', textAlign: 'left',
                    background: isDay ? 'rgba(255,255,255,0.38)' : 'rgba(8,8,24,0.7)',
                    border: isDay
                      ? '1.5px solid rgba(255,255,255,0.65)'
                      : '1.5px solid rgba(123,104,238,0.22)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{cat.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.82rem',
                    fontWeight: 700, letterSpacing: '0.06em',
                    color: isDay ? '#ffffff' : '#E8E8F0', marginBottom: '3px',
                  }}>{cat.label}</div>
                  <div style={{
                    fontFamily: "var(--font-nunito), sans-serif", fontSize: '0.72rem',
                    color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(200,210,240,0.5)',
                    lineHeight: 1.4,
                  }}>{cat.desc}</div>
                </motion.button>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={reset} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.75rem',
                color: isDay ? 'rgba(255,255,255,0.5)' : 'rgba(200,210,240,0.4)',
              }}>← Back</button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — input form */}
        {step === 'form' && !result && (
          <motion.div key="form"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.4 }}
            style={{
              padding: '28px', borderRadius: '20px',
              background: isDay ? 'rgba(255,255,255,0.38)' : 'rgba(6,6,20,0.72)',
              border: isDay
                ? '1.5px solid rgba(255,255,255,0.65)'
                : '1.5px solid rgba(123,104,238,0.25)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center',
              gap: '8px', marginBottom: '22px' }}>
              <span style={{ fontSize: '1.1rem' }}>
                {CATEGORIES.find(c => c.id === selectedCat)?.icon}
              </span>
              <span style={{
                fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(160,150,255,0.85)',
              }}>
                {CATEGORIES.find(c => c.id === selectedCat)?.label}
              </span>
              <button onClick={() => setStep('category')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.68rem',
                color: isDay ? 'rgba(255,255,255,0.45)' : 'rgba(200,210,240,0.35)',
                marginLeft: 'auto',
              }}>change ↩</button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', marginBottom: '8px',
                color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(200,210,240,0.6)',
              }}>Your Name</label>
              <input
                type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder={isDay ? 'Enter your name...' : 'Identify yourself...'}
                maxLength={50} style={inputBase}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{
                display: 'block', fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', marginBottom: '8px',
                color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(200,210,240,0.6)',
              }}>
                {isDay ? 'Your Challenge' : 'Transmit Your Challenge'}
              </label>
              <textarea
                value={challenge}
                onChange={e => setChallenge(e.target.value)}
                placeholder={isDay
                  ? 'Describe your challenge in plain English...'
                  : 'Transmit your challenge in plain text...'}
                rows={5} maxLength={800}
                style={{ ...inputBase, resize: 'vertical', minHeight: '120px' }}
              />
              <div style={{
                textAlign: 'right', fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: '0.65rem', marginTop: '4px', letterSpacing: '0.06em',
                color: isDay ? 'rgba(255,255,255,0.4)' : 'rgba(200,210,240,0.35)',
              }}>{challenge.length}/800</div>
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={sending || !name.trim() || !challenge.trim()}
              whileHover={!sending && name && challenge ? { scale: 1.03, y: -2 } : {}}
              whileTap={!sending && name && challenge ? { scale: 0.97 } : {}}
              style={{
                width: '100%', padding: '14px', borderRadius: '50px',
                fontFamily: "var(--font-orbitron), sans-serif", fontSize: '0.82rem',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: sending || !name.trim() || !challenge.trim() ? 'not-allowed' : 'pointer',
                opacity: !name.trim() || !challenge.trim() ? 0.5 : 1,
                border: isDay
                  ? '2px solid rgba(255,255,255,0.8)'
                  : '2px solid rgba(123,104,238,0.55)',
                background: isDay ? 'rgba(255,255,255,0.22)' : 'rgba(123,104,238,0.16)',
                color: isDay ? '#ffffff' : '#c8c0ff',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '10px',
              }}
            >
              {sending
                ? <><span>⏳</span> Sending...</>
                : <><span>{isDay ? '✈️' : '🚀'}</span>
                   {isDay ? 'Send Challenge' : 'Launch Challenge'}</>
              }
            </motion.button>
          </motion.div>
        )}

        {/* STEP 3 — success / error */}
        {result && (
          <motion.div key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              textAlign: 'center', padding: '40px 30px', borderRadius: '20px',
              background: isDay ? 'rgba(255,255,255,0.38)' : 'rgba(6,6,20,0.72)',
              border: result === 'success'
                ? isDay ? '1.5px solid rgba(255,255,255,0.7)' : '1.5px solid rgba(80,220,120,0.35)'
                : '1.5px solid rgba(220,80,80,0.35)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
              {result === 'success' ? (isDay ? '☁️✈️' : '🚀✨') : '⚠️'}
            </div>
            <h3 style={{
              fontFamily: "var(--font-orbitron), sans-serif", fontSize: '1.1rem',
              fontWeight: 700, color: isDay ? '#ffffff' : '#E8E8F0',
              marginBottom: '10px', letterSpacing: '0.04em',
            }}>
              {result === 'success'
                ? (isDay ? 'Challenge Launched!' : 'Transmission Received!')
                : 'Launch Failed'}
            </h3>
            <p style={{
              fontFamily: "var(--font-nunito), sans-serif", fontSize: '0.9rem',
              color: isDay ? 'rgba(255,255,255,0.75)' : 'rgba(200,210,240,0.65)',
              lineHeight: 1.6, marginBottom: '24px',
            }}>
              {result === 'success'
                ? "I've received your challenge! I'll solve it and post the solution here soon."
                : 'Something went wrong. Please try again in a moment.'}
            </p>
            <motion.button
              onClick={reset}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                padding: '10px 28px', borderRadius: '50px',
                fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.78rem',
                fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
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

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'problems'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by stars first, then order
      data.sort((a, b) => (b.stars || 0) - (a.stars || 0) || (a.order || 0) - (b.order || 0));
      setChallenges(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching problems:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <section id="testme" style={{
      width: '100%', padding: '100px 24px 110px',
      position: 'relative', zIndex: 1,
      ...(isDay ? {
        background: 'linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(49,46,129,0.95) 50%, rgba(88,28,135,0.9) 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 2px 20px rgba(167,139,250,0.2)',
        borderTop: '1px solid rgba(167,139,250,0.3)',
        borderBottom: '1px solid rgba(167,139,250,0.3)',
      } : {})
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <p style={{
            fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(123,104,238,0.8)',
            marginBottom: '10px',
          }}>
            {isDay ? '⚔️ Sky Dojo' : '🛸 Mission Control'}
          </p>
          <h2 style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', fontWeight: 900,
            color: isDay ? '#ffffff' : '#E8E8F0', letterSpacing: '0.04em',
            textShadow: isDay
              ? '0px 1px 3px rgba(0,0,0,0.6), 0 2px 24px rgba(46,134,193,0.4)'
              : '0 2px 24px rgba(123,104,238,0.5)',
            marginBottom: '16px',
          }}>Test Me</h2>
          <p style={{
            fontFamily: "var(--font-nunito), sans-serif", fontSize: '1rem',
            color: isDay ? 'rgba(255,255,255,0.72)' : 'rgba(200,210,240,0.62)',
            maxWidth: '500px', margin: '0 auto', lineHeight: 1.65,
          }}>
            {isDay
              ? 'Think you can stump me? Throw any challenge — problem-solving, design, business, life. I solve it and post the solution right here.'
              : 'Think your problem can escape my radar? Transmit any challenge. I will decode it and broadcast the solution publicly.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: '72px' }}
        >
          <ChallengeForm isDay={isDay} />
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{
                width: '44px', height: '44px',
                border: isDay ? '3px solid rgba(255,255,255,0.2)' : '3px solid rgba(123,104,238,0.2)',
                borderTopColor: isDay ? '#fff' : '#7b68ee',
                borderRadius: '50%'
              }}
            />
          </div>
        ) : challenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center',
              gap: '14px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px',
                background: isDay ? 'rgba(255,255,255,0.2)' : 'rgba(123,104,238,0.15)' }} />
              <p style={{
                fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.72rem',
                fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(200,210,240,0.45)',
                whiteSpace: 'nowrap',
              }}>
                {isDay ? '🏆 Hall of Solved Challenges' : '★ Solved Transmissions'}
              </p>
              <div style={{ flex: 1, height: '1px',
                background: isDay ? 'rgba(255,255,255,0.2)' : 'rgba(123,104,238,0.15)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {challenges.map((ch, i) => (
                <SolvedCard key={ch.id} challenge={ch} isDay={isDay} index={i} />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}