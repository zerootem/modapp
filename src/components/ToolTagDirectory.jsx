import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getToolTags } from '../data/toolCatalog';

function ToolTagDirectory({ selectedTag = null, onSelectTag }) {
  const location = useLocation();
  const tags = getToolTags();

  if (!onSelectTag && location.pathname === '/tools') return null;

  return (
    <section className={`tool-tag-directory${onSelectTag ? ' tool-tag-directory--interactive' : ''}`} aria-labelledby="tool-tag-directory-title">
      <header className="tool-tag-directory-heading">
        <h2 id="tool-tag-directory-title" dir="auto">تصفّح حسب التصنيف</h2>
        <p dir="auto">اختر تصنيفاً لعرض الأدوات المرتبطة به.</p>
      </header>
      <nav className="tool-tag-directory-list" aria-label="تصنيفات الأدوات">
        {onSelectTag && (
          <button className={`tool-filter-chip${selectedTag === null ? ' is-active' : ''}`} type="button" aria-pressed={selectedTag === null} onClick={() => onSelectTag(null)}>
            <bdi dir="auto">كل الأدوات</bdi>
          </button>
        )}
        {tags.map((tag) => (
          onSelectTag ? (
            <button key={tag} className={`tool-filter-chip${selectedTag === tag ? ' is-active' : ''}`} type="button" dir="auto" aria-pressed={selectedTag === tag} onClick={() => onSelectTag(tag)}><bdi dir="auto">{tag}</bdi></button>
          ) : (
            <Link key={tag} className="tool-filter-chip" dir="auto" to={{ pathname: '/tools', search: `?tag=${encodeURIComponent(tag)}` }}><bdi dir="auto">{tag}</bdi></Link>
          )
        ))}
      </nav>
    </section>
  );
}

export default ToolTagDirectory;
