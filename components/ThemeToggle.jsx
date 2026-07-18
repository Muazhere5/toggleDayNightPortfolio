'use client';

























import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/app/ThemeContext';

const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1={11 + 7.5 * Math.cos((angle * Math.PI) / 180)}
        y1={11 + 7.5 * Math.sin((angle * Math.PI) / 180)}
        x2={11 + 10 * Math.cos((angle * Math.PI) / 180)}
        y2={11 + 10 * Math.sin((angle * Math.PI) / 180)}
        stroke="rgba(255,220,50,0.95)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ))}
    
    <circle cx="11" cy="11" r="5.5" fill="#FFD700" />
    <circle cx="11" cy="11" r="3.8" fill="#FFEC6E" />
  </svg>
);


const MoonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    
    <path
      d="M15.5 11.5 C15.5 15.09 12.59 18 9 18 C5.41 18 2.5 15.09 2.5 11.5 C2.5 7.91 5.41 5 9 5 C6.5 6.5 5 8.8 5 11.5 C5 14.2 6.5 16.5 9 18 C12.59 18 15.5 15.09 15.5 11.5Z"
      fill="rgba(200,210,240,0.95)"
    />
    
    <circle cx="16" cy="6"  r="1.2" fill="rgba(200,210,240,0.8)" />
    <circle cx="19" cy="10" r="0.8" fill="rgba(200,210,240,0.6)" />
    <circle cx="14" cy="4"  r="0.7" fill="rgba(200,210,240,0.5)" />
  </svg>
);


const particles = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: (i / 8) * 360,
}));

const Burst = ({ isDay }) => (
  <AnimatePresence>
    {particles.map(({ id, angle }) => {
      const rad = (angle * Math.PI) / 180;
      const tx  = Math.cos(rad) * 28;
      const ty  = Math.sin(rad) * 28;
      return (
        <motion.div
          key={id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: isDay ? '#FFD700' : '#a0a8e0',
            marginTop: -2,
            marginLeft: -2,
            pointerEvents: 'none',
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: tx, y: ty, scale: 0 }}
          exit={{}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      );
    })}
  </AnimatePresence>
);




export default function ThemeToggle() {

  const { theme, toggleTheme } = useTheme();

  const isDay  = theme === 'day';
  const [bursting, setBursting] = useState(false);
  
  
  const [showNudge, setShowNudge] = useState(false);
  const [hasCalibratedTheme, setHasCalibratedTheme] = useState(true); 

  useEffect(() => {
    
    const calibrated = localStorage.getItem('hasCalibratedTheme') === 'true';
    setHasCalibratedTheme(calibrated);
    
    if (calibrated) return;

    const handleScroll = () => {
      
      if (window.scrollY > 300) {
        setShowNudge(true);
      } else {
        setShowNudge(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  const handleToggle = () => {
    
    if (!hasCalibratedTheme || showNudge) {
      setShowNudge(false);
      setHasCalibratedTheme(true);
      localStorage.setItem('hasCalibratedTheme', 'true');
    }

    setBursting(false);
    
    setTimeout(() => {
      setBursting(true);
      toggleTheme();
      
      setTimeout(() => setBursting(false), 600);
    }, 10);
  };

  return (
    
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end', 
        gap: '6px',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      
      <motion.div
        key={theme}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isDay ? 'rgba(255,255,255,0.9)' : 'rgba(200,210,240,0.85)',
          textShadow: isDay
            ? '0 1px 8px rgba(46,134,193,0.6)'
            : '0 1px 8px rgba(123,104,238,0.6)',
        }}
      >
        {isDay ? '☀ Day Vision' : '🌙 Night Vision'}
      </motion.div>

      
      <motion.button
        onClick={handleToggle}
        aria-label={`Switch to ${isDay ? 'Night' : 'Day'} Vision`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'relative',
          width: '82px',
          height: '40px',
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          overflow: 'visible',
          outline: 'none',
          
          background: isDay
            ? 'linear-gradient(90deg, #FFD700 0%, #87CEEB 50%, #b8e4f7 100%)'
            : 'linear-gradient(90deg, #050510 0%, #1a1a3e 50%, #7B68EE 100%)',
          
          boxShadow: isDay
            ? '0 0 0 2px rgba(255,215,0,0.35), 0 4px 20px rgba(255,215,0,0.25), 0 2px 8px rgba(135,206,235,0.3)'
            : '0 0 0 2px rgba(123,104,238,0.4), 0 4px 20px rgba(123,104,238,0.3), 0 2px 8px rgba(0,0,0,0.5)',
          transition: 'background 0.8s ease, box-shadow 0.6s ease',
        }}
      >
        
        <AnimatePresence>
          {showNudge && (
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 0.8, 0], scale: [1, 1.4, 1.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '999px',
                border: isDay ? '2px solid #FF8C00' : '2px solid #00FFFF',
                boxShadow: isDay ? '0 0 15px #FF8C00' : '0 0 15px #00FFFF',
                pointerEvents: 'none',
                zIndex: -1,
              }}
            />
          )}
        </AnimatePresence>

        
        <div style={{
          position: 'absolute',
          inset: '2px',
          borderRadius: '999px',
          border: isDay
            ? '1px solid rgba(255,255,255,0.45)'
            : '1px solid rgba(123,104,238,0.3)',
          pointerEvents: 'none',
        }} />

        
        <span style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.5rem',
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: isDay ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.4s',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          DAY
        </span>

        
        <span style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.5rem',
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: isDay ? 'rgba(255,255,255,0.3)' : 'rgba(200,210,240,0.9)',
          transition: 'color 0.4s',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          NGT
        </span>

        
        <motion.div
          layout
          animate={{ x: isDay ? 2 : 42 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.8 }}
          style={{
            position: 'absolute',
            top: '3px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
            background: isDay
              ? 'radial-gradient(circle at 40% 35%, #FFEC6E, #FFB800)'
              : 'radial-gradient(circle at 40% 35%, #dde4f5, #9aa8d0)',
            
            boxShadow: isDay
              ? '0 0 0 2px rgba(255,255,255,0.5), 0 2px 12px rgba(255,200,0,0.7), 0 0 24px rgba(255,215,0,0.4)'
              : '0 0 0 2px rgba(255,255,255,0.2), 0 2px 12px rgba(150,160,200,0.6), 0 0 20px rgba(123,104,238,0.35)',
            transition: 'background 0.6s ease, box-shadow 0.6s ease',
            zIndex: 2,
          }}
        >
          
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {isDay ? <SunIcon /> : <MoonIcon />}
            </motion.div>
          </AnimatePresence>

          
          {bursting && <Burst isDay={isDay} />}
        </motion.div>

        
        <AnimatePresence>
          {bursting && (
            <motion.div
              key="ripple"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '999px',
                border: `2px solid ${isDay ? 'rgba(255,215,0,0.6)' : 'rgba(123,104,238,0.6)'}`,
                pointerEvents: 'none',
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

      </motion.button>

      
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0.7 }}
        style={{
          fontFamily: "var(--font-nunito), sans-serif",
          fontSize: '0.58rem',
          color: isDay ? 'rgba(255,255,255,0.6)' : 'rgba(180,190,220,0.5)',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        {isDay ? 'switch to space →' : '← switch to sky'}
      </motion.div>
      </div>

      
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              width: 'max-content',
              maxWidth: 'calc(100vw - 40px)', 
              padding: '10px 14px',
              borderRadius: '12px',
              background: isDay ? 'rgba(255, 245, 230, 0.75)' : 'rgba(10, 15, 30, 0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: isDay ? '1px solid rgba(255, 140, 0, 0.3)' : '1px solid rgba(0, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              color: isDay ? '#b35900' : '#80ffff',
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              lineHeight: 1.4,
              textAlign: 'right',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {isDay 
              ? "⚠️ High solar radiation. Calibrate environment →" 
              : "⚠️ Critical temperature drop. Ignite sequence →"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
