'use client';

// ============================================================
// components/Skills.jsx — TECH STACK + SOCIALS SECTION
// BUG FIXES APPLIED:
//   🔴 SiVscode  → removed (doesn't exist in installed version)
//   🔴 SiCss3   → removed (doesn't exist in installed version)
//   🔴 SiCss    → removed (uncertain across versions)
//   ✅ Replaced with FaCss3Alt + FaCode from react-icons/fa
//      (fa icons are stable across ALL react-icons versions)
// ============================================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiJavascript,
  SiHtml5,
  SiGit,
  SiTailwindcss,
  SiGithub,
} from 'react-icons/si';
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaCss3Alt,
  FaCode,
} from 'react-icons/fa';

// ── SKILLS DATA ───────────────────────────────────────────────
const SKILLS = [
  { id: 1,  name: 'React',      Icon: SiReact,       color: '#61DAFB', orbit: 'inner'  },
  { id: 2,  name: 'Next.js',    Icon: SiNextdotjs,   color: '#ffffff', orbit: 'inner'  },
  { id: 3,  name: 'Node.js',    Icon: SiNodedotjs,   color: '#68A063', orbit: 'mid'    },
  { id: 4,  name: 'MongoDB',    Icon: SiMongodb,     color: '#47A248', orbit: 'mid'    },
  { id: 5,  name: 'Express',    Icon: SiExpress,     color: '#cccccc', orbit: 'mid'    },
  { id: 6,  name: 'JavaScript', Icon: SiJavascript,  color: '#F7DF1E', orbit: 'outer'  },
  { id: 7,  name: 'HTML5',      Icon: SiHtml5,       color: '#E34F26', orbit: 'outer'  },
  { id: 8,  name: 'CSS3',       Icon: FaCss3Alt,     color: '#1572B6', orbit: 'outer'  },
  { id: 9,  name: 'Tailwind',   Icon: SiTailwindcss, color: '#38BDF8', orbit: 'outer'  },
  { id: 10, name: 'Git',        Icon: SiGit,         color: '#F05032', orbit: 'mid'    },
  { id: 11, name: 'VS Code',    Icon: FaCode,        color: '#007ACC', orbit: 'outer'  },
  { id: 12, name: 'GitHub',     Icon: SiGithub,      color: '#ffffff', orbit: 'inner'  },
];

// ── SOCIALS DATA ──────────────────────────────────────────────
const SOCIALS = [
  { id: 1, name: 'GitHub',   Icon: FaGithub,   href: 'https://github.com/yourusername',    color: '#ffffff' },
  { id: 2, name: 'LinkedIn', Icon: FaLinkedin, href: 'https://linkedin.com/in/yourprofile', color: '#0A66C2' },
  { id: 3, name: 'Facebook', Icon: FaFacebook, href: 'https://facebook.com/yourprofile',    color: '#1877F2' },
  { id: 4, name: 'Twitter',  Icon: FaTwitter,  href: 'https://twitter.com/yourhandle',      color: '#1DA1F2' },
  { id: 5, name: 'Email',    Icon: FaEnvelope, href: 'mailto:your@email.com',               color: '#EA4335' },
];

// ════════════════════════════════════════════════════════════
// DAY VISION — KITE STRING LAYOUT
// ════════════════════════════════════════════════════════════

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

function KiteSkillBadge({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  const swayDelay = index * 0.18;

  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'default' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <motion.div
        style={{ width: '2px', height: '28px', background: 'rgba(150,100,50,0.5)', borderRadius: '2px' }}
        animate={{ scaleY: [1, 0.95, 1], skewX: ['-2deg', '2deg', '-2deg'] }}
        transition={{ duration: 2.4, delay: swayDelay, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
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
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '6px', padding: '12px 16px', borderRadius: '14px',
          background: hovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)',
          border: '1.5px solid rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: hovered
            ? '0 8px 24px rgba(46,134,193,0.25)'
            : '0 4px 14px rgba(46,134,193,0.12)',
          minWidth: '72px',
          transition: 'background 0.25s, box-shadow 0.25s',
        }}
      >
        <span style={{ fontSize: '1.6rem', color: skill.color,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}>
          <skill.Icon />
        </span>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif", fontSize: '0.62rem',
          fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(30,80,120,0.9)', whiteSpace: 'nowrap',
        }}>
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

function KiteStringLayout({ isDay }) {
  const rows = [SKILLS.slice(0, 3), SKILLS.slice(3, 7), SKILLS.slice(7, 12)];

  return (
    <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
      {rows.map((row, rowIndex) => (
        <motion.div
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
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: rowIndex * 0.12 + i * 0.07, duration: 0.5 }}
            >
              <KiteSkillBadge skill={skill} index={rowIndex * 4 + i} isDay={isDay} />
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// NIGHT VISION — SATELLITE ORBIT LAYOUT
// ════════════════════════════════════════════════════════════

function OrbitIcon({ skill, orbitRadius, duration, startAngle, size = 46 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      style={{
        position: 'absolute', top: '50%', left: '50%',
        width: size, height: size,
        marginTop: -size / 2, marginLeft: -size / 2,
      }}
      animate={{ rotate: [startAngle, startAngle + 360] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <motion.div
        style={{ width: size, height: size, position: 'relative',
          transform: `translateX(${orbitRadius}px)` }}
        animate={{ rotate: [-startAngle, -(startAngle + 360)] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <motion.div
          style={{
            width: size, height: size, borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
            background: hovered ? 'rgba(123,104,238,0.28)' : 'rgba(8,8,28,0.7)',
            border: `1.5px solid ${hovered ? skill.color : 'rgba(123,104,238,0.3)'}`,
            backdropFilter: 'blur(10px)',
            boxShadow: hovered
              ? `0 0 20px ${skill.color}55`
              : '0 2px 12px rgba(0,0,0,0.5)',
            cursor: 'default',
            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
          }}
          whileHover={{ scale: 1.2 }}
        >
          <span style={{ fontSize: '1.25rem', color: skill.color }}>
            <skill.Icon />
          </span>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: '0.45rem',
            fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(200,210,240,0.75)', whiteSpace: 'nowrap',
          }}>
            {skill.name}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
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

function SatelliteOrbitLayout() {
  const innerSkills = SKILLS.filter(s => s.orbit === 'inner');
  const midSkills   = SKILLS.filter(s => s.orbit === 'mid');
  const outerSkills = SKILLS.filter(s => s.orbit === 'outer');

  const INNER_R = 100, MID_R = 160, OUTER_R = 220;
  const containerSize = (OUTER_R + 60) * 2;

  return (
    <div style={{ position: 'relative', width: containerSize,
      height: containerSize, margin: '0 auto', maxWidth: '100%' }}>
      <OrbitRing radius={INNER_R} opacity={0.22} />
      <OrbitRing radius={MID_R}   opacity={0.17} />
      <OrbitRing radius={OUTER_R} opacity={0.13} />

      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90px', height: '90px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle, rgba(123,104,238,0.25) 0%, rgba(5,5,20,0.85) 70%)',
          border: '2px solid rgba(123,104,238,0.5)', zIndex: 10,
        }}
        animate={{ boxShadow: [
          '0 0 0 6px rgba(123,104,238,0.06), 0 0 30px rgba(123,104,238,0.15)',
          '0 0 0 10px rgba(123,104,238,0.04), 0 0 50px rgba(123,104,238,0.28)',
          '0 0 0 6px rgba(123,104,238,0.06), 0 0 30px rgba(123,104,238,0.15)',
        ]}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: '0.75rem',
          fontWeight: 900, color: 'rgba(200,210,255,0.9)',
          letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.2,
        }}>MUAZ</span>
      </motion.div>

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
  );
}

// ════════════════════════════════════════════════════════════
// SOCIALS ROW
// ════════════════════════════════════════════════════════════
function SocialsRow({ isDay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', gap: '14px', marginTop: '56px' }}
    >
      {SOCIALS.map((social, i) => (
        <motion.a
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
            padding: '10px 20px',
            borderRadius: isDay ? '50px' : '14px',
            textDecoration: 'none',
            background: isDay ? 'rgba(255,255,255,0.62)' : 'rgba(8,8,28,0.7)',
            border: isDay
              ? '1.5px solid rgba(255,255,255,0.85)'
              : `1.5px solid ${social.color}44`,
            backdropFilter: 'blur(12px)',
            boxShadow: isDay
              ? '0 4px 16px rgba(46,134,193,0.12)'
              : `0 4px 16px rgba(0,0,0,0.4)`,
            transition: 'box-shadow 0.25s',
          }}
        >
          <span style={{ fontSize: '1.1rem',
            color: isDay ? 'rgba(30,80,130,0.9)' : social.color }}>
            <social.Icon />
          </span>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isDay ? 'rgba(30,80,130,0.9)' : 'rgba(200,210,240,0.85)',
          }}>
            {social.name}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Skills({ theme }) {
  const isDay = theme === 'day';

  return (
    <section id="skills" style={{
      width: '100%', padding: '100px 24px 110px',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <p style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(123,104,238,0.8)',
            marginBottom: '10px',
          }}>
            {isDay ? '🪁 My Tech Kite' : '🛸 My Tech Orbit'}
          </p>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', fontWeight: 900,
            color: isDay ? '#ffffff' : '#E8E8F0', letterSpacing: '0.04em',
            textShadow: isDay
              ? '0 2px 24px rgba(46,134,193,0.4)'
              : '0 2px 24px rgba(123,104,238,0.5)',
            marginBottom: '16px',
          }}>Skills & Stack</h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '1rem',
            color: isDay ? 'rgba(255,255,255,0.72)' : 'rgba(200,210,240,0.62)',
            maxWidth: '460px', margin: '0 auto', lineHeight: 1.6,
          }}>
            {isDay
              ? 'The tools flying in my kit — each one battle-tested in real projects.'
              : 'Technologies orbiting my development universe — each one mission-proven.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isDay ? <KiteStringLayout isDay={isDay} /> : <SatelliteOrbitLayout />}
        </motion.div>

        <div style={{
          marginTop: '24px', paddingTop: '40px',
          borderTop: isDay
            ? '1px solid rgba(255,255,255,0.2)'
            : '1px solid rgba(123,104,238,0.15)',
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: '0.72rem',
              fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
              textAlign: 'center',
              color: isDay ? 'rgba(255,255,255,0.55)' : 'rgba(200,210,240,0.45)',
              marginBottom: '4px',
            }}
          >
            {isDay ? '☁ Find me floating at' : '★ Locate me in the cosmos'}
          </motion.p>
          <SocialsRow isDay={isDay} />
        </div>
      </div>
    </section>
  );
}