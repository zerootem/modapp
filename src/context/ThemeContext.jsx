import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'mw-theme-v2';

function notifyTheme(mode) {
  const root = document.documentElement;
  window.dispatchEvent(new CustomEvent('mw-theme-change', { detail: { mode, tokens: {
    bodyB: getComputedStyle(root).getPropertyValue('--mw-bodyB').trim(),
    bodyC: getComputedStyle(root).getPropertyValue('--mw-bodyC').trim(),
    contentB: getComputedStyle(root).getPropertyValue('--mw-contentB').trim(),
    contentBa: getComputedStyle(root).getPropertyValue('--mw-contentBa').trim(),
    contentL: getComputedStyle(root).getPropertyValue('--mw-contentL').trim(),
    headC: getComputedStyle(root).getPropertyValue('--mw-headC').trim(),
    notifB: getComputedStyle(root).getPropertyValue('--mw-notifB').trim(),
    notifC: getComputedStyle(root).getPropertyValue('--mw-notifC').trim(),
    linkC: getComputedStyle(root).getPropertyValue('--mw-linkC').trim(),
    white: getComputedStyle(root).getPropertyValue('--mw-white').trim()
  } } }));
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'system');

  const applyTheme = useCallback((mode) => {
    const root = document.documentElement;
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const themeColor = isDark ? '#1a1a1a' : '#f9fafb';
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', themeColor);

    if (isDark) {
      root.style.setProperty('--mw-bodyB', '#1a1a1a');
      root.style.setProperty('--mw-bodyC', '#e5e5e5');
      root.style.setProperty('--mw-contentB', '#2d2d2d');
      root.style.setProperty('--mw-contentL', '#404040');
      root.style.setProperty('--mw-headC', '#ffffff');
      root.style.setProperty('--mw-white', '#ffffff');
      root.style.setProperty('--mw-notifB', '#2d2d2d');
      root.style.setProperty('--mw-notifC', '#e5e5e5');
      root.style.setProperty('--mw-contentBa', '#3a3a4a');
      root.style.setProperty('--mw-linkC', '#3b82f6');
      root.style.colorScheme = 'dark';
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
      root.style.setProperty('--mw-linkC', '#3b82f6');
      root.style.colorScheme = 'light';
      // ألوان مسار التنقل في الوضع الفاتح
      root.style.setProperty('--mw-breadcrumb', '#6b7280');
      root.style.setProperty('--mw-breadcrumb-active', '#4b5563');
      root.style.setProperty('--mw-breadcrumb-sep', '#9ca3af');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
    notifyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => { applyTheme('system'); notifyTheme('system'); };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
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
