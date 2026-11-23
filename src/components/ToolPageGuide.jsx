import React from 'react';
import { CalendarDays } from 'lucide-react';
import { toolCatalog, TOOL_AUTHOR } from '../data/toolCatalog';
import ContentQuote from './ContentQuote';
import BidiText from './BidiText';

const dateFormatter = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  calendar: 'gregory',
  timeZone: 'UTC',
});

function formatDate(value) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function ToolPageGuide({ toolId, intro, note, steps, children }) {
  const tool = toolCatalog.find((item) => item.id === toolId);
  if (!tool) return children;

  return (
    <article className="tool-page-guide mw-prose" dir="rtl" lang="ar">
      <header className="tool-page-heading">
        <h1 dir="auto">{tool.title}</h1>
        <p className="tool-page-intro" dir="auto"><BidiText text={intro} /></p>
      </header>

      <div className="tool-page-meta" aria-label="معلومات النشر">
        <a className="tool-page-author" href={TOOL_AUTHOR.profileUrl} target="_blank" rel="noopener noreferrer">
          <img src={TOOL_AUTHOR.avatarUrl} alt="" width="28" height="28" loading="lazy" decoding="async" />
          <span dir="auto">{TOOL_AUTHOR.name}</span>
        </a>
        <span className="tool-page-meta-item" dir="auto"><CalendarDays aria-hidden="true" /> نُشرت في {formatDate(tool.publishedAt)}</span>
      </div>

      {note && <ContentQuote variant="soft" className="tool-page-note"><BidiText text={note} /></ContentQuote>}

      <section className="tool-usage-guide" aria-labelledby={`usage-${toolId}`}>
        <h2 id={`usage-${toolId}`} dir="auto">طريقة الاستخدام</h2>
        <ol className="mw-steps">
          {steps.map((step, index) => <li key={`${toolId}-${index}`} dir="auto"><BidiText text={step} /></li>)}
        </ol>
      </section>

      <div className="tool-page-workspace">{children}</div>
    </article>
  );
}

export default ToolPageGuide;
