'use client';

// ============================================================
// components/Projects.jsx — PROJECT SHOWCASE SECTION
//
// CONNECTION MAP:
//   page.jsx    → mounts <Projects theme={theme} /> after Landing
//   globals.css → CSS variables, fonts, glass-card base styles
//   public/assets/projects/project1-preview.gif  etc.
//
// PROPS:
//   theme {string} 'day' | 'night'
//
// DESIGN:
//   Day Vision  → Cards = floating sky platforms, clouds underneath,
//                 soft sky-blue shadows, wind-lift hover
//   Night Vision → Cards = space station windows, cyan/purple glow
//                  borders, depth-push hover into space
//
// CUSTOMISE:
//   Edit the PROJECTS array below to add your real projects.
//   Replace GIF paths with your real files in public/assets/projects/
// ============================================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FaGithub, FaExternalLinkAlt,
} from 'react-icons/fa';
import {
  SiReact, SiNodedotjs, SiMongodb,
  SiExpress, SiNextdotjs, SiTailwindcss,
  SiJavascript, SiHtml5,
} from 'react-icons/si';

// ── TAG ICON MAP ─────────────────────────────────────────────
const TAG_ICONS = {
  'React':      <SiReact />,
  'Next.js':    <SiNextdotjs />,
  'Node.js':    <SiNodedotjs />,
  'MongoDB':    <SiMongodb />,
  'Express':    <SiExpress />,
  'Tailwind':   <SiTailwindcss />,
  'JavaScript': <SiJavascript />,
  'HTML/CSS':   <SiHtml5 />,
};

// ── YOUR PROJECTS — edit this array ─────────────────────────
// Replace with your real project data
const PROJECTS = [
  {
    id: 1,
    title: 'Project One',
    subtitle: 'Full Stack Web App',
    description:
      'A full stack MERN application with user authentication, real-time features and a clean responsive UI. Built to solve a real-world problem.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    gif: '/assets/projects/project1-preview.gif',
    thumb: '/assets/projects/project1-thumb.png',
    liveUrl: 'https://your-live-link.vercel.app',
    githubUrl: 'https://github.com/yourusername/project1',
    featured: true,
  },
  {
    id: 2,
    title: 'Project Two',
    subtitle: 'MERN Stack Application',
    description:
      'A dynamic data-driven web platform with full CRUD operations, JWT authentication and a polished mobile-first interface.',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    gif: '/assets/projects/project2-preview.gif',
    thumb: '/assets/projects/project2-thumb.png',
    liveUrl: 'https://your-live-link.vercel.app',
    githubUrl: 'https://github.com/yourusername/project2',
    featured: false,
  },
  {
    id: 3,
    title: 'Project Three',
    subtitle: 'Next.js Portfolio',
    description:
      'This very portfolio website — built with Next.js App Router, framer-motion animations, and a dual Day/Night sky-space theme system.',
    tags: ['Next.js', 'React', 'Tailwind', 'JavaScript'],
    gif: '/assets/projects/project3-preview.gif',
    thumb: '/assets/projects/project3-thumb.png',
    liveUrl: 'https://your-live-link.vercel.app',
    githubUrl: 'https://github.com/yourusername/portfolio',
    featured: false,
  },
];

// ── SMALL CLOUD under card (Day only) ────────────────────────
const CardCloud = ({ style }) => (
  <svg width="180" height="44" viewBox="0 0 180 44" fill="none" style={style}>
    <ellipse cx="90"  cy="34" rx="82"  ry="16" fill="rgba(255,255,255,0.55)" />
    <ellipse cx="55"  cy="24" rx="42"  ry="22" fill="rgba(255,255,255,0.52)" />
    <ellipse cx="102" cy="20" rx="52"  ry="26" fill="rgba(255,255,255,0.52)" />
    <ellipse cx="148" cy="28" rx="36"  ry="18" fill="rgba(255,255,255,0.45)" />
  </svg>
);

// ── SPACE STATION CORNER DETAILS (Night only) ────────────────
const StationCorner = ({ flip }) => (
  <svg
    width="36" height="36" viewBox="0 0 36 36" fill="none"
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
  >
    <path d="M2 2 L14 2 L14 6 L6 6 L6 14 L2 14 Z"
      fill="rgba(123,104,238,0.45)" />
    <circle cx="3.5" cy="3.5" r="2"
      fill="rgba(123,104,238,0.7)" />
  </svg>
);

// ── FEATURED BADGE ────────────────────────────────────────────
const FeaturedBadge = ({ isDay }) => (
  <div style={{
    position: 'absolute',
    top: '14px',
    left: '14px',
    zIndex: 5,
    padding: '3px 12px',
    borderRadius: '20px',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    background: isDay
      ? 'rgba(255,215,0,0.85)'
      : 'rgba(123,104,238,0.8)',
    color: isDay ? '#333' : '#fff',
    backdropFilter: 'blur(6px)',
  }}>
    ★ Featured
  </div>
);

// ── PROJECT CARD ─────────────────────────────────────────────
function ProjectCard({ project, isDay, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cardStyle = {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'visible',
    background: isDay
      ? 'rgba(255,255,255,0.48)'
      : 'rgba(8,8,24,0.72)',
    border: isDay
      ? '1.5px solid rgba(255,255,255,0.75)'
      : '1.5px solid rgba(123,104,238,0.28)',
    backdropFilter: 'blur(18px)',
    boxShadow: hovered
      ? isDay
        ? '0 28px 64px rgba(46,134,193,0.28), 0 8px 20px rgba(135,206,235,0.2)'
        : '0 28px 64px rgba(0,0,0,0.7), 0 0 40px rgba(123,104,238,0.3)'
      : isDay
        ? '0 10px 32px rgba(46,134,193,0.15), 0 4px 12px rgba(135,206,235,0.15)'
        : '0 10px 32px rgba(0,0,0,0.55), 0 0 16px rgba(123,104,238,0.1)',
    transition: 'box-shadow 0.35s ease',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: isDay ? -14 : -8,
        scale: isDay ? 1.02 : 1.01,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={cardStyle}
    >
      {project.featured && <FeaturedBadge isDay={isDay} />}

      {/* Night: corner station details */}
      {!isDay && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 4, pointerEvents: 'none' }}>
            <StationCorner flip={false} />
          </div>
          <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 4, pointerEvents: 'none' }}>
            <StationCorner flip={true} />
          </div>
        </>
      )}

      {/* Night: animated glow border on hover */}
      {!isDay && hovered && (
        <motion.div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, rgba(123,104,238,0.5), rgba(80,180,255,0.3), rgba(123,104,238,0.5))',
            zIndex: -1,
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* ── GIF / IMAGE PREVIEW ──────────────────────────── */}
      <div style={{
        width: '100%',
        height: '210px',
        borderRadius: '18px 18px 0 0',
        overflow: 'hidden',
        position: 'relative',
        background: isDay
          ? 'rgba(135,206,235,0.2)'
          : 'rgba(5,5,20,0.8)',
      }}>
        <img
          src={imgError ? project.thumb : project.gif}
          alt={`${project.title} preview`}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Overlay gradient on image */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '40%',
          background: isDay
            ? 'linear-gradient(to top, rgba(255,255,255,0.15), transparent)'
            : 'linear-gradient(to top, rgba(8,8,24,0.6), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Night: scan line effect on image */}
        {!isDay && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* ── CARD BODY ────────────────────────────────────── */}
      <div style={{ padding: '20px 22px 22px' }}>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: isDay ? 'rgba(46,134,193,0.9)' : 'rgba(123,104,238,0.85)',
          marginBottom: '5px',
        }}>
          {project.subtitle}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.18rem',
          fontWeight: 700,
          color: isDay ? '#ffffff' : '#E8E8F0',
          marginBottom: '10px',
          letterSpacing: '0.03em',
          textShadow: isDay
            ? '0 2px 12px rgba(46,134,193,0.3)'
            : '0 2px 12px rgba(123,104,238,0.4)',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(200,210,240,0.72)',
          marginBottom: '16px',
        }}>
          {project.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '20px' }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '20px',
              background: isDay
                ? 'rgba(46,134,193,0.12)'
                : 'rgba(123,104,238,0.12)',
              color: isDay ? 'rgba(30,100,160,0.95)' : 'rgba(170,160,255,0.9)',
              border: isDay
                ? '1px solid rgba(46,134,193,0.25)'
                : '1px solid rgba(123,104,238,0.28)',
            }}>
              <span style={{ fontSize: '0.75rem' }}>{TAG_ICONS[tag]}</span>
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons row */}
        <div style={{ display: 'flex', gap: '12px' }}>

          {/* Live Demo */}
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              padding: '10px 0',
              borderRadius: '50px',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: isDay
                ? 'rgba(255,255,255,0.85)'
                : 'rgba(123,104,238,0.18)',
              color: isDay ? '#2E86C1' : '#c8c0ff',
              border: isDay
                ? '1.5px solid rgba(255,255,255,0.9)'
                : '1.5px solid rgba(123,104,238,0.45)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.3s, box-shadow 0.3s',
              boxShadow: hovered
                ? isDay
                  ? '0 4px 16px rgba(46,134,193,0.25)'
                  : '0 4px 16px rgba(123,104,238,0.3)'
                : 'none',
            }}
          >
            <FaExternalLinkAlt size={11} />
            Live Demo
          </motion.a>

          {/* GitHub */}
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              padding: '10px 0',
              borderRadius: '50px',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: 'transparent',
              color: isDay ? 'rgba(255,255,255,0.9)' : 'rgba(200,210,240,0.8)',
              border: isDay
                ? '1.5px solid rgba(255,255,255,0.55)'
                : '1.5px solid rgba(200,210,240,0.2)',
              transition: 'background 0.3s, border 0.3s',
            }}
          >
            <FaGithub size={13} />
            GitHub
          </motion.a>

        </div>
      </div>

      {/* Day: cloud platform underneath card */}
      {isDay && (
        <div style={{
          position: 'absolute',
          bottom: '-22px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: hovered ? 0.9 : 0.65,
          transition: 'opacity 0.3s',
        }}>
          <CardCloud />
        </div>
      )}

    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Projects({ theme }) {
  const isDay = theme === 'day';

  return (
    <section
      id="projects"
      style={{
        width: '100%',
        padding: '100px 24px 120px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

        {/* ── SECTION HEADER ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '70px' }}
        >
          {/* Eyebrow label */}
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(123,104,238,0.8)',
            marginBottom: '10px',
          }}>
            {isDay ? '✈ Things I Built' : '🛸 Missions Completed'}
          </p>

          {/* Title */}
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
            My Projects
          </h2>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{
              height: '1.5px', width: '60px',
              background: isDay
                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6))'
                : 'linear-gradient(90deg, transparent, rgba(123,104,238,0.6))',
            }} />
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(123,104,238,0.8)',
            }} />
            <div style={{
              height: '1.5px', width: '60px',
              background: isDay
                ? 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)'
                : 'linear-gradient(90deg, rgba(123,104,238,0.6), transparent)',
            }} />
          </div>
        </motion.div>

        {/* ── PROJECT CARDS GRID ────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: isDay ? '48px 32px' : '36px 28px',
          alignItems: 'start',
        }}>
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDay={isDay}
              index={index}
            />
          ))}
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: '64px' }}
        >
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.92rem',
            color: isDay ? 'rgba(255,255,255,0.65)' : 'rgba(200,210,240,0.5)',
            marginBottom: '16px',
          }}>
            {isDay ? 'More projects flying in soon ✈' : 'More missions launching soon 🚀'}
          </p>
          <motion.a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 28px',
              borderRadius: '50px',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: isDay ? 'rgba(255,255,255,0.85)' : 'rgba(200,210,240,0.75)',
              border: isDay
                ? '1.5px solid rgba(255,255,255,0.4)'
                : '1.5px solid rgba(200,210,240,0.2)',
              background: 'transparent',
              backdropFilter: 'blur(8px)',
            }}
          >
            <FaGithub size={14} />
            View All on GitHub
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
}
