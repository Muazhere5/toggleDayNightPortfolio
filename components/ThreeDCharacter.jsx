'use client';






















import { motion } from 'framer-motion';
import Image from 'next/image';



function DayAvatar() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      padding: '28px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      <motion.div
        style={{
          position: 'absolute',
          top: '10%', left: '15%',
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,80,0.35), transparent 70%)',
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%', right: '10%',
          width: '60px', height: '60px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(135,206,235,0.4), transparent 70%)',
          filter: 'blur(14px)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div style={{
          width: '110px', height: '110px',
          borderRadius: '50%',
          background: 'radial-gradient(135deg at 35% 35%, #FFF9E6 0%, #FFD580 45%, #FF9F00 100%)',
          border: '3px solid rgba(255,255,255,0.85)',
          boxShadow: '0 0 0 6px rgba(255,215,0,0.18), 0 8px 32px rgba(255,160,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Image 
            src="/assets/character/muazdp.png" 
            alt="Abdullah Al Muaz" 
            width={110} 
            height={110} 
            priority
            className="rounded-full object-cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
      </motion.div>

      
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontSize: '1.1rem',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '0.1em',
          textShadow: '0 2px 12px rgba(46,134,193,0.5)',
          margin: 0,
        }}>MUAZ</p>
        <p style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.75)',
          margin: '4px 0 0',
        }}>Full Stack Dev</p>
      </div>

      
      <div style={{
        display: 'flex',
        gap: '8px',
        position: 'relative',
        zIndex: 1,
      }}>
        {['React', 'Node', 'Next'].map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.55)',
              backdropFilter: 'blur(6px)',
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
            }}
          >{label}</motion.div>
        ))}
      </div>

      
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          position: 'relative',
          zIndex: 1,
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 8px #4ade80',
        }} />
        <span style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)',
        }}>Open to work</span>
      </motion.div>
    </div>
  );
}



function NightAvatar() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '28px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20px',
          background: 'radial-gradient(circle at 50% 40%, rgba(123,104,238,0.2) 0%, transparent 65%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(123,104,238,0.04) 3px, rgba(123,104,238,0.04) 4px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '28px',
        background: 'rgba(123,104,238,0.12)',
        borderBottom: '1px solid rgba(123,104,238,0.25)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: '6px',
        zIndex: 1,
      }}>
        {['rgba(255,80,80,0.7)', 'rgba(255,200,0,0.7)', 'rgba(80,200,80,0.7)'].map((c, i) => (
          <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: c }} />
        ))}
        <span style={{
          marginLeft: 'auto',
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.55rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: 'rgba(123,104,238,0.6)',
          textTransform: 'uppercase',
        }}>muaz.dev</span>
      </div>

      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', zIndex: 1, marginTop: '14px' }}
      >
        <div style={{
          width: '100px', height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(135deg at 35% 35%, rgba(123,104,238,0.6) 0%, rgba(30,10,80,0.9) 100%)',
          border: '2px solid rgba(123,104,238,0.6)',
          boxShadow: '0 0 0 5px rgba(123,104,238,0.1), 0 0 30px rgba(123,104,238,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Image 
            src="/assets/character/muazdp.png" 
            alt="Abdullah Al Muaz" 
            width={100} 
            height={100} 
            priority
            className="rounded-full object-cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />

          
          {[['top:4px','left:4px'],['top:4px','right:4px'],['bottom:4px','left:4px'],['bottom:4px','right:4px']].map((pos, i) => {
            const [v, h] = pos;
            const vKey = v.split(':')[0];
            const hKey = h.split(':')[0];
            return (
              <div key={i} style={{
                position: 'absolute',
                [vKey]: '4px',
                [hKey]: '4px',
                width: '10px', height: '10px',
                borderTop: vKey === 'top' ? '1.5px solid rgba(123,104,238,0.7)' : 'none',
                borderBottom: vKey === 'bottom' ? '1.5px solid rgba(123,104,238,0.7)' : 'none',
                borderLeft: hKey === 'left' ? '1.5px solid rgba(123,104,238,0.7)' : 'none',
                borderRight: hKey === 'right' ? '1.5px solid rgba(123,104,238,0.7)' : 'none',
                pointerEvents: 'none',
              }} />
            );
          })}
        </div>
      </motion.div>

      
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontSize: '1.05rem',
          fontWeight: 900,
          color: '#E8E8F0',
          letterSpacing: '0.12em',
          textShadow: '0 0 20px rgba(123,104,238,0.6)',
          margin: 0,
        }}>MUAZ</p>
        <p style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(123,104,238,0.75)',
          margin: '4px 0 0',
        }}>Full Stack Dev</p>
      </div>

      
      <div style={{
        display: 'flex', gap: '6px',
        position: 'relative', zIndex: 1,
      }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'rgba(123,104,238,0.7)',
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
          />
        ))}
      </div>

      
      <motion.div
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          position: 'relative', zIndex: 1,
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 8px #4ade80',
        }} />
        <span style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.58rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(200,210,240,0.55)',
        }}>Signal: Online</span>
      </motion.div>
    </div>
  );
}




export default function ThreeDCharacter({ theme }) {
  const isDay = theme === 'day';
  return isDay ? <DayAvatar /> : <NightAvatar />;
}