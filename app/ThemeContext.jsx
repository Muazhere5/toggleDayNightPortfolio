'use client';






















import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';


const ThemeContext = createContext({
  theme: 'night',
  toggleTheme: () => {},
});

const themeListeners = new Set();

function subscribeTheme(callback) {
  themeListeners.add(callback);
  const onStorage = (e) => {
    if (e.key === 'portfolio-theme') callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    themeListeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

function getThemeSnapshot() {
  try {
    return window.localStorage.getItem('portfolio-theme') === 'day' ? 'day' : 'night';
  } catch {
    return 'night';
  }
}

function getThemeServerSnapshot() {
  return 'night';
}




export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  // Sync DOM root class whenever theme changes (never writes to localStorage on mount)
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('day-mode', 'night-mode');
    html.classList.add(theme === 'day' ? 'day-mode' : 'night-mode');
  }, [theme]);

  // Remove the no-transitions class that the inline script set on page load.
  useEffect(() => {
    const remove = () => document.documentElement.classList.remove('no-transitions');
    let innerTimer = null;

    if (document.readyState === 'loading') {
      const onReady = () => {
        innerTimer = setTimeout(remove, 100);
      };
      document.addEventListener('DOMContentLoaded', onReady, { once: true });
      const fallbackTimer = setTimeout(remove, 300);
      return () => {
        document.removeEventListener('DOMContentLoaded', onReady);
        clearTimeout(fallbackTimer);
        if (innerTimer) clearTimeout(innerTimer);
      };
    } else {
      const timer = setTimeout(remove, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getThemeSnapshot();
    const next = current === 'day' ? 'night' : 'day';
    try {
      window.localStorage.setItem('portfolio-theme', next);
    } catch {
      // Ignore storage errors in restricted environments
    }
    const html = document.documentElement;
    html.classList.remove('day-mode', 'night-mode');
    html.classList.add(next === 'day' ? 'day-mode' : 'night-mode');
    themeListeners.forEach((listener) => listener());
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