import React from 'react';
import { CalendarDays, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOOL_AUTHOR } from '../data/toolCatalog';

const dateFormatter = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  calendar: 'gregory',
  timeZone: 'UTC',
});

function formatUpdateDate(value) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`));
}

function ToolCard({ tool, variant = 'default', onSelectTag, selectedTag = null }) {
  const { to, href, title, description, tags = [], updatedAt } = tool;
  const CardLink = href ? 'a' : Link;
  const destination = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { to };

  return (
    <article className={`tool-card tool-card--${variant}`}>
      <CardLink {...destination} className="tool-card-main">
        <div className="tool-card-head">
          <h3 className="tool-card-title">{title}</h3>
          {variant === 'featured' && (
            <span className="tool-card-featured-badge"><Sparkles aria-hidden="true" /> مميز</span>
          )}
          {variant === 'latest' && <span className="tool-card-latest-badge">الأحدث</span>}
        </div>
        <p className="tool-card-desc">{description}</p>
      </CardLink>

      <div className="tool-card-meta">
        <a
          className="tool-card-author"
          href={TOOL_AUTHOR.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`الناشر ${TOOL_AUTHOR.name} على GitHub`}
        >
          <img
            className="tool-card-author-avatar"
            src={TOOL_AUTHOR.avatarUrl}
            alt=""
            width="28"
            height="28"
            loading="lazy"
            decoding="async"
          />
          <span>{TOOL_AUTHOR.name}</span>
        </a>
        <span className="tool-card-meta-separator" aria-hidden="true" />
        <span className="tool-card-date-label">آخر تحديث</span>
        <time className="tool-card-date" dateTime={updatedAt}>
          <CalendarDays aria-hidden="true" />
          {formatUpdateDate(updatedAt)}
        </time>
      </div>

      {tags.length > 0 && (
        <div className="tool-card-tags" aria-label={`تصنيفات ${title}`}>
          {tags.map((tag) => (
            <button
              className="tool-card-tag"
              type="button"
              dir="auto"
              key={tag}
              aria-pressed={selectedTag === tag}
              onClick={() => onSelectTag?.(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

export default ToolCard;
