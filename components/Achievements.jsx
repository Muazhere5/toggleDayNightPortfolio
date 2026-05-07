'use client';

// ============================================================
// components/Achievements.jsx — ACHIEVEMENTS SECTION
//
// CONNECTION MAP:
//   page.jsx    → mounts <Achievements theme={theme} /> last
//   globals.css → CSS variables, fonts
//
// PROPS:
//   theme {string} 'day' | 'night'
//
// DESIGN:
//   Day Vision  → "Hall of Clouds"
//                 Each achievement on a banner hanging from cloud
//                 Gold + white ribbons drift in from alternating sides
//                 Kite flies past on scroll trigger
//
//   Night Vision → "Star Map"
//                 Each achievement is a glowing star node
//                 Constellation lines connect related achievements
//                 Click/tap a star to expand full details
//                 Stars pulse with soft glow animation
//
// CUSTOMISE:
//   Edit the ACHIEVEMENTS array below with your real milestones.
//   Each item has: title, description, icon, date, type, group
//   type: 'education' | 'project' | 'skill' | 'personal' | 'award'
//   group: used in night mode to draw constellation lines (1 | 2 | 3)
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

// ── YOUR ACHIEVEMENTS — edit this array ─────────────────────
const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'Completed First MERN Project',
    description: 'Built and deployed a full-stack MERN application with user authentication, CRUD operations, and responsive UI. First production-ready project.',
    icon: '🚀',
    date: '2024',
    type: 'project',
    group: 1,
    highlight: true,
  },
  {
    id: 2,
    title: 'Mastered React.js',
    description: 'Gained deep understanding of React hooks, context API, component patterns, and state management through building real projects.',
    icon: '⚛️',
    date: '2024',
    type: 'skill',
    group: 1,
  },
  {
    id: 3,
    title: 'Second Full Stack Project',
    description: 'Delivered a second MERN project with advanced features — JWT auth, file uploads, and an admin dashboard panel.',
    icon: '💻',
    date: '2024',
    type: 'project',
    group: 2,
    highlight: true,
  },
  {
    id: 4,
    title: 'Started Learning Next.js',
    description: 'Began the journey into Next.js App Router, server components, and modern full-stack patterns — this portfolio is the proof.',
    icon: '▲',
    date: '2025',
    type: 'skill',
    group: 2,
  },
  {
    id: 5,
    title: 'Built Sky Portfolio',
    description: 'Created this unique Day/Night sky-space themed portfolio in Next.js with framer-motion animations, dual theme system, and challenge arena.',
    icon: '🌤️',
    date: '2025',
    type: 'project',
    group: 3,
    highlight: true,
  },
  {
    id: 6,
    title: 'Self-Taught Developer',
    description: 'Every skill, every project, every line of code learned independently — proof that consistency beats credentials.',
    icon: '🎓',
    date: '2023–2025',
    type: 'personal',
    group: 3,
  },
];

// ── TYPE CONFIG ───────────────────────────────────────────────
const TYPE_CONFIG = {
  education: { label: 'Education', dayColor: 'rgba(100,160,220,0.8)',  nightColor: 'rgba(100,160,255,0.8)' },
  project:   { label: 'Project',   dayColor: 'rgba(255,165,50,0.85)',  nightColor: 'rgba(255,180,80,0.8)'  },
  skill:     { label: 'Skill',     dayColor: 'rgba(80,190,130,0.85)',  nightColor: 'rgba(80,220,160,0.8)'  },
  personal:  { label: 'Personal',  dayColor: 'rgba(220,100,180,0.85)', nightColor: 'rgba(230,130,200,0.8)' },
  award:     { label: 'Award',     dayColor: 'rgba(255,215,0,0.9)',    nightColor: 'rgba(255,215,0,0.85)'  },
};

// ════════════════════════════════════════════════════════════
// DAY VISION — CLOUD BANNERS
// ════════════════════════════════════════════════════════════

// Cloud shape above banner
const BannerCloud = ({ width = 200 }) => (
  <svg width={width} height={52} viewBox={`0 0 ${width} 52`} fill="none">
    <ellipse cx={width * 0.5}  cy={40} rx={width * 0.46} ry={16} fill="rgba(255,255,255,0.78)" />
    <ellipse cx={width * 0.32} cy={30} rx={width * 0.22} ry={20} fill="rgba(255,255,255,0.78)" />
    <ellipse cx={width * 0.55} cy={24} rx={width * 0.26} ry={24} fill="rgba(255,255,255,0.78)" />
    <ellipse cx={width * 0.76} cy={32} rx={width * 0.2}  ry={17} fill="rgba(255,255,255,0.72)" />
  </svg>
);

// Rope lines hanging from cloud
const BannerRopes = ({ width = 200 }) => (
  <svg width={width} height={22} viewBox={`0 0 ${width} 22`} fill="none">
    <line x1={width * 0.28} y1="0" x2={width * 0.25} y2="22"
      stroke="rgba(180,140,80,0.55)" strokeWidth="1.5" />
    <line x1={width * 0.72} y1="0" x2={width * 0.75} y2="22"
      stroke="rgba(180,140,80,0.55)" strokeWidth="1.5" />
  </svg>
);

function CloudBannerCard({ achievement, index }) {
  const isLeft   = index % 2 === 0;
  const typeConf = TYPE_CONFIG[achievement.type] || TYPE_CONFIG.personal;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '360px',
        width: '100%',
        margin: isLeft ? '0 auto 0 0' : '0 0 0 auto',
      }}
    >
      {/* Cloud top */}
      <BannerCloud width={280} />

      {/* Ropes */}
      <BannerRopes width={280} />

      {/* Banner card */}
      <motion.div
        whileHover={{ y: -6, rotate: isLeft ? -1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          width: '280px',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.62)',
          border: '2px solid rgba(255,255,255,0.85)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 8px 28px rgba(46,134,193,0.15), 0 2px 8px rgba(135,206,235,0.2)',
        }}
      >
        {/* Colored top strip */}
        <div style={{
          height: '5px',
          background: `linear-gradient(90deg, ${typeConf.dayColor}, rgba(255,215,0,0.6))`,
        }} />

        <div style={{ padding: '16px 18px 18px' }}>
          {/* Icon + type row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>{achievement.icon}</span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '2px 9px',
              borderRadius: '20px',
              background: `${typeConf.dayColor}22`,
              color: typeConf.dayColor.replace('0.8', '1').replace('0.85', '1'),
              border: `1px solid ${typeConf.dayColor}`,
            }}>
              {typeConf.label}
            </span>
            {achievement.highlight && (
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(180,130,0,0.8)',
              }}>⭐ Key Win</span>
            )}
            <span style={{
              marginLeft: 'auto',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.65rem',
              color: 'rgba(100,120,140,0.7)',
              letterSpacing: '0.08em',
            }}>{achievement.date}</span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '0.92rem',
            fontWeight: 700,
            color: '#2a5a8a',
            letterSpacing: '0.02em',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}>
            {achievement.title}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.84rem',
            color: 'rgba(40,80,120,0.8)',
            lineHeight: 1.6,
          }}>
            {achievement.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DayAchievements() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      width: '100%',
      maxWidth: '780px',
      margin: '0 auto',
    }}>
      {ACHIEVEMENTS.map((achievement, index) => (
        <CloudBannerCard
          key={achievement.id}
          achievement={achievement}
          index={index}
        />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// NIGHT VISION — STAR MAP CONSTELLATION
// ════════════════════════════════════════════════════════════

// Star positions — laid out manually for a good constellation look
const STAR_POSITIONS = [
  { id: 1, x: 15,  y: 18  },
  { id: 2, x: 38,  y: 8   },
  { id: 3, x: 62,  y: 22  },
  { id: 4, x: 80,  y: 10  },
  { id: 5, x: 50,  y: 55  },
  { id: 6, x: 22,  y: 68  },
];

// Constellation lines between stars (by achievement id pairs)
const CONSTELLATION_LINES = [
  [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [1, 6],
];

function StarMapAchievements() {
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);

  const activeAchievement = ACHIEVEMENTS.find(a => a.id === activeId);

  return (
    <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>

      {/* SVG constellation map */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '55%',
          borderRadius: '20px',
          background: 'rgba(4,4,16,0.65)',
          border: '1px solid rgba(123,104,238,0.18)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 100 75"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background micro-stars */}
          {Array.from({ length: 60 }, (_, i) => {
            const x = ((i * 17 + 3) % 97) + 1.5;
            const y = ((i * 13 + 7) % 72) + 1.5;
            return (
              <motion.circle
                key={`bg-${i}`}
                cx={x} cy={y} r={0.25}
                fill="rgba(255,255,255,0.45)"
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2 + (i % 3), delay: i * 0.08, repeat: Infinity }}
              />
            );
          })}

          {/* Constellation lines */}
          {CONSTELLATION_LINES.map(([fromId, toId]) => {
            const from = STAR_POSITIONS.find(s => s.id === fromId);
            const to   = STAR_POSITIONS.find(s => s.id === toId);
            if (!from || !to) return null;
            return (
              <motion.line
                key={`line-${fromId}-${toId}`}
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke="rgba(123,104,238,0.3)"
                strokeWidth="0.3"
                strokeDasharray="1 0.8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            );
          })}

          {/* Achievement stars */}
          {STAR_POSITIONS.map((pos) => {
            const ach      = ACHIEVEMENTS.find(a => a.id === pos.id);
            const isActive = activeId === pos.id;
            const typeConf = ach ? (TYPE_CONFIG[ach.type] || TYPE_CONFIG.personal) : TYPE_CONFIG.personal;

            return (
              <g
                key={pos.id}
                onClick={() => setActiveId(isActive ? null : pos.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer glow */}
                <motion.circle
                  cx={pos.x} cy={pos.y} r={isActive ? 4.5 : 3}
                  fill={typeConf.nightColor.replace('0.8', '0.12')}
                  animate={{ r: isActive ? [4.5, 5.5, 4.5] : [3, 3.8, 3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Star core */}
                <motion.circle
                  cx={pos.x} cy={pos.y}
                  r={isActive ? 2.2 : 1.5}
                  fill={typeConf.nightColor}
                  style={{
                    filter: `drop-shadow(0 0 2px ${typeConf.nightColor})`,
                  }}
                  animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Icon text */}
                <text
                  x={pos.x} y={pos.y - 3.5}
                  textAnchor="middle"
                  fontSize="2.8"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {ach?.icon}
                </text>
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fontSize="1.8"
                  fill="rgba(200,210,240,0.7)"
                  fontFamily="Rajdhani, sans-serif"
                  style={{ pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.04em' }}
                >
                  #{String(pos.id).padStart(2, '0')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tap hint */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.62rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(200,210,240,0.38)',
          pointerEvents: 'none',
        }}>
          ↑ Tap a star to reveal
        </div>
      </div>

      {/* Detail panel — expands when a star is tapped */}
      <AnimatePresence mode="wait">
        {activeAchievement && (
          <motion.div
            key={activeAchievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '22px 24px',
              borderRadius: '16px',
              background: 'rgba(6,6,20,0.8)',
              border: `1.5px solid ${(TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal).nightColor}44`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${(TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal).nightColor}18`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{activeAchievement.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '2px 9px',
                    borderRadius: '20px',
                    background: `${(TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal).nightColor}18`,
                    color: (TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal).nightColor,
                    border: `1px solid ${(TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal).nightColor}55`,
                  }}>
                    {(TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal).label}
                  </span>
                  {activeAchievement.highlight && (
                    <span style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '0.6rem',
                      color: 'rgba(255,215,0,0.75)',
                      letterSpacing: '0.1em',
                    }}>⭐ Key Win</span>
                  )}
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: '0.65rem',
                    color: 'rgba(200,210,240,0.45)',
                    letterSpacing: '0.08em',
                  }}>{activeAchievement.date}</span>
                </div>

                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#E8E8F0',
                  letterSpacing: '0.03em',
                  marginBottom: '8px',
                  lineHeight: 1.3,
                }}>
                  {activeAchievement.title}
                </h3>

                <p style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '0.88rem',
                  color: 'rgba(200,210,240,0.75)',
                  lineHeight: 1.65,
                }}>
                  {activeAchievement.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '28px',
        }}
      >
        {Object.entries(TYPE_CONFIG).map(([type, conf]) => (
          <div key={type} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: conf.nightColor,
              boxShadow: `0 0 6px ${conf.nightColor}`,
            }} />
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(200,210,240,0.5)',
            }}>{conf.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Achievements({ theme }) {
  const isDay = theme === 'day';

  return (
    <section
      id="achievements"
      style={{
        width: '100%',
        padding: '100px 24px 140px',
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
          style={{ textAlign: 'center', marginBottom: '60px' }}
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
            {isDay ? '☁️ Hall of Clouds' : '★ Star Map'}
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
            Achievements
          </h2>

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '1rem',
            color: isDay ? 'rgba(255,255,255,0.72)' : 'rgba(200,210,240,0.62)',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {isDay
              ? 'Milestones floating in my sky — every cloud a story, every banner a win.'
              : 'Every star a milestone charted. Each one earned, each one permanent in the sky.'}
          </p>
        </motion.div>

        {/* ── THEME-SPECIFIC VISUALISATION ─────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {isDay
            ? <DayAchievements />
            : <StarMapAchievements />
          }
        </motion.div>

        {/* ── CLOSING LINE ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '60px' }}
        >
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: isDay ? 'rgba(255,255,255,0.45)' : 'rgba(200,210,240,0.35)',
          }}>
            {isDay ? '— More clouds forming soon ☁️ —' : '— More stars being charted ★ —'}
          </p>
        </motion.div>

      </div>
    </section>
  );
}