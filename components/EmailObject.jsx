'use client';

import { motion } from 'framer-motion';

const PaperAirplane = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

export default function EmailObject({ theme }) {
  const isDay = theme === 'day';

  return (
    <motion.a
      href="mailto:muazctg07@gmail.com"
      style={{
        position: 'fixed',
        zIndex: 50,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
      }}
      initial={{ x: '115vw', y: '75vh' }}
      animate={{ 
        x: ['115vw', '-15vw'],
        y: ['75vh', '65vh', '80vh', '70vh']
      }}
      transition={{ 
        x: { duration: 25, repeat: Infinity, ease: 'linear', repeatDelay: 18 },
        y: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
      }}
      whileHover={{ scale: 1.15 }}
    >
      <motion.div 
        style={{
          fontSize: '3rem',
          color: isDay ? '#1E64A0' : '#c8c0ff',
          filter: isDay 
            ? 'drop-shadow(0 6px 10px rgba(46,134,193,0.3))' 
            : 'drop-shadow(0 0 20px rgba(123,104,238,0.7))',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        animate={{ 
          rotate: isDay ? [-15, -5, -15] : [0, 0] // Paper airplane bobs slightly
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        {isDay ? (
          <div style={{ transform: 'rotate(-45deg)' /* Point forward left */ }}>
            <PaperAirplane />
          </div>
        ) : (
          <div style={{ transform: 'scaleX(-1)' /* Flip star to point left */ }}>
            🌠
          </div>
        )}
      </motion.div>
      <div style={{
        marginTop: '2px',
        whiteSpace: 'nowrap',
        fontFamily: "var(--font-rajdhani), sans-serif",
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        padding: '3px 10px',
        borderRadius: '12px',
        background: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(8,8,24,0.7)',
        color: isDay ? '#1E64A0' : '#c8c0ff',
        border: isDay ? '1px solid rgba(46,134,193,0.2)' : '1px solid rgba(123,104,238,0.4)',
        backdropFilter: 'blur(4px)',
      }}>
        Direct Mail
      </div>
    </motion.a>
  );
}
