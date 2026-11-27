'use client';

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

      <div
        style={{
          position: 'absolute',
          top: '4%', left: '8%',
          width: '120px', height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,80,0.38) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8%', right: '4%',
          width: '100px', height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(135,206,235,0.42) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'glowPulse 5s ease-in-out -1.5s infinite',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          animation: 'avatarBob 4s ease-in-out infinite',
        }}
      >
        <div style={{
          width: '110px', height: '110px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFF9E6 0%, #FFD580 45%, #FF9F00 100%)',
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
            sizes="(max-width: 768px) 100px, 110px"
            preload
            fetchPriority="high"
            className="rounded-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontSize: '1.1rem',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '0.1em',
          textShadow: '0 2px 10px rgba(255,255,255,0.7)',
          margin: 0,
        }}>MUAZ</p>
        <p style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#1e293b',
          margin: '4px 0 0',
        }}>Full Stack Dev</p>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        position: 'relative',
        zIndex: 1,
      }}>
        {['React', 'Node', 'Next'].map((label) => (
          <div
            key={label}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(29,114,180,0.28)',
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#0f172a',
              textTransform: 'uppercase',
            }}
          >{label}</div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          position: 'relative',
          zIndex: 1,
          animation: 'statusPulse 2.5s ease-in-out infinite',
        }}
      >
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#16a34a',
          boxShadow: '0 0 8px #22c55e',
        }} />
        <span style={{
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#0f172a',
        }}>Open to work</span>
      </div>
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

      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          background: 'radial-gradient(circle at 50% 40%, rgba(123,104,238,0.24) 0%, transparent 65%)',
          pointerEvents: 'none',
          animation: 'glowPulse 4s ease-in-out infinite',
        }}
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
          color: 'rgba(160,150,255,0.75)',
          textTransform: 'uppercase',
        }}>muaz.dev</span>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '14px',
          animation: 'avatarBob 4.5s ease-in-out infinite',
        }}
      >
        <div style={{
          width: '100px', height: '100px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(123,104,238,0.6) 0%, rgba(30,10,80,0.9) 100%)',
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
            sizes="(max-width: 768px) 100px, 110px"
            preload
            fetchPriority="high"
            className="rounded-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />

          {[
            { top: '4px', left: '4px', borderTop: '1.5px solid rgba(123,104,238,0.7)', borderLeft: '1.5px solid rgba(123,104,238,0.7)' },
            { top: '4px', right: '4px', borderTop: '1.5px solid rgba(123,104,238,0.7)', borderRight: '1.5px solid rgba(123,104,238,0.7)' },
            { bottom: '4px', left: '4px', borderBottom: '1.5px solid rgba(123,104,238,0.7)', borderLeft: '1.5px solid rgba(123,104,238,0.7)' },
            { bottom: '4px', right: '4px', borderBottom: '1.5px solid rgba(123,104,238,0.7)', borderRight: '1.5px solid rgba(123,104,238,0.7)' },
          ].map((cornerStyle, i) => (
            <div key={i} style={{ position: 'absolute', width: '10px', height: '10px', pointerEvents: 'none', ...cornerStyle }} />
          ))}
        </div>
      </div>

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
          color: 'rgba(160,150,255,0.85)',
          margin: '4px 0 0',
        }}>Full Stack Dev</p>
      </div>

      <div style={{
        display: 'flex', gap: '6px',
        position: 'relative', zIndex: 1,
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'rgba(123,104,238,0.75)',
              animation: `previewDotPulse 1.4s ease-in-out ${i * 0.22}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          position: 'relative', zIndex: 1,
          animation: 'statusPulse 2.2s ease-in-out infinite',
        }}
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
          color: 'rgba(200,210,240,0.65)',
        }}>Signal: Online</span>
      </div>
    </div>
  );
}

export default function ThreeDCharacter({ theme }) {
  const isDay = theme === 'day';
  return isDay ? <DayAvatar /> : <NightAvatar />;
}
