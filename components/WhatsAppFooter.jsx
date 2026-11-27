'use client';

import { m } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFooter({ theme }) {
  const isDay = theme === 'day';

  return (
    <>
      <style>{`
        .whatsapp-footer {
          width: 100%;
          padding: 40px 24px;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 10;
        }
        .whatsapp-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 42px;
          max-width: 100%;
        }
        .whatsapp-label {
          font-size: 0.95rem;
        }
        @media (max-width: 767px) {
          .whatsapp-footer {
            padding: 28px 16px 96px;
          }
          .whatsapp-pill {
            padding: 12px 20px;
            gap: 10px;
            min-height: 48px;
          }
          .whatsapp-label {
            font-size: 0.78rem;
          }
        }
      `}</style>
      <footer className="whatsapp-footer">
        <m.a
          href="https://wa.me/8801890431258"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-pill"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            boxShadow: isDay 
              ? '0 15px 35px rgba(37, 211, 102, 0.3), 0 0 20px rgba(37, 211, 102, 0.2)'
              : '0 15px 35px rgba(37, 211, 102, 0.3), 0 0 30px rgba(37, 211, 102, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: '50px',
            background: isDay ? 'rgba(255,255,255,0.85)' : 'rgba(12,12,30,0.8)',
            border: isDay ? '2px solid rgba(37, 211, 102, 0.5)' : '2px solid rgba(37, 211, 102, 0.4)',
            boxShadow: isDay 
              ? '0 10px 25px rgba(37, 211, 102, 0.15), 0 0 15px rgba(255,255,255,0.9)'
              : '0 10px 25px rgba(37, 211, 102, 0.15), 0 0 20px rgba(37, 211, 102, 0.1)',
            backdropFilter: 'blur(12px)',
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(37, 211, 102, 0.2) 50%, transparent 100%)',
              animation: 'ctaShimmer 4s linear infinite',
              pointerEvents: 'none',
            }}
          />
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            flexShrink: 0,
            borderRadius: '50%',
            background: '#25D366',
            position: 'relative',
            boxShadow: '0 0 15px rgba(37, 211, 102, 0.5)',
          }}>
            <FaWhatsapp size={22} color="#ffffff" />
          </div>
          
          <span
            className="whatsapp-label"
            style={{
              fontFamily: "var(--font-orbitron), sans-serif",
              fontWeight: 700,
              color: isDay ? '#111827' : '#E8E8F0',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              position: 'relative',
            }}
          >
            Knock me on WhatsApp directly
          </span>
        </m.a>
      </footer>
    </>
  );
}
