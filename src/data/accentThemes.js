export const ACCENT_THEMES = [
  { id: 'blue', label: 'أزرق', swatch: '#3b82f6', light: '#3b82f6', soft: '#eff6ff', dark: '#41a2ef' },
  { id: 'violet', label: 'بنفسجي', swatch: '#7c3aed', light: '#6d28d9', soft: '#f5f3ff', dark: '#c084fc' },
  { id: 'teal', label: 'تركوازي', swatch: '#0f766e', light: '#0f766e', soft: '#f0fdfa', dark: '#2dd4bf' },
  { id: 'emerald', label: 'زمردي', swatch: '#15803d', light: '#15803d', soft: '#f0fdf4', dark: '#4ade80' },
  { id: 'rose', label: 'وردي', swatch: '#be123c', light: '#be123c', soft: '#fff1f2', dark: '#fb7185' },
  { id: 'amber', label: 'عنبر', swatch: '#b45309', light: '#b45309', soft: '#fffbeb', dark: '#fbbf24' },
];

export function getAccentTheme(id) {
  return ACCENT_THEMES.find((option) => option.id === id) || ACCENT_THEMES[0];
}

export function resolveIsDark(mode) {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches === true;
}
