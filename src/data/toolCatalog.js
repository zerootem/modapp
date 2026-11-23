export const TOOL_AUTHOR = Object.freeze({
  name: 'Mohammed Al Dhahabi',
  profileUrl: 'https://github.com/zerootem',
  avatarUrl: 'https://avatars.githubusercontent.com/u/223378334?v=4',
});

// Dates reflect the first committed appearance and latest committed update in ModApp's source history.
export const toolCatalog = Object.freeze([
  {
    id: 'code-minifier',
    to: '/tools/code-minifier',
    title: 'ضاغط الأكواد',
    description: 'أداة لضغط وتنسيق أكواد CSS وJavaScript وHTML مع خيارات متعددة وتحسين الأداء.',
    tags: ['CSS', 'JavaScript', 'HTML'],
    publishedAt: '2026-07-06',
    updatedAt: '2026-11-16',
  },
  {
    id: 'image-to-svg',
    to: '/tools/image-to-svg',
    title: 'تحويل الصور إلى SVG',
    description: 'حوّل صورك إلى رسوميات SVG بمستويات ألوان وتفاصيل قابلة للتخصيص.',
    tags: ['SVG', 'تحويل الصور'],
    publishedAt: '2026-07-07',
    updatedAt: '2026-07-07',
  },
  {
    id: 'thumbnail-generator',
    to: '/tools/thumbnail-generator',
    title: 'مولد الصور المصغرة بالذكاء الاصطناعي',
    description: 'صمّم صورة المقال على لوحة Canvas، وولّد خلفية أو شخصية أو رمزاً، مع اقتراحات للألوان والخطوط والوسوم.',
    tags: ['تصميم الصور', 'ذكاء اصطناعي'],
    publishedAt: '2026-11-16',
    updatedAt: '2026-11-19',
  },
  {
    id: 'article-generator',
    to: '/tools/article-generator',
    title: 'مولّد المقالات',
    description: 'أنشئ مقالات عربية، حرّر عناصرها، حسّن SEO، وجهّزها للنشر إلى Blogger.',
    tags: ['كتابة المحتوى', 'SEO', 'Blogger'],
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-22',
  },
]);

export const FEATURED_TOOL_ID = 'thumbnail-generator';

export function getNewestTool(tools = toolCatalog) {
  return [...tools].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0] ?? null;
}

export function getFeaturedTool(tools = toolCatalog) {
  return tools.find((tool) => tool.id === FEATURED_TOOL_ID) ?? null;
}

export function getToolTags(tools = toolCatalog) {
  return [...new Set(tools.flatMap((tool) => tool.tags))].sort((left, right) => left.localeCompare(right, 'ar'));
}

export function filterToolsByTag(tag, tools = toolCatalog) {
  return tag ? tools.filter((tool) => tool.tags.includes(tag)) : [...tools];
}
