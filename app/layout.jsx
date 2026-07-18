






















import { ThemeProvider } from './ThemeContext';
import LenisProvider     from './LenisProvider';
import './globals.css';
import { Orbitron, Rajdhani, Nunito } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});


export const metadata = {
  title: 'YOU TECH BD — Portfolio',
  description: 'Full Stack Developer Portfolio — Sky & Space Edition by Muaz',
  keywords: [
    'Full Stack Developer',
    'MERN Stack',
    'Next.js',
    'React',
    'MongoDB',
    'Portfolio',
  ],
  authors: [{ name: 'Muaz' }],
  openGraph: {
    title: 'YOU TECH BD — Portfolio',
    description: 'Sky & Space themed developer portfolio by Muaz',
    type: 'website',
  },
};


export default function RootLayout({ children }) {
  return (
    
    
    <html lang="en" suppressHydrationWarning className={`${orbitron.variable} ${rajdhani.variable} ${nunito.variable}`}>
      <head>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = window.localStorage.getItem('portfolio-theme');
                  var theme = saved === 'night' ? 'night' : 'day';
                  var html  = document.documentElement;
                  html.classList.add(theme + '-mode');
                  html.classList.add('no-transitions');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body id="app-root">
        
        <ThemeProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}