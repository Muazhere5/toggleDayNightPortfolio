'use client';






























import { m, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';


const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'MERN Stack Development Course',
    description: 'Successfully finished "Programming Hero" by Jhankar Mahabub.',
    icon: '💻',
    date: '2025',
    type: 'skill',
    group: 2,
    highlight: true,
  },
  {
    id: 2,
    title: 'ICT OLYMPIAD',
    description: 'Participated and competed in the ICT Olympiad.',
    icon: '🏆',
    date: 'Recent',
    type: 'award',
    group: 3,
    highlight: true,
  },
  {
    id: 3,
    title: 'Digital Marketing Certification',
    description: 'Completed a short online-based digital marketing course.',
    icon: '📈',
    date: 'Recent',
    type: 'skill',
    group: 2,
  },
  {
    id: 4,
    title: 'HSC Examination (Science) - GPA 5.00',
    description: 'Chittagong Port College.',
    icon: '🎓',
    date: '2018',
    type: 'education',
    group: 1,
    highlight: true,
  },
  {
    id: 5,
    title: 'BSc. in Information & Communication Engineering (ICE)',
    description: 'Noakhali Science And Technology University (NSTU) - 4th Year.',
    icon: '🏛️',
    date: '2018 - Present',
    type: 'education',
    group: 1,
  },
];


const TYPE_CONFIG = {
  education: { label: 'Education', dayRgb: '29,114,180',  nightRgb: '100,160,255', dayText: '#155e96', dayColor: 'rgba(29,114,180,0.85)',  nightColor: 'rgba(100,160,255,0.85)' },
  project:   { label: 'Project',   dayRgb: '217,119,6',   nightRgb: '255,180,80',  dayText: '#b45309', dayColor: 'rgba(217,119,6,0.85)',   nightColor: 'rgba(255,180,80,0.85)'  },
  skill:     { label: 'Skill',     dayRgb: '22,163,74',   nightRgb: '80,220,160',  dayText: '#15803d', dayColor: 'rgba(22,163,74,0.85)',   nightColor: 'rgba(80,220,160,0.85)'  },
  personal:  { label: 'Personal',  dayRgb: '190,24,93',   nightRgb: '230,130,200', dayText: '#9d174d', dayColor: 'rgba(190,24,93,0.85)',   nightColor: 'rgba(230,130,200,0.85)' },
  award:     { label: 'Award',     dayRgb: '202,138,4',   nightRgb: '255,215,0',   dayText: '#a16207', dayColor: 'rgba(202,138,4,0.9)',    nightColor: 'rgba(255,215,0,0.85)'   },
};






const BannerCloud = ({ width = 200 }) => (
  <svg width={width} height={52} viewBox={`0 0 ${width} 52`} fill="none">
    <ellipse cx={width * 0.5}  cy={40} rx={width * 0.46} ry={16} fill="rgba(255,255,255,0.78)" />
    <ellipse cx={width * 0.32} cy={30} rx={width * 0.22} ry={20} fill="rgba(255,255,255,0.78)" />
    <ellipse cx={width * 0.55} cy={24} rx={width * 0.26} ry={24} fill="rgba(255,255,255,0.78)" />
    <ellipse cx={width * 0.76} cy={32} rx={width * 0.2}  ry={17} fill="rgba(255,255,255,0.72)" />
  </svg>
);


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
    <m.div
      className="cloud-banner-item"
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
      
      <BannerCloud width={280} />

      
      <BannerRopes width={280} />

      
      <m.div
        className="cloud-banner-card"
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
        
        <div style={{
          height: '5px',
          background: `linear-gradient(90deg, ${typeConf.dayColor}, rgba(255,215,0,0.6))`,
        }} />

        <div style={{ padding: '16px 18px 18px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <m.span 
              style={{
                fontSize: '1.6rem',
                display: 'inline-block',
                textShadow: `0 2px 8px rgba(${typeConf.dayRgb}, 0.28)`,
              }}
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              {achievement.icon}
            </m.span>
            <span style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '2px 9px',
              borderRadius: '20px',
              background: `rgba(${typeConf.dayRgb}, 0.14)`,
              color: typeConf.dayText,
              border: `1px solid rgba(${typeConf.dayRgb}, 0.45)`,
            }}>
              {typeConf.label}
            </span>
            {achievement.highlight && (
              <span style={{
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(180,130,0,0.8)',
              }}>⭐ Key Win</span>
            )}
            <span style={{
              marginLeft: 'auto',
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '0.65rem',
              color: 'rgba(100,120,140,0.7)',
              letterSpacing: '0.08em',
            }}>{achievement.date}</span>
          </div>

          
          <h3 style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: '0.92rem',
            fontWeight: 700,
            color: '#2a5a8a',
            letterSpacing: '0.02em',
            marginBottom: '8px',
            lineHeight: 1.3,
          }}>
            {achievement.title}
          </h3>

          
          <p style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: '0.84rem',
            color: 'rgba(40,80,120,0.8)',
            lineHeight: 1.6,
          }}>
            {achievement.description}
          </p>
        </div>
      </m.div>
    </m.div>
  );
}

function DayAchievements() {
  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .cloud-banner-item {
            margin: 0 auto !important;
            max-width: 340px !important;
            width: 100% !important;
          }
          .cloud-banner-card {
            width: 100% !important;
          }
        }
      `}</style>
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
    </>
  );
}






const STAR_POSITIONS = [
  { id: 1, x: 20,  y: 25  },
  { id: 2, x: 45,  y: 15  },
  { id: 3, x: 75,  y: 25  },
  { id: 4, x: 80,  y: 55  },
  { id: 5, x: 45,  y: 60  },
];


const CONSTELLATION_LINES = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 1],
];

function StarMapAchievements() {
  const [activeId, setActiveId] = useState(1);
  const containerRef = useRef(null);

  const activeAchievement = ACHIEVEMENTS.find(a => a.id === activeId);

  return (
    <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>

      
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
          
          {/* Background stars — pure CSS twinkle (no Framer instances) */}
          {Array.from({ length: 60 }, (_, i) => {
            const x = ((i * 17 + 3) % 97) + 1.5;
            const y = ((i * 13 + 7) % 72) + 1.5;
            const brightness = 0.3 + (i % 3) * 0.2;
            const groupClass = ['star-slow', 'star-mid', 'star-fast'][i % 3];
            const delay = (i * 0.08) % 6;
            return (
              <circle
                key={`bg-${i}`}
                cx={x} cy={y} r={0.25}
                fill={`rgba(255,255,255,${brightness})`}
                className={groupClass}
                style={{
                  '--star-max': brightness,
                  '--star-min': brightness * 0.15,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}

          
          {CONSTELLATION_LINES.map(([fromId, toId]) => {
            const from = STAR_POSITIONS.find(s => s.id === fromId);
            const to   = STAR_POSITIONS.find(s => s.id === toId);
            if (!from || !to) return null;
            return (
              <m.line
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

          
          {STAR_POSITIONS.map((pos) => {
            const ach      = ACHIEVEMENTS.find(a => a.id === pos.id);
            const isActive = activeId === pos.id;
            const typeConf = ach ? (TYPE_CONFIG[ach.type] || TYPE_CONFIG.personal) : TYPE_CONFIG.personal;

            return (
              <g
                key={pos.id}
                role="button"
                tabIndex={0}
                aria-label={`Milestone #${pos.id}: ${ach?.title || ''}`}
                aria-pressed={isActive}
                onClick={() => setActiveId(isActive ? null : pos.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveId(isActive ? null : pos.id);
                  }
                }}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                {/* Invisible generous hit target for touch/pointer precision */}
                <circle cx={pos.x} cy={pos.y} r={8} fill="transparent" />

                <m.circle
                  cx={pos.x} cy={pos.y} r={isActive ? 4.5 : 3}
                  fill={`rgba(${typeConf.nightRgb}, 0.14)`}
                  animate={{ opacity: isActive ? [0.4, 0.9, 0.4] : [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <m.circle
                  cx={pos.x} cy={pos.y}
                  r={isActive ? 2.2 : 1.5}
                  fill={typeConf.nightColor}
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ duration: 0.25 }}
                />
                
                <text
                  x={pos.x} y={pos.y - 3.5}
                  textAnchor="middle"
                  fontSize="3"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {ach?.icon}
                </text>
                
                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fontSize="1.8"
                  fill="rgba(200,210,240,0.7)"
                  fontFamily="var(--font-rajdhani), sans-serif"
                  style={{ pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.04em' }}
                >
                  #{String(pos.id).padStart(2, '0')}
                </text>
              </g>
            );
          })}
        </svg>

        
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.62rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(200,210,240,0.48)',
          pointerEvents: 'none',
        }}>
          ↑ Tap a star or select below
        </div>
      </div>

      {/* Touch-friendly #01-#05 milestone selector row (44px+ tap targets) */}
      <div
        role="tablist"
        aria-label="Achievement milestones"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginBottom: '18px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {ACHIEVEMENTS.map((ach) => {
          const isSelected = activeId === ach.id;
          const conf = TYPE_CONFIG[ach.type] || TYPE_CONFIG.personal;
          return (
            <button
              key={ach.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveId(ach.id)}
              style={{
                minHeight: '44px',
                padding: '0 14px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0,
                cursor: 'pointer',
                background: isSelected ? `rgba(${conf.nightRgb}, 0.22)` : 'rgba(8, 10, 28, 0.72)',
                border: isSelected
                  ? `1.5px solid rgba(${conf.nightRgb}, 0.75)`
                  : '1px solid rgba(123, 104, 238, 0.28)',
                color: isSelected ? '#ffffff' : 'rgba(200, 210, 240, 0.78)',
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
              }}
            >
              <span style={{ color: conf.nightColor }}>#{String(ach.id).padStart(2, '0')}</span>
              <span>{ach.icon}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{conf.label}</span>
            </button>
          );
        })}
      </div>

      
      <AnimatePresence mode="wait">
        {activeAchievement && (() => {
          const activeConf = TYPE_CONFIG[activeAchievement.type] || TYPE_CONFIG.personal;
          return (
          <m.div
            key={activeAchievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '22px 24px',
              borderRadius: '16px',
              background: 'rgba(6,6,20,0.8)',
              border: `1.5px solid rgba(${activeConf.nightRgb}, 0.35)`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(${activeConf.nightRgb}, 0.14)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{activeAchievement.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{
                    fontFamily: "var(--font-rajdhani), sans-serif",
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '2px 9px',
                    borderRadius: '20px',
                    background: `rgba(${activeConf.nightRgb}, 0.14)`,
                    color: activeConf.nightColor,
                    border: `1px solid rgba(${activeConf.nightRgb}, 0.4)`,
                  }}>
                    {activeConf.label}
                  </span>
                  {activeAchievement.highlight && (
                    <span style={{
                      fontFamily: "var(--font-rajdhani), sans-serif",
                      fontSize: '0.6rem',
                      color: 'rgba(255,215,0,0.75)',
                      letterSpacing: '0.1em',
                    }}>⭐ Key Win</span>
                  )}
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: "var(--font-rajdhani), sans-serif",
                    fontSize: '0.65rem',
                    color: 'rgba(200,210,240,0.45)',
                    letterSpacing: '0.08em',
                  }}>{activeAchievement.date}</span>
                </div>

                <h3 style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
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
                  fontFamily: "var(--font-nunito), sans-serif",
                  fontSize: '0.88rem',
                  color: 'rgba(200,210,240,0.75)',
                  lineHeight: 1.65,
                }}>
                  {activeAchievement.description}
                </p>
              </div>
            </div>
          </m.div>
          );
        })()}
      </AnimatePresence>

      
      <m.div
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
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(200,210,240,0.5)',
            }}>{conf.label}</span>
          </div>
        ))}
      </m.div>
    </div>
  );
}




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

        
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <p style={{
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: isDay ? '#0f172a' : 'rgba(123,104,238,0.8)',
            marginBottom: '10px',
          }}>
            {isDay ? '☁️ Hall of Clouds' : '★ Star Map'}
          </p>

          <h2 style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
            fontWeight: 900,
            color: isDay ? '#0f172a' : '#E8E8F0',
            letterSpacing: '0.04em',
            textShadow: isDay
              ? '0 2px 18px rgba(255,255,255,0.6)'
              : '0 2px 24px rgba(123,104,238,0.5)',
            marginBottom: '16px',
          }}>
            Achievements
          </h2>

          <p style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: '1rem',
            fontWeight: 600,
            color: isDay ? '#1e293b' : 'rgba(200,210,240,0.62)',
            maxWidth: '460px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {isDay
              ? 'Milestones floating in my sky — every cloud a story, every banner a win.'
              : 'Every star a milestone charted. Each one earned, each one permanent in the sky.'}
          </p>
        </m.div>

        
        <m.div
          key={theme}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {isDay
            ? <DayAchievements />
            : <StarMapAchievements />
          }
        </m.div>

        
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
        >
          <p style={{
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: isDay ? '#334155' : 'rgba(200,210,240,0.45)',
          }}>
            {isDay ? '— More clouds forming soon ☁️ —' : '— More stars being charted ★ —'}
          </p>
          
          <m.a
            href="/Abdullah_Al_Muaz_Resume.pdf"
            download="Abdullah_Al_Muaz_Resume.pdf"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 32px',
              borderRadius: '50px',
              fontFamily: "var(--font-orbitron), sans-serif",
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: isDay ? 'rgba(255,255,255,0.85)' : 'rgba(123,104,238,0.18)',
              color: isDay ? '#2E86C1' : '#c8c0ff',
              border: isDay ? '2px solid rgba(46,134,193,0.5)' : '2px solid rgba(123,104,238,0.45)',
              boxShadow: isDay ? '0 8px 24px rgba(46,134,193,0.2)' : '0 8px 24px rgba(123,104,238,0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'box-shadow 0.3s, background 0.3s',
            }}
          >
            📄 Download Resume
          </m.a>
        </m.div>

      </div>
    </section>
  );
}