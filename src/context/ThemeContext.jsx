import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ACCENT_THEMES } from '../data/accentThemes';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'mw-theme-v2';
const ACCENT_STORAGE_KEY = 'mw-accent-v1';
const THEME_KEYS = [
  'iconC','iconCa','iconCs','headC','bodyC','bodyCa','bodyB','linkC','linkB','headerC','headerB','headerHc',
  'notifB','notifC','contentB','contentBs','contentBa','contentL','contentLa','fotB','fotC','transB','statusC',
  'selectC','selectB','scrollT','scrollB','scrollBh','scrollBa','scrollH','scrollV','scrollR','aInvert','svgW','svgH','svgC'
];
const MODE_TOKENS = {
  light: {
    iconC:'var(--lIconC)',iconCa:'var(--lIconCa)',iconCs:'var(--lIconCs)',headC:'var(--lHeadC)',bodyC:'var(--lBodyC)',bodyCa:'var(--lBodyCa)',bodyB:'var(--lBodyB)',
    linkC:'var(--lLinkC)',linkB:'var(--lLinkB)',headerC:'var(--lHeaderC)',headerB:'var(--lHeaderB)',headerHc:'var(--headerH)',
    notifB:'var(--lNotifB)',notifC:'var(--lNotifC)',contentB:'var(--lContentB)',contentBs:'#f1f1f0',contentBa:'#f6f6f6',contentL:'var(--lContentL)',contentLa:'#b5b5b4',
    fotB:'var(--lBodyB)',fotC:'var(--lBodyC)',transB:'rgba(0,0,0,.05)',statusC:'var(--lStatusC)',selectC:'#ffffff',selectB:'var(--lLinkB)',
    scrollT:'rgba(0,0,0,.05)',scrollB:'rgba(0,0,0,.15)',scrollBh:'rgba(0,0,0,.25)',scrollBa:'rgba(0,0,0,.25)',scrollH:'8px',scrollV:'var(--scrollH)',scrollR:'2px',aInvert:'0',svgW:'22px',svgH:'22px',svgC:'currentColor'
  },
  dark: {
    iconC:'var(--darkT)',iconCa:'#94a3b8',iconCs:'var(--darkL)',headC:'var(--darkT)',bodyC:'var(--darkT)',bodyCa:'var(--darkT)',bodyB:'var(--darkB)',
    linkC:'var(--darkL)',linkB:'var(--darkL)',headerC:'var(--darkT)',headerB:'var(--darkB)',headerHc:'var(--headerH)',
    notifB:'var(--darkBa)',notifC:'rgba(255,255,255,.9)',contentB:'#252526',contentBs:'#303031',contentBa:'#252526',contentL:'#444444',contentLa:'#696969',
    fotB:'var(--darkB)',fotC:'var(--darkT)',transB:'rgba(255,255,255,.05)',statusC:'var(--lStatusC)',selectC:'#ffffff',selectB:'var(--darkL)',
    scrollT:'rgba(255,255,255,.05)',scrollB:'rgba(255,255,255,.15)',scrollBh:'rgba(255,255,255,.25)',scrollBa:'rgba(255,255,255,.25)',scrollH:'8px',scrollV:'var(--scrollH)',scrollR:'2px',aInvert:'1',svgW:'22px',svgH:'22px',svgC:'currentColor'
  }
};
function notifyTheme(mode, accent) {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const tokens = Object.fromEntries(THEME_KEYS.map((key) => [key, style.getPropertyValue(`--mw-${key}`).trim()]));
  window.dispatchEvent(new CustomEvent('mw-theme-change', { detail: { mode, accent, tokens } }));
}
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || 'system');
  const [accentTheme, setAccentThemeState] = useState(() => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    return ACCENT_THEMES.some((option) => option.id === stored) ? stored : 'blue';
  });
  const setAccentTheme = useCallback((nextAccent) => {
    if (ACCENT_THEMES.some((option) => option.id === nextAccent)) setAccentThemeState(nextAccent);
  }, []);
  const applyTheme = useCallback((mode) => {
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const root = document.documentElement;
    const selected = MODE_TOKENS[isDark ? 'dark' : 'light'];
    Object.entries(selected).forEach(([key,value]) => root.style.setProperty(`--mw-${key}`, value));
    root.style.colorScheme = isDark ? 'dark' : 'light';
    const themeColor = getComputedStyle(root).getPropertyValue('--mw-bodyB').trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', themeColor);
    root.style.setProperty('--mw-breadcrumb', isDark ? '#b0b7c3' : 'var(--lBodyCa)');
    root.style.setProperty('--mw-breadcrumb-active', isDark ? 'var(--darkT)' : 'var(--lHeadC)');
    root.style.setProperty('--mw-breadcrumb-sep', isDark ? '#9aa0aa' : 'var(--lBodyCa)');
  }, []);
  useEffect(() => {
    document.documentElement.dataset.accentTheme = accentTheme;
    localStorage.setItem(ACCENT_STORAGE_KEY, accentTheme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
    notifyTheme(theme, accentTheme);
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => { applyTheme('system'); notifyTheme('system', accentTheme); };
    if (media.addEventListener) { media.addEventListener('change', update); return () => media.removeEventListener('change', update); }
    media.addListener(update); return () => media.removeListener(update);
  }, [theme, accentTheme, applyTheme]);
  return <ThemeContext.Provider value={{ theme, setTheme, accentTheme, setAccentTheme }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
