import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import ToolTagDirectory from '../components/ToolTagDirectory';
import {
  filterToolsByTag,
  getFeaturedTool,
  getNewestTool,
  toolCatalog,
} from '../data/toolCatalog';

function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');
  const featuredTool = getFeaturedTool();
  const latestTool = getNewestTool();
  const filteredTools = filterToolsByTag(selectedTag);
  const remainingTools = toolCatalog.filter(
    (tool) => tool.id !== featuredTool?.id && tool.id !== latestTool?.id,
  );

  const selectTag = (tag) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (tag) nextSearchParams.set('tag', tag);
    else nextSearchParams.delete('tag');
    setSearchParams(nextSearchParams);
  };
  const toggleTag = (tag) => selectTag(selectedTag === tag ? null : tag);

  return (
    <div className="tools-page" dir="rtl">
      {!selectedTag ? (
        <>
          <section className="tools-spotlights" aria-label="الأدوات البارزة وآخر تحديث">
            {featuredTool && (
              <div className="tools-spotlight">
                <h2 dir="auto">أداة مميزة</h2>
                <ToolCard tool={featuredTool} variant="featured" onSelectTag={toggleTag} />
              </div>
            )}
            {latestTool && (
              <div className="tools-spotlight">
                <h2 dir="auto">آخر تحديث</h2>
                <ToolCard tool={latestTool} variant="latest" onSelectTag={toggleTag} />
              </div>
            )}
          </section>

          <hr className="tools-divider" />

          <section className="tools-catalog" aria-label="جميع الأدوات">
            <div className="tools-section-heading">
              <h1 dir="auto">استكشف الأدوات</h1>
              <span>{remainingTools.length} أدوات</span>
            </div>
            <div className="tools-list">
              {remainingTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelectTag={toggleTag} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="tools-results" aria-live="polite">
          <div className="tools-section-heading">
            <h1 dir="auto">أدوات: <bdi dir="auto">{selectedTag}</bdi></h1>
            <span>{filteredTools.length} أدوات</span>
          </div>
          {filteredTools.length > 0 ? (
            <div className="tools-list" aria-label={`الأدوات المصنفة ${selectedTag}`}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onSelectTag={toggleTag} selectedTag={selectedTag} />
              ))}
            </div>
          ) : (
            <p className="tools-empty" dir="auto">لا توجد أدوات بهذا التصنيف حالياً.</p>
          )}
        </section>
      )}

      <div className="tools-page-bottom">
        <ToolTagDirectory selectedTag={selectedTag} onSelectTag={selectTag} />
        <section className="tools-page-intro" aria-label="عن مدونة أدوات مود ويب">
          <h2 dir="auto">مدونة أدوات مود ويب</h2>
          <p dir="auto">مساحة عملية تجمع أدوات الويب لصناعة المحتوى ومعالجة الصور والأكواد، مع شروحات واضحة وتجربة عربية سهلة.</p>
        </section>
      </div>
    </div>
  );
}

export default ToolsPage;
