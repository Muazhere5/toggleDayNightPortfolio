'use client';

import { useEffect, useState } from 'react';
import { FaHome, FaCode, FaRocket, FaBolt, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '@/app/ThemeContext';
import { useLenis } from '@/app/LenisProvider';

const NAV_ITEMS = [
  { id: 'landing',  label: 'Home',     Icon: FaHome   },
  { id: 'skills',   label: 'Skills',   Icon: FaCode   },
  { id: 'projects', label: 'Projects', Icon: FaRocket },
  { id: 'testme',   label: 'Test Me',  Icon: FaBolt   },
];

export default function MobileNavDock({ onIntent }) {
  const { theme, toggleTheme } = useTheme();
  const lenis = useLenis();
  const isDay = theme === 'day';
  const [activeId, setActiveId] = useState('landing');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: 0.01 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleJump = (id) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleThemeSwitch = () => {
    if (onIntent) onIntent();
    toggleTheme();
  };

  return (
    <>
      <style>{`
        .mobile-nav-dock {
          display: none;
        }
        @media (max-width: 767px) {
          .mobile-nav-dock {
            display: flex;
          }
        }
      `}</style>
      <nav
        aria-label="Mobile quick navigation"
        className="mobile-nav-dock"
        style={{
          position: 'fixed',
          bottom: 'max(12px, env(safe-area-inset-bottom))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          alignItems: 'center',
          gap: '4px',
          padding: '6px 8px',
          borderRadius: '999px',
          background: isDay ? 'rgba(255, 255, 255, 0.88)' : 'rgba(10, 12, 30, 0.88)',
          border: isDay ? '1px solid rgba(29, 114, 180, 0.28)' : '1px solid rgba(123, 104, 238, 0.4)',
          boxShadow: isDay
            ? '0 10px 30px rgba(29, 114, 180, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08)'
            : '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(123, 104, 238, 0.25)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          maxWidth: 'calc(100vw - 24px)',
        }}
      >
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleJump(id)}
              aria-label={`Jump to ${label}`}
              aria-current={isActive ? 'location' : undefined}
              style={{
                minWidth: '48px',
                minHeight: '44px',
                padding: '4px 10px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: isActive
                  ? isDay ? 'rgba(29, 114, 180, 0.14)' : 'rgba(123, 104, 238, 0.26)'
                  : 'transparent',
                color: isActive
                  ? isDay ? '#1d72b4' : '#e2dcff'
                  : isDay ? '#334155' : 'rgba(200, 210, 240, 0.72)',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
            >
              <Icon size={15} />
              <span style={{
                fontFamily: "var(--font-rajdhani), sans-serif",
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1,
                color: 'inherit',
              }}>
                {label}
              </span>
            </button>
          );
        })}

        <div
          aria-hidden="true"
          style={{
            width: '1px',
            height: '24px',
            margin: '0 2px',
            background: isDay ? 'rgba(29, 114, 180, 0.2)' : 'rgba(123, 104, 238, 0.3)',
          }}
        />

        <button
          type="button"
          onClick={handleThemeSwitch}
          aria-label={`Switch to ${isDay ? 'Night' : 'Day'} Vision`}
          style={{
            minWidth: '48px',
            minHeight: '44px',
            padding: '4px 10px',
            borderRadius: '999px',
            border: isDay ? '1px solid rgba(255, 180, 0, 0.45)' : '1px solid rgba(123, 104, 238, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            background: isDay
              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(135, 206, 235, 0.25))'
              : 'linear-gradient(135deg, rgba(123, 104, 238, 0.28), rgba(30, 27, 75, 0.6))',
            color: isDay ? '#b45309' : '#e0e7ff',
          }}
        >
          {isDay ? <FaMoon size={14} /> : <FaSun size={14} color="#FFD700" />}
          <span style={{
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontSize: '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: 'inherit',
          }}>
            {isDay ? 'Night' : 'Day'}
          </span>
        </button>
      </nav>
    </>
  );
}
