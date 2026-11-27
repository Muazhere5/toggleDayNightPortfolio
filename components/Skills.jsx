'use client';











import { m } from 'framer-motion';
import { useState } from 'react';
import {
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiDaisyui,
  SiFirebase,
  SiSupabase,
  SiVercel,
} from 'react-icons/si';
import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaEnvelope,
} from 'react-icons/fa';


const SKILLS = [
  { id: 1,  name: 'React',        Icon: FaReact,       color: '#61DAFB', orbit: 'inner'  },
  { id: 2,  name: 'Next.js',      Icon: SiNextdotjs,   color: '#888888', orbit: 'inner'  },
  { id: 3,  name: 'Vercel',       Icon: SiVercel,      color: '#888888', orbit: 'inner'  },
  { id: 4,  name: 'Node.js',      Icon: FaNodeJs,      color: '#339933', orbit: 'mid'    },
  { id: 5,  name: 'Express.js',   Icon: SiExpress,     color: '#888888', orbit: 'mid'    },
  { id: 6,  name: 'MongoDB',      Icon: SiMongodb,     color: '#47A248', orbit: 'mid'    },
  { id: 7,  name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4', orbit: 'outer'  },
  { id: 8,  name: 'DaisyUI',      Icon: SiDaisyui,     color: '#5A0EF8', orbit: 'outer'  },
  { id: 9,  name: 'Firebase',     Icon: SiFirebase,    color: '#FFCA28', orbit: 'outer'  },
  { id: 10, name: 'Supabase',     Icon: SiSupabase,    color: '#3ECF8E', orbit: 'outer'  },
];


const SOCIALS = [
  { id: 1, name: 'GitHub',   Icon: FaGithub,   href: 'https://github.com/Muazhere5',    color: '#ffffff' },
  { id: 2, name: 'LinkedIn', Icon: FaLinkedin, href: 'https://www.linkedin.com/in/abdullah-al-muaz-bb97a3370', color: '#0A66C2' },
  { id: 5, name: 'Facebook', Icon: FaFacebook, href: 'https://www.facebook.com/abdullah.almuaz.7',    color: '#1877F2' },
  { id: 6, name: 'Email',    Icon: FaEnvelope, href: 'mailto:muazctg07@gmail.com',               color: '#EA4335' },
];





const KiteTop = () => (
  <svg width="48" height="90" viewBox="0 0 48 90" fill="none"
    style={{ margin: '0 auto', display: 'block' }}>
    <polygon points="24,2 46,32 24,58 2,32" fill="#FF6B6B" opacity="0.88" />
    <polygon points="24,2 46,32 24,58 2,32" fill="none"
      stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
    <line x1="2"  y1="32" x2="46" y2="32"
      stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
    <line x1="24" y1="2"  x2="24" y2="58"
      stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
    <path d="M24 58 Q18 68 24 78 Q30 88 24 88"
      stroke="rgba(255,107,107,0.6)" strokeWidth="1.8"
      fill="none" strokeLinecap="round" />
    {[67, 78].map((y, i) => (
      <ellipse key={i} cx="24" cy={y} rx="4" ry="2.5"
        fill="#FFD700" opacity="0.75" />
    ))}
  </svg>
);

function KiteSkillBadge({ skill, index, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const swayDelay = index * 0.18;

  return (
    <m.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'default',
        width: compact ? '100%' : 'auto',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <m.div
        style={{
          width: '2px',
          height: compact ? '18px' : '28px',
          background: 'rgba(150,100,50,0.5)',
          borderRadius: '2px',
        }}
        animate={{ scaleY: [1, 0.95, 1], skewX: ['-2deg', '2deg', '-2deg'] }}
        transition={{ duration: 2.4, delay: swayDelay, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        animate={{
          rotate: hovered ? [0, -4, 4, 0] : ['-3deg', '3deg', '-3deg'],
          y: hovered ? -4 : 0,
        }}
        transition={
          hovered
            ? { duration: 0.4 }
            : { duration: 2.4, delay: swayDelay, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          display: 'flex',
          flexDirection: compact ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? '8px' : '6px',
          padding: compact ? '10px 12px' : '12px 16px',
          borderRadius: '14px',
          minHeight: '44px',
          width: compact ? '100%' : 'auto',
          background: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.68)',
          border: '1.5px solid rgba(255,255,255,0.88)',
          backdropFilter: 'blur(10px)',
          boxShadow: hovered
            ? '0 8px 24px rgba(46,134,193,0.25)'
            : '0 4px 14px rgba(46,134,193,0.12)',
          minWidth: compact ? '0' : '72px',
          transition: 'background 0.25s, box-shadow 0.25s',
        }}
      >
        <span style={{ fontSize: compact ? '1.35rem' : '1.6rem', color: skill.color,
          display: 'inline-flex', alignItems: 'center',
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}>
          <skill.Icon />
        </span>
        <span style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: compact ? '0.78rem' : '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#0f172a',
          whiteSpace: 'nowrap',
        }}>
          {skill.name}
        </span>
      </m.div>
    </m.div>
  );
}

function KiteStringLayout({ isDay }) {
  const rows = [SKILLS.slice(0, 3), SKILLS.slice(3, 7), SKILLS.slice(7, 12)];

  return (
    <>
      <style>{`
        .kite-desktop-only { display: block; }
        .kite-mobile-only  { display: none; }
        @media (max-width: 639px) {
          .kite-desktop-only { display: none; }
          .kite-mobile-only  { display: flex; }
        }
      `}</style>

      {/* Desktop Kite String (>= 640px) */}
      <div className="kite-desktop-only" style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
        {rows.map((row, rowIndex) => (
          <m.div
            key={rowIndex}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: rowIndex * 0.15 }}
            style={{ display: 'flex', justifyContent: 'center',
              gap: '20px', marginBottom: '8px', flexWrap: 'wrap' }}
          >
            {rowIndex === 0 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', marginRight: '4px' }}>
                <KiteTop />
              </div>
            )}
            {row.map((skill, i) => (
              <m.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: rowIndex * 0.12 + i * 0.07, duration: 0.5 }}
              >
                <KiteSkillBadge skill={skill} index={rowIndex * 4 + i} isDay={isDay} />
              </m.div>
            ))}
          </m.div>
        ))}
      </div>

      {/* Mobile Kite Spine + 2-Column Grid (< 640px) */}
      <div
        className="kite-mobile-only"
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          margin: '0 auto',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, marginBottom: '6px' }}>
          <KiteTop />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '82px',
            bottom: '18px',
            left: '50%',
            width: '2px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(255,107,107,0.55), rgba(29,114,180,0.28), transparent)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '12px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {SKILLS.map((skill, i) => (
            <KiteSkillBadge key={skill.id} skill={skill} index={i} isDay={isDay} compact />
          ))}
        </div>
      </div>
    </>
  );
}





/*
  PERF FIX: OrbitIcon — uses shared CSS @keyframes driven by CSS custom
  properties (--start-angle, --orbit-r), eliminating per-icon <style> injection.
*/
function OrbitIcon({ skill, orbitRadius, duration, startAngle, size = 46 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: size, height: size,
        marginTop: -size / 2, marginLeft: -size / 2,
        '--start-angle': `${startAngle}deg`,
        '--orbit-r': `${orbitRadius}px`,
        animation: `skillOrbitCW ${duration}s linear infinite`,
        willChange: 'transform',
      }}
    >
      {/* Inner — counter-rotates so badge stays upright */}
      <div
        style={{
          width: size, height: size,
          animation: `skillOrbitCCW ${duration}s linear infinite`,
          willChange: 'transform',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            width: size, height: size, borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
            background: hovered ? 'rgba(123,104,238,0.28)' : 'rgba(8,8,28,0.7)',
            border: `1.5px solid ${hovered ? skill.color : 'rgba(123,104,238,0.3)'}`,
            backdropFilter: 'blur(10px)',
            boxShadow: hovered ? `0 0 20px ${skill.color}55` : '0 2px 12px rgba(0,0,0,0.5)',
            cursor: 'default',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s, transform 0.2s',
          }}
        >
          <span style={{ fontSize: '1.25rem', color: skill.color }}>
            <skill.Icon />
          </span>
          <span style={{
            fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.45rem',
            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(200,210,240,0.75)', whiteSpace: 'nowrap',
          }}>
            {skill.name}
          </span>
        </div>
      </div>
    </div>
  );
}

const OrbitRing = ({ radius, opacity = 0.18 }) => (
  <div style={{
    position: 'absolute', top: '50%', left: '50%',
    width: radius * 2, height: radius * 2,
    marginTop: -radius, marginLeft: -radius,
    borderRadius: '50%',
    border: `1px solid rgba(123,104,238,${opacity})`,
    pointerEvents: 'none',
  }} />
);

const ORBIT_TIERS = [
  { key: 'inner', label: 'Core Orbit',   accent: '#61DAFB', ring: '01' },
  { key: 'mid',   label: 'Backend Ring', accent: '#47A248', ring: '02' },
  { key: 'outer', label: 'Cloud & UI',   accent: '#a898ff', ring: '03' },
];

function SatelliteOrbitLayout() {
  const innerSkills = SKILLS.filter(s => s.orbit === 'inner');
  const midSkills   = SKILLS.filter(s => s.orbit === 'mid');
  const outerSkills = SKILLS.filter(s => s.orbit === 'outer');

  const INNER_R = 100, MID_R = 160, OUTER_R = 220;
  const containerSize = (OUTER_R + 60) * 2;

  return (
    <>
      <style>{`
        @keyframes skillOrbitCW {
          from { transform: rotate(var(--start-angle, 0deg)) translateX(var(--orbit-r, 100px)); }
          to   { transform: rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--orbit-r, 100px)); }
        }
        @keyframes skillOrbitCCW {
          from { transform: rotate(calc(var(--start-angle, 0deg) * -1)); }
          to   { transform: rotate(calc((var(--start-angle, 0deg) + 360deg) * -1)); }
        }
        @keyframes orbitHubPulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(123,104,238,0.06), 0 0 30px rgba(123,104,238,0.15); }
          50%       { box-shadow: 0 0 0 10px rgba(123,104,238,0.04), 0 0 50px rgba(123,104,238,0.28); }
        }
        .orbit-desktop-only {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          width: 100%;
          padding: 20px 0;
        }
        .orbit-mobile-only {
          display: none;
        }
        @media (max-width: 639px) {
          .orbit-desktop-only { display: none; }
          .orbit-mobile-only  { display: flex; }
        }
      `}</style>

      {/* Desktop Satellite Orbit (>= 640px) */}
      <div className="orbit-desktop-only">
        <div
          className="orbit-container"
          style={{
            position: 'relative',
            width: containerSize,
            height: containerSize,
            margin: '0 auto',
            flexShrink: 0,
          }}
        >
          <OrbitRing radius={INNER_R} opacity={0.22} />
          <OrbitRing radius={MID_R}   opacity={0.17} />
          <OrbitRing radius={OUTER_R} opacity={0.13} />

          <div
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90px', height: '90px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(circle, rgba(123,104,238,0.25) 0%, rgba(5,5,20,0.85) 70%)',
              border: '2px solid rgba(123,104,238,0.5)', zIndex: 10,
              animation: 'orbitHubPulse 3s ease-in-out infinite',
            }}
          >
            <span style={{
              fontFamily: "var(--font-orbitron), sans-serif", fontSize: '0.75rem',
              fontWeight: 900, color: 'rgba(200,210,255,0.9)',
              letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.2,
            }}>MUAZ</span>
          </div>

          {innerSkills.map((s, i) => (
            <OrbitIcon key={s.id} skill={s} orbitRadius={INNER_R} duration={14}
              startAngle={(i / innerSkills.length) * 360} size={44} />
          ))}
          {midSkills.map((s, i) => (
            <OrbitIcon key={s.id} skill={s} orbitRadius={MID_R} duration={22}
              startAngle={(i / midSkills.length) * 360 + 30} size={44} />
          ))}
          {outerSkills.map((s, i) => (
            <OrbitIcon key={s.id} skill={s} orbitRadius={OUTER_R} duration={32}
              startAngle={(i / outerSkills.length) * 360 + 15} size={40} />
          ))}
        </div>
      </div>

      {/* Mobile Mission Control Orbital List (< 640px) */}
      <div
        className="orbit-mobile-only"
        style={{
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        {ORBIT_TIERS.map(({ key, label, accent, ring }) => {
          const tierSkills = SKILLS.filter((s) => s.orbit === key);
          return (
            <div
              key={key}
              style={{
                padding: '14px',
                borderRadius: '18px',
                background: 'rgba(8, 10, 28, 0.72)',
                border: '1px solid rgba(123, 104, 238, 0.28)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: accent,
                  boxShadow: `0 0 10px ${accent}`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#E8E8F0',
                }}>
                  {label}
                </span>
                <div style={{
                  flex: 1,
                  height: '1px',
                  borderBottom: '1px dashed rgba(123, 104, 238, 0.35)',
                }} />
                <span style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'rgba(168, 152, 255, 0.85)',
                }}>
                  ORBIT {ring}
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {tierSkills.map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      minHeight: '44px',
                      padding: '8px 14px',
                      borderRadius: '999px',
                      background: 'rgba(123, 104, 238, 0.12)',
                      border: `1px solid ${skill.color}55`,
                    }}
                  >
                    <span style={{ fontSize: '1.15rem', color: skill.color, display: 'inline-flex' }}>
                      <skill.Icon />
                    </span>
                    <span style={{
                      fontFamily: "var(--font-rajdhani), sans-serif",
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#E8E8F0',
                    }}>
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}




function SocialsRow({ isDay }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', gap: '14px', marginTop: '56px' }}
    >
      {SOCIALS.map((social, i) => (
        <m.a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
          whileHover={{ y: -6, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            minHeight: '44px',
            padding: '10px 20px',
            borderRadius: isDay ? '50px' : '14px',
            textDecoration: 'none',
            background: isDay ? 'rgba(255,255,255,0.78)' : 'rgba(8,8,28,0.7)',
            border: isDay
              ? '1.5px solid rgba(29,114,180,0.28)'
              : `1.5px solid ${social.color}44`,
            backdropFilter: 'blur(12px)',
            boxShadow: isDay
              ? '0 4px 16px rgba(46,134,193,0.12)'
              : `0 4px 16px rgba(0,0,0,0.4)`,
            transition: 'box-shadow 0.25s',
          }}
        >
          <span style={{ fontSize: '1.1rem',
            color: isDay ? '#1d72b4' : social.color }}>
            <social.Icon />
          </span>
          <span style={{
            fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isDay ? '#0f172a' : 'rgba(200,210,240,0.85)',
          }}>
            {social.name}
          </span>
        </m.a>
      ))}
    </m.div>
  );
}




export default function Skills({ theme }) {
  const isDay = theme === 'day';

  return (
    <section id="skills" style={{
      width: '100%', padding: '100px 24px 110px',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <p style={{
            fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: isDay ? '#0f172a' : 'rgba(123,104,238,0.8)',
            marginBottom: '10px',
          }}>
            {isDay ? '🪁 My Tech Kite' : '🛸 My Tech Orbit'}
          </p>
          <h2 style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', fontWeight: 900,
            color: isDay ? '#0f172a' : '#E8E8F0', letterSpacing: '0.04em',
            textShadow: isDay
              ? '0 2px 18px rgba(255,255,255,0.6)'
              : '0 2px 24px rgba(123,104,238,0.5)',
            marginBottom: '16px',
          }}>Skills & Stack</h2>
          <p style={{
            fontFamily: "var(--font-nunito), sans-serif", fontSize: '1rem',
            fontWeight: 600,
            color: isDay ? '#1e293b' : 'rgba(200,210,240,0.62)',
            maxWidth: '460px', margin: '0 auto', lineHeight: 1.6,
          }}>
            {isDay
              ? 'The tools flying in my kit — each one battle-tested in real projects.'
              : 'Technologies orbiting my development universe — each one mission-proven.'}
          </p>
        </m.div>

        <m.div
          key={theme}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isDay ? <KiteStringLayout isDay={isDay} /> : <SatelliteOrbitLayout />}
        </m.div>

        <div style={{
          marginTop: '24px', paddingTop: '40px',
          borderTop: isDay
            ? '1px solid rgba(255,255,255,0.2)'
            : '1px solid rgba(123,104,238,0.15)',
        }}>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "var(--font-rajdhani), sans-serif", fontSize: '0.72rem',
              fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
              textAlign: 'center',
              color: isDay ? '#1e293b' : 'rgba(200,210,240,0.45)',
              marginBottom: '4px',
            }}
          >
            {isDay ? '☁ Find me floating at' : '★ Locate me in the cosmos'}
          </m.p>
          <SocialsRow isDay={isDay} />
        </div>
      </div>
    </section>
  );
}