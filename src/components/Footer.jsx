import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <span className="footer-copyright">© 2026 جميع الحقوق محفوظة.</span>
        <span className="footer-credit">
          صنع بـ <span aria-label="قلب أبيض">🤍</span> بواسطة{' '}
          <a href="https://www.modweeb.com" target="_blank" rel="noopener noreferrer">مود ويب!</a>
        </span>
      </div>
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
    </footer>
  );
}

export default Footer;
