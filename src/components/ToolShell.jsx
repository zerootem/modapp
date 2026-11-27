import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const NoticeContext = createContext(() => {});

export function useToolNotice() {
  return useContext(NoticeContext);
}

const EYE_ICON = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
const EYE_OFF_ICON = '<path d="M3 3l18 18M10.6 5.1A11.7 11.7 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.1 0 2.1-.2 3-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>';
const EXPAND_ICON = '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/>';
const COLLAPSE_ICON = '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>';

function Icon({ paths }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g dangerouslySetInnerHTML={{ __html: paths }} />
    </svg>
  );
}

/**
 * Shared tool frame: title bar, top notification bar (article-generator style),
 * preview toggle and fullscreen toggle. Fullscreen hides the site header,
 * breadcrumb and footer and expands the tool card to the whole viewport.
 */
function ToolShell({ title, subtitle, icon, children, previewLabel = 'لوحة النتيجة', defaultPreview = true, preview: controlledPreview, onPreviewChange, className = '' }) {
  const [expanded, setExpanded] = useState(false);
  const [previewState, setPreviewState] = useState(defaultPreview);
  const preview = controlledPreview ?? previewState;
  const [notice, setNotice] = useState({ message: '', type: 'success', open: false });
  const timer = useRef(null);

  const notify = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setNotice({ message, type, open: true });
    timer.current = setTimeout(() => setNotice((prev) => ({ ...prev, open: false })), 2600);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    const cls = 'mw-tool-expanded';
    document.body.classList.toggle(cls, expanded);
    document.documentElement.classList.toggle(cls, expanded);
    return () => {
      document.body.classList.remove(cls);
      document.documentElement.classList.remove(cls);
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const togglePreview = () => {
    const next = !preview;
    if (onPreviewChange) onPreviewChange(next);
    else setPreviewState(next);
    notify(next ? `تم إظهار ${previewLabel}` : `تم إخفاء ${previewLabel}`);
  };

  return (
    <div className={`tool-shell ${expanded ? 'is-expanded' : ''} ${preview ? '' : 'preview-hidden'} ${className}`.trim()} dir="rtl">
      <div className={`tool-shell-notice ${notice.open ? 'show' : ''} ${notice.type}`} role="status" aria-live="polite">
        {notice.message}
      </div>

      <div className="tool-shell-header">
        <div className="tool-shell-title">
          {icon && <span className="tool-shell-title-icon" aria-hidden="true">{icon}</span>}
          <span className="tool-shell-title-text">
            <bdi>{title}</bdi>
            {subtitle && <small><bdi>{subtitle}</bdi></small>}
          </span>
        </div>
        <div className="tool-shell-actions">
          <button
            type="button"
            className="tool-shell-btn icon-only"
            onClick={togglePreview}
            aria-pressed={preview}
            aria-label={preview ? `إخفاء ${previewLabel}` : `إظهار ${previewLabel}`}
            title={preview ? `إخفاء ${previewLabel}` : `إظهار ${previewLabel}`}
          >
            <Icon paths={preview ? EYE_ICON : EYE_OFF_ICON} />
          </button>
          <button
            type="button"
            className="tool-shell-btn icon-only primary"
            onClick={() => setExpanded((prev) => !prev)}
            aria-pressed={expanded}
            aria-label={expanded ? 'تصغير بطاقة الأداة' : 'تكبير بطاقة الأداة'}
            title={expanded ? 'تصغير بطاقة الأداة' : 'تكبير بطاقة الأداة'}
          >
            <Icon paths={expanded ? COLLAPSE_ICON : EXPAND_ICON} />
          </button>
        </div>
      </div>

      <NoticeContext.Provider value={notify}>
        <div className="tool-shell-body">{children}</div>
      </NoticeContext.Provider>
    </div>
  );
}

export default ToolShell;
