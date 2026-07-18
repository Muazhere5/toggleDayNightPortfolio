'use client';

















import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

import { useTheme } from './ThemeContext';

import ThemeToggle   from '@/components/ThemeToggle';
import Landing       from '@/components/Landing';
import WhatsAppFooter from '@/components/WhatsAppFooter';
import EmailObject   from '@/components/EmailObject';
import Skills        from '@/components/Skills';
import Projects      from '@/components/Projects';
import Achievements  from '@/components/Achievements';
import TestMe        from '@/components/TestMe';




const DayBackground = dynamic(
  () => import('./DayVision/page'),
  { ssr: false, loading: () => null }
);

const NightBackground = dynamic(
  () => import('./NightVision/page'),
  { ssr: false, loading: () => null }
);


export default function HomePage() {
  const { theme } = useTheme();

  return (
    <main className="relative overflow-x-hidden">

      
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <AnimatePresence mode="sync">
          {theme === 'day' ? (
            <motion.div
              key="day-bg"
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <DayBackground />
            </motion.div>
          ) : (
            <motion.div
              key="night-bg"
              style={{ position: 'absolute', inset: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <NightBackground />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
      <ThemeToggle />

      
      <div className="relative z-10">
        <Landing      theme={theme} />
        <Skills       theme={theme} />
        <Projects     theme={theme} />
        <Achievements theme={theme} />
        <TestMe       theme={theme} />
        <WhatsAppFooter theme={theme} />
      </div>

      
      <EmailObject    theme={theme} />

    </main>
  );
}