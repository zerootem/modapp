import React, { useEffect, useState } from 'react';

const ARTICLE_GENERATOR_URL = 'https://zerootem.github.io/article-generator-tool/';

function ArticleGeneratorPage() {
  const [expanded, setExpanded] = useState(false);

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
          className="article-embed-frame"
          src={ARTICLE_GENERATOR_URL}
          title="مولّد المقالات العربي"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    </section>
  );
}

export default ArticleGeneratorPage;
