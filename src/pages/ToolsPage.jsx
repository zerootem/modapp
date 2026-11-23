import React, { useMemo, useState } from 'react';
import ToolCard from '../components/ToolCard';
import {
  filterToolsByTag,
  getFeaturedTool,
  getNewestTool,
  getToolTags,
  toolCatalog,
} from '../data/toolCatalog';

function ToolsPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const tags = useMemo(() => getToolTags(), []);
  const featuredTool = getFeaturedTool();
  const latestTool = getNewestTool();
  const filteredTools = filterToolsByTag(selectedTag);
  const remainingTools = toolCatalog.filter(
    (tool) => tool.id !== featuredTool?.id && tool.id !== latestTool?.id,
  );

  const toggleTag = (tag) => setSelectedTag((current) => (current === tag ? null : tag));

  return (
    <div className="tools-page">
      <div className="tools-page-intro">
        <h1>مركز أدوات ModWeeb</h1>
        <p>أدوات عملية لصناعة المحتوى ومعالجة الصور والأكواد، في مكان واحد.</p>
      </div>

      <nav className="tool-filters" aria-label="تصفية الأدوات حسب التصنيف">
        <button
          className={`tool-filter-chip${selectedTag === null ? ' is-active' : ''}`}
          type="button"
          aria-pressed={selectedTag === null}
          onClick={() => setSelectedTag(null)}
        >
          كل الأدوات
        </button>
        {tags.map((tag) => (
          <button
            className={`tool-filter-chip${selectedTag === tag ? ' is-active' : ''}`}
            type="button"
            dir="auto"
            key={tag}
            aria-pressed={selectedTag === tag}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </nav>

      {selectedTag ? (
        <section className="tools-results" aria-live="polite">
          <div className="tools-section-heading">
            <h2>أدوات: {selectedTag}</h2>
            <span>{filteredTools.length} أدوات</span>
          </div>
          {filteredTools.length > 0 ? (
            <div className="tools-list" aria-label={`الأدوات المصنفة ${selectedTag}`}>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onSelectTag={toggleTag}
                  selectedTag={selectedTag}
                />
              ))}
            </div>
          ) : (
            <p className="tools-empty">لا توجد أدوات بهذا التصنيف حالياً.</p>
          )}
        </section>
      ) : (
        <>
          <section className="tools-spotlights" aria-label="أدوات بارزة وآخر تحديث">
            {featuredTool && (
              <div className="tools-spotlight">
                <h2>أداة مميزة</h2>
                <ToolCard tool={featuredTool} variant="featured" onSelectTag={toggleTag} />
              </div>
            )}
            {latestTool && (
              <div className="tools-spotlight">
                <h2>آخر تحديث</h2>
                <ToolCard tool={latestTool} variant="latest" onSelectTag={toggleTag} />
              </div>
            )}
          </section>

          <section className="tools-catalog" aria-label="جميع الأدوات">
            <div className="tools-section-heading">
              <h2>استكشف الأدوات</h2>
              <span>{remainingTools.length} أدوات</span>
            </div>
            <div className="tools-list">
              {remainingTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelectTag={toggleTag} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default ToolsPage;
