import React from 'react';
import { Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <span className="footer-copyright" dir="auto">
          <span aria-hidden="true">©</span> 2026 ‧ كل الحقوق محفوظة لـ{' '}
          <span className="footer-credit"><a href="https://www.modweeb.com" target="_blank" rel="noopener noreferrer">مود ويب</a></span> ‧
        </span>
      </div>
      <div className="footer-utilities">
        <nav className="footer-social" aria-label="روابط التواصل">
          <a href="https://github.com/zerootem" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <svg className="social-github" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.16 1.71 1.16 1 .1.78 2.21 4.58 1.56.1-.72.39-1.22.7-1.5-2.47-.28-5.06-1.24-5.06-5.52 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>
          </a>
          <a href="mailto:modweeb3@gmail.com" aria-label="البريد الإلكتروني" title="modweeb3@gmail.com">
            <Mail aria-hidden="true" />
          </a>
        </nav>
        <div className="theme-switcher" role="group" aria-label="اختيار مظهر التطبيق">
        <button
          type="button"
          className={`theme-switch-btn ${theme === 'system' ? 'active' : ''}`}
          onClick={() => setTheme('system')}
          title="وضع النظام"
          aria-label="وضع النظام"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        </button>
        <button
          type="button"
          className={`theme-switch-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
          title="الوضع الفاتح"
          aria-label="الوضع الفاتح"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        </button>
        <button
          type="button"
          className={`theme-switch-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
          title="الوضع الداكن"
          aria-label="الوضع الداكن"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.98 13A9 9 0 0 1 11 3.02 9 9 0 1 0 20.98 13Z"/></svg>
        </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
