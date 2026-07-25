'use client';






















import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';


const ThemeContext = createContext({
  theme: 'day',
  toggleTheme: () => {},
});




export function ThemeProvider({ children }) {
  
  
  
  const [theme, setTheme] = useState('day');

  
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('portfolio-theme');
      if (saved === 'day' || saved === 'night') {
        
        setTheme(saved);
      }
    } catch {
      
    }
  }, []); 

  
  
  
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('day-mode', 'night-mode');
    html.classList.add(theme === 'day' ? 'day-mode' : 'night-mode');

    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      
    }
  }, [theme]);

  
  
  
  
  
  // Remove the no-transitions class that the inline script set on page load.
  // A 200ms timeout covers the hydration gap; the readyState guard ensures
  // it fires even if the component mounts before DOMContentLoaded completes.
  useEffect(() => {
    const remove = () => document.documentElement.classList.remove('no-transitions');

    if (document.readyState === 'loading') {
      // Document still loading — wait for it, then remove with a small buffer
      const onReady = () => { setTimeout(remove, 100); };
      document.addEventListener('DOMContentLoaded', onReady, { once: true });
      // Belt-and-suspenders: also set a fallback timer
      const timer = setTimeout(remove, 300);
      return () => {
        document.removeEventListener('DOMContentLoaded', onReady);
        clearTimeout(timer);
      };
    } else {
      // Document already interactive or complete
      const timer = setTimeout(remove, 150);
      return () => clearTimeout(timer);
    }
  }, []); // runs once on mount

  
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  }, []);

  
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}




export function useTheme() {
  return useContext(ThemeContext);
}