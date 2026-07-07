import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('mw-theme') || 'system');

  const applyTheme = useCallback((mode) => {
    const root = document.documentElement;
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.style.setProperty('--mw-bodyB', '#1a1a1a');
      root.style.setProperty('--mw-bodyC', '#e5e5e5');
      root.style.setProperty('--mw-contentB', '#2d2d2d');
      root.style.setProperty('--mw-contentL', '#404040');
      root.style.setProperty('--mw-headC', '#ffffff');
      root.style.setProperty('--mw-white', '#ffffff');
      root.style.setProperty('--mw-notifB', '#1f2937');
      root.style.setProperty('--mw-notifC', '#e5e5e5');
      root.style.setProperty('--mw-contentBa', '#3a3a4a');
      // ألوان مسار التنقل في الوضع الداكن (فاتحة للقراءة)
      root.style.setProperty('--mw-breadcrumb', '#b0b7c3');
      root.style.setProperty('--mw-breadcrumb-active', '#e0e0e0');
      root.style.setProperty('--mw-breadcrumb-sep', '#8a8f98');
    } else {
      root.style.setProperty('--mw-bodyB', '#f9fafb');
      root.style.setProperty('--mw-bodyC', '#1f2937');
      root.style.setProperty('--mw-contentB', '#ffffff');
      root.style.setProperty('--mw-contentL', '#e5e7eb');
      root.style.setProperty('--mw-headC', '#111827');
      root.style.setProperty('--mw-white', '#ffffff');
      root.style.setProperty('--mw-notifB', '#f9fafb');
      root.style.setProperty('--mw-notifC', '#6b7280');
      root.style.setProperty('--mw-contentBa', '#f4f8ff');
      // ألوان مسار التنقل في الوضع الفاتح
      root.style.setProperty('--mw-breadcrumb', '#6b7280');
      root.style.setProperty('--mw-breadcrumb-active', '#4b5563');
      root.style.setProperty('--mw-breadcrumb-sep', '#9ca3af');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mw-theme', theme);
    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
