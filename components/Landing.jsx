'use client';













import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLenis } from '@/app/LenisProvider';

import ThreeDCharacter from './ThreeDCharacter';


const TECH_TAGS = ['React', 'Next.js', 'MongoDB', 'Node.js', 'Express', 'Firebase', 'Vercel', 'Supabase'];


function useTypingEffect(text, startDelay = 700, speed = 85) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  useEffect(() => {
    let timer = null;
    let start = null;

    const timeoutId = setTimeout(() => {
      setDisplayed('');
      setDone(false);

      let i = 0;
      start = setTimeout(() => {
        timer = setInterval(() => {
          i++;
          setDisplayed(text.slice(0, i));
          if (i >= text.length) {
            clearInterval(timer);
            setDone(true);
          }
        }, speed);
      }, startDelay);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (start) clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [text, startDelay, speed]);

  return { displayed, done };
}


const MiniCloud = ({ style }) => (
  <svg width="72" height="30" viewBox="0 0 72 30" fill="none" style={style}>
    <ellipse cx="36" cy="22" rx="32" ry="12" fill="rgba(255,255,255,0.72)" />
    <ellipse cx="22" cy="16" rx="16" ry="12" fill="rgba(255,255,255,0.72)" />
    <ellipse cx="40" cy="13" rx="20" ry="14" fill="rgba(255,255,255,0.72)" />
    <ellipse cx="58" cy="18" rx="14" ry="10" fill="rgba(255,255,255,0.65)" />
  </svg>
);


const OrbitStar = ({ radius, duration, delay, size = 4 }) => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: size,
      height: size,
      marginTop: -size / 2,
      marginLeft: -size / 2,
      pointerEvents: 'none',
      '--orbit-r': `${radius}px`,
      animation: `orbitStarSpin ${duration}s linear ${-delay}s infinite`,
    }}
  >
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.9)',
      boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.6)`,
    }} />
  </div>
);


const ScrollIndicator = ({ isDay }) => (
  <m.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.4, duration: 0.6 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      marginTop: '48px',
    }}
  >
    <span style={{
      fontFamily: "var(--font-rajdhani), sans-serif",
      fontSize: '0.68rem',
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: isDay ? '#0f172a' : 'rgba(200,210,240,0.75)',
    }}>
      {isDay ? 'Explore Below' : 'Begin Mission'}
    </span>

    <div style={{ animation: 'scrollBounce 1.4s ease-in-out infinite' }}>
      {isDay ? (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2 L20 11 L11 8 L2 11 Z" fill="#0f172a" />
          <path d="M11 8 L11 20" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 16 L11 20 L15 16" stroke="#0f172a" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2 Q16 6 16 13 L11 16 L6 13 Q6 6 11 2Z" fill="rgba(200,210,240,0.85)" />
          <circle cx="11" cy="9" r="2.5" fill="rgba(100,180,255,0.7)" />
          <path d="M8 14 L6 18 L8 17Z" fill="rgba(160,160,190,0.75)" />
          <path d="M14 14 L16 18 L14 17Z" fill="rgba(160,160,190,0.75)" />
          <ellipse cx="11" cy="17" rx="2.5" ry="3.5" fill="rgba(255,140,0,0.7)" />
        </svg>
      )}
    </div>
  </m.div>
);


const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial:    { opacity: 0, x: -32 },
  animate:    { opacity: 1, x: 0   },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const scaleIn = (delay = 0) => ({
  initial:    { opacity: 0, scale: 0.82 },
  animate:    { opacity: 1, scale: 1    },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});




export default function Landing({ theme }) {
  const isDay = theme === 'day';
  const lenis = useLenis();

  const { displayed: typedName, done: typingDone } = useTypingEffect(
    'Abdullah Al Muaz', 150, 75
  );

  const handleExplore = () => {
    const el = document.getElementById('projects');
    if (lenis && el) {
      lenis.scrollTo(el);
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  
  const sectionStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px 40px',
    position: 'relative',
    zIndex: 1,
  };

  const innerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '64px',
    width: '100%',
    maxWidth: '1000px',
    flexWrap: 'wrap',
  };

  
  
  
  const bubbleWrapStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '320px',
    height: '380px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  
  const canvasContainerStyle = {
    width: '100%',
    maxWidth: '300px',
    height: '360px',
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    background: isDay
      ? 'radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.28) 0%, rgba(135,206,235,0.18) 50%, rgba(135,206,235,0.08) 100%)'
      : 'radial-gradient(ellipse at 40% 30%, rgba(30,20,60,0.55) 0%, rgba(10,10,30,0.45) 50%, rgba(5,5,20,0.3) 100%)',
    border: isDay
      ? '3px solid rgba(255,255,255,0.7)'
      : '3px solid rgba(123,104,238,0.5)',
    boxShadow: isDay
      ? '0 0 0 8px rgba(255,255,255,0.10), 0 16px 60px rgba(46,134,193,0.28), 0 0 100px rgba(135,206,235,0.18)'
      : '0 0 0 8px rgba(123,104,238,0.07), 0 16px 60px rgba(0,0,0,0.7), 0 0 80px rgba(123,104,238,0.22)',
    backdropFilter: 'blur(4px)',
    transition: 'border 0.8s ease, box-shadow 0.8s ease',
  };

  const cursorStyle = {
    display: 'inline-block',
    width: '3px',
    height: '0.85em',
    background: isDay ? '#1e293b' : '#a898ff',
    marginLeft: '4px',
    verticalAlign: 'middle',
    borderRadius: '2px',
    animation: typingDone ? 'none' : 'blink 0.75s step-end infinite',
  };

  const textBlockStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '14px',
    maxWidth: '420px',
  };

  const tagStyle = {
    fontFamily: "var(--font-rajdhani), sans-serif",
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: '20px',
    background: isDay
      ? 'rgba(255,255,255,0.78)'
      : 'rgba(123,104,238,0.15)',
    color: isDay ? '#0f172a' : 'rgba(180,170,255,0.95)',
    border: isDay
      ? '1px solid rgba(29,114,180,0.28)'
      : '1px solid rgba(123,104,238,0.35)',
    boxShadow: isDay ? '0 2px 8px rgba(29,114,180,0.1)' : 'none',
    backdropFilter: 'blur(6px)',
  };

  const buttonStyle = {
    fontFamily: "var(--font-orbitron), sans-serif",
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '14px 36px',
    borderRadius: '50px',
    border: isDay
      ? '2px solid rgba(29,114,180,0.45)'
      : '2px solid rgba(123,104,238,0.6)',
    background: isDay
      ? 'rgba(255,255,255,0.82)'
      : 'rgba(123,104,238,0.12)',
    color: isDay ? '#0f172a' : '#c8c0ff',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    minHeight: '44px',
    marginTop: '8px',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <>
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (max-width: 700px) {
          .landing-inner {
            flex-direction: column !important;
            gap: 36px !important;
            text-align: center;
          }
          .landing-text {
            align-items: center !important;
          }
          .landing-ctas {
            justify-content: center !important;
          }
        }
        @media (max-width: 420px) {
          .orbit-star-ring {
            transform: scale(0.8);
          }
        }
      `}</style>

      <section id="landing" style={sectionStyle}>
        <div style={innerStyle} className="landing-inner">

          
          <m.div
            style={textBlockStyle}
            className="landing-text"
            {...fadeLeft(0.1)}
          >
            
            <m.p style={{
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: isDay ? '#0f172a' : 'rgba(200,210,240,0.85)',
              textShadow: isDay ? '0 1px 10px rgba(255,255,255,0.6)' : 'none',
            }} {...fadeLeft(0.2)}>
              {isDay ? '✈ Welcome to my sky' : '🛸 Incoming transmission'}
            </m.p>

            
            <m.div {...fadeLeft(0.3)}>
              <span style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                fontWeight: 700,
                color: isDay ? '#0f172a' : 'rgba(200,210,240,0.9)',
                textShadow: isDay ? '0 1px 10px rgba(255,255,255,0.6)' : 'none',
              }}>
                Hey there! I&apos;m 👋
              </span>
            </m.div>

            
            <m.h1 style={{
              position: 'relative',
              fontFamily: "var(--font-orbitron), sans-serif",
              fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              minHeight: '2.1em',
              color: isDay ? '#0f172a' : '#E8E8F0',
              textShadow: isDay
                ? '0 2px 18px rgba(255,255,255,0.65), 0 4px 24px rgba(29,114,180,0.25)'
                : '0 2px 20px rgba(123,104,238,0.6), 0 0 40px rgba(123,104,238,0.2)',
              letterSpacing: '0.04em',
            }} {...fadeLeft(0.35)}>
              <span aria-hidden="true" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                Abdullah Al Muaz
              </span>
              <span
                aria-label="Abdullah Al Muaz"
                style={{ position: 'absolute', inset: 0 }}
              >
                {typedName}
                <span style={cursorStyle} />
              </span>
            </m.h1>

            
            <m.p style={{
              fontFamily: "var(--font-nunito), sans-serif",
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              fontWeight: 700,
              color: isDay ? '#1e293b' : 'rgba(200,210,240,0.82)',
              textShadow: isDay ? '0 1px 12px rgba(255,255,255,0.75)' : 'none',
              lineHeight: 1.55,
              maxWidth: '360px',
            }} {...fadeUp(0.6)}>
              {isDay
                ? 'By day: I architect clarity clean components, scalable systems, interfaces that feel like light.'
                : 'By night: I chase the edge cases the world forgets debugging in the dark until the code holds.'}
            </m.p>

            
            <m.div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px',
            }} {...fadeUp(0.8)}>
              {TECH_TAGS.map((tag, i) => (
                <m.span
                  key={tag}
                  style={tagStyle}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.06, duration: 0.35, ease: 'easeOut' }}
                  whileHover={{ scale: 1.08, y: -2 }}
                >
                  {tag}
                </m.span>
              ))}
            </m.div>

            
            <m.div className="landing-ctas" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} {...fadeUp(1.1)}>
              
              <m.button
                style={buttonStyle}
                onClick={handleExplore}
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDay
                    ? '0 0 30px rgba(255,255,255,0.4), 0 8px 24px rgba(46,134,193,0.3)'
                    : '0 0 30px rgba(123,104,238,0.5), 0 8px 24px rgba(0,0,0,0.4)',
                  background: isDay
                    ? 'rgba(255,255,255,0.92)'
                    : 'rgba(123,104,238,0.22)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)',
                    borderRadius: '50px',
                    animation: 'ctaShimmer 4s linear infinite',
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ fontSize: '1.1rem', position: 'relative' }}>
                  {isDay ? '✈' : '🚀'}
                </span>
                <span style={{ position: 'relative' }}>
                  {isDay ? 'Explore My Work' : 'Begin Mission'}
                </span>
              </m.button>

              
              <m.a
                href="mailto:muazctg07@gmail.com"
                style={{ ...buttonStyle, textDecoration: 'none' }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDay
                    ? '0 0 30px rgba(255,255,255,0.4), 0 8px 24px rgba(46,134,193,0.3)'
                    : '0 0 30px rgba(123,104,238,0.5), 0 8px 24px rgba(0,0,0,0.4)',
                  background: isDay
                    ? 'rgba(255,255,255,0.92)'
                    : 'rgba(123,104,238,0.22)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)',
                    borderRadius: '50px',
                    animation: 'ctaShimmer 4s linear 0.6s infinite',
                    pointerEvents: 'none',
                  }}
                />
                <span style={{ fontSize: '1.1rem', position: 'relative' }}>
                  ✉️
                </span>
                <span style={{ position: 'relative' }}>
                  Direct Mail
                </span>
              </m.a>
            </m.div>
          </m.div>

          
          <m.div style={bubbleWrapStyle} {...scaleIn(0.15)}>

            
            {isDay && (
              <>
                <div
                  style={{
                    position: 'absolute', top: '-18px', left: '-10px', zIndex: 2,
                    pointerEvents: 'none', animation: 'miniCloudFloat 4s ease-in-out infinite',
                  }}
                >
                  <MiniCloud style={{ opacity: 0.9 }} />
                </div>
                <div
                  style={{
                    position: 'absolute', bottom: '-10px', right: '-12px', zIndex: 2,
                    pointerEvents: 'none', animation: 'miniCloudFloat 5s ease-in-out -1.5s infinite',
                  }}
                >
                  <MiniCloud style={{ opacity: 0.75, transform: 'scaleX(-1)' }} />
                </div>

                
                <div
                  style={{
                    position: 'absolute',
                    inset: '-16px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,220,80,0.14) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                    animation: 'glowPulse 4s ease-in-out infinite',
                  }}
                />
              </>
            )}

            
            {!isDay && (
              <div className="orbit-star-ring" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
                <OrbitStar radius={152} duration={8}  delay={0}   size={5} />
                <OrbitStar radius={162} duration={12} delay={2}   size={3.5} />
                <OrbitStar radius={145} duration={6}  delay={1}   size={4} />
                <OrbitStar radius={170} duration={15} delay={3.5} size={2.5} />
              </div>
            )}

            
            {!isDay && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-30px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(123,104,238,0.22) 0%, transparent 70%)',
                  zIndex: 0,
                  pointerEvents: 'none',
                  animation: 'glowPulse 4s ease-in-out infinite',
                }}
              />
            )}

            
            <div style={canvasContainerStyle} className="char-canvas-wrap">
              <ThreeDCharacter theme={theme} />
            </div>

            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '300px',
              height: '360px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.18)',
              pointerEvents: 'none',
              zIndex: 3,
            }} />

          </m.div>
          

        </div>

        
        <ScrollIndicator isDay={isDay} />

      </section>
    </>
  );
}