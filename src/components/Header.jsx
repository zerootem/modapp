import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    if (theme === 'dark') {
      // قمر
      return (
        <svg viewBox="0 0 24 24" className="theme-toggle-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      );
    }
    // شمس
    return (
      <svg viewBox="0 0 24 24" className="theme-toggle-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    );
  };

  const handleThemeChange = (mode) => {
    setTheme(mode);
    setMenuOpen(false);
  };

  return (
    <header style={{position:'sticky', top:0, zIndex:50, width:'100%'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', padding:'0.5rem 1.25rem', maxWidth:'64rem', margin:'0 auto'}}>
        <a style={{display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, gap:'0.75rem', color:'var(--mw-headC)', textDecoration:'none'}} href="/">
          <div className="logo-box" style={{background:'var(--mw-contentB)', border:'1px solid var(--mw-contentL)', borderRadius:'8px', width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', padding:0, flexShrink:0}}>
            <svg viewBox="0 0 514 514" style={{width:'100%', height:'100%', display:'block', transform:'scale(1.1)'}}>
              <path className="logo-part1" d="M195 167.9c-3.4 1.7-8 7.3-28 33.2l-8.8 11.5 14 18.2 14 18.2 3.8-3.4c6.6-6 14.2-7 21.3-2.8 2.5 1.5 19 22.2 68 85.9 6.5 8.4 13 16 14.5 17.1 6.5 4.5 15.5 5.5 20.2 2.2 2.7-1.9 43-53 43-54.5a301 301 0 0 0-24.2-30.3c-.5.2-5.5 6.4-11.1 13.7-9.5 12.4-13 16.2-14 15L273 247c-58.8-76.2-59.3-76.8-63.1-79a15.7 15.7 0 0 0-15-.1" fill="rgba(225,20,98,0.9)"/>
              <path className="logo-part2" d="M104 180.4c-2 1.3-4.8 4.6-6.3 7.4-5.7 10.6-4.6 20.3 3.7 31C182 322.5 204.4 351 206.1 352c7 3.7 12.7 2.8 18-2.8a948 948 0 0 0 29.2-37c.6-.8-3-6-11.3-16.8L230 280l-4.5 3.2c-8.6 6.1-19.4 4.8-27-3.4-1.7-1.8-19.4-24.3-39.3-50a1327.4 1327.4 0 0 0-39.2-49.2c-4.1-3.5-11-3.6-16-.2" fill="rgba(111,202,220,0.9)"/>
              <path className="logo-part3" d="M312 173.6c-2 1.2-35.7 43.5-42.7 53.4-1 1.5.4 3.8 10.3 16.6l12.4 15.7a87 87 0 0 0 13-15c6.7-8.7 12.8-15.8 13.5-15.8 1.3 0 39 47.6 44.2 56a950 950 0 0 0 35.7 45.4c3 2.4 10.8 2.6 15.2.3 10-5.1 16.2-17.1 13.4-25.6-.6-1.9-9.5-14.3-19.8-27.5L362.5 220a1046 1046 0 0 1-29-38.4c-4.1-6.6-8.5-9.5-14.4-9.5-2.5 0-5.7.8-7.1 1.6" fill="rgba(61,184,143,0.9)"/>
              <path className="logo-part4" d="M106.8 282.6c-24.2 31.2-24.8 32-26.3 36.4a26.2 26.2 0 0 0 4.1 24.5c4.7 6.2 12 8.2 18.3 5a830 830 0 0 0 43.3-54c.6-1.1-21.2-30.7-23.2-31.4a191 191 0 0 0-16.2 19.5m298.8-118c-3 .8-8.8 4.8-12.2 8.4a446.8 446.8 0 0 0-26.1 38c-.3 1.1 4 7.6 11.4 17.3 11 14.7 11.9 15.5 13.3 13.7l14-20a4025 4025 0 0 1 16.2-23.3c8.5-12 7-28.6-2.9-33.3a26 26 0 0 0-13.7-.8" fill="rgba(233,169,32,0.9)"/>
            </svg>
          </div>
          <span style={{fontSize:'1.125rem', lineHeight:'1.75rem', fontWeight:500, color:'var(--mw-headC)'}}>By Modweeb</span>
        </a>

        {/* زر الثيم والقائمة المنسدلة */}
        <div ref={menuRef} style={{position:'relative'}}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="theme-toggle-btn"
            aria-label="تغيير الوضع"
          >
            {getIcon()}
          </button>
          {menuOpen && (
            <div className="theme-menu">
              <button
                className={`theme-menu-item ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span>وضع الضوء</span>
              </button>
              <button
                className={`theme-menu-item ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>وضع النظام</span>
              </button>
              <button
                className={`theme-menu-item ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <span>وضع الليل</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
