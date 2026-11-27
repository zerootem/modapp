import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterToolsByTag,
  getFeaturedTool,
  getNewestTool,
  getToolTags,
  toolCatalog,
} from './toolCatalog.js';

test('selects the most recently updated tool from its recorded source date', () => {
  assert.equal(getNewestTool()?.id, 'faq-generator');
});

test('returns the explicitly featured tool without changing the catalog', () => {
  assert.equal(getFeaturedTool()?.id, 'thumbnail-generator');
  assert.equal(toolCatalog.length, 6);
});

test('filters by an exact, case-sensitive label and returns all tools for no filter', () => {
  assert.deepEqual(filterToolsByTag('SEO').map((tool) => tool.id), ['article-generator', 'faq-generator', 'robots-generator']);
  assert.deepEqual(filterToolsByTag('JavaScript').map((tool) => tool.id), ['code-minifier']);
  assert.equal(filterToolsByTag(null).length, toolCatalog.length);
  assert.deepEqual(filterToolsByTag('غير موجود'), []);
});

test('deduplicates labels for the filter chips', () => {
  const tags = getToolTags();
  assert.equal(tags.length, new Set(tags).size);
  assert.ok(tags.includes('ذكاء اصطناعي'));
});

test('every tool has valid published and updated dates in chronological order', () => {
  for (const tool of toolCatalog) {
    assert.match(tool.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(tool.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(tool.publishedAt <= tool.updatedAt, `${tool.id} publication date follows its update`);
  }
});
