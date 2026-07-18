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

  
  
  
  
  
  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
    }, 150);
    return () => clearTimeout(timer);
  }, []); 

  
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