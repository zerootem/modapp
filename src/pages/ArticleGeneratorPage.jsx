import React, { useEffect, useRef, useState } from 'react';

const ARTICLE_GENERATOR_URL = 'https://zerootem.github.io/article-generator-tool/';
const EMBED_OVERRIDE_CSS = `
  #darkModeToggle, [data-theme-menu] { display: none !important; }
  #preloader, .pldW, .mwbp-fab, .mwbp { display: none !important; visibility: hidden !important; pointer-events: none !important; }
`;

function ArticleGeneratorPage() {
  const frameRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  const applyEmbedOverrides = () => {
    const frame = frameRef.current;
    try {
      const frameDocument = frame?.contentDocument;
      if (frameDocument?.head) {
        let style = frameDocument.getElementById('modapp-article-embed-overrides');
        if (!style) {
          style = frameDocument.createElement('style');
          style.id = 'modapp-article-embed-overrides';
          frameDocument.head.appendChild(style);
        }
        style.textContent = EMBED_OVERRIDE_CSS;

        const loader = frameDocument.getElementById('preloader');
        if (loader) {
          loader.classList.remove('e');
          loader.classList.add('h');
          loader.setAttribute('aria-hidden', 'true');
        }
        frame?.contentWindow?.__hideArticleBoot?.();
      }
    } catch {
      // Keep the embed usable if a future deployment changes its same-origin policy.
    }
    setFrameReady(true);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('mw-article-expanded', expanded);
    document.body.classList.toggle('mw-article-expanded', expanded);
    return () => {
      document.documentElement.classList.remove('mw-article-expanded');
      document.body.classList.remove('mw-article-expanded');
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  return (
    <section className={`article-embed-page${expanded ? ' article-embed-page-expanded' : ''}`} aria-label="مولّد المقالات">
      <div className="article-embed-toolbar">
        <span>تعمل الأداة داخل إطار مستقل؛ لن يتغير تخطيطها الأصلي.</span>
        <button
          type="button"
          className="article-embed-expand"
          onClick={() => setExpanded((value) => !value)}
          aria-label={expanded ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
          title={expanded ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'}
          aria-pressed={expanded}
        >
          {expanded ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/></svg>
          )}
        </button>
      </div>
      <div className="article-embed-frame-wrap">
        <iframe
          ref={frameRef}
          className={`article-embed-frame${frameReady ? ' is-ready' : ''}`}
          src={ARTICLE_GENERATOR_URL}
          title="مولّد المقالات العربي"
          onLoad={applyEmbedOverrides}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    </section>
  );
}

export default ArticleGeneratorPage;
