import React from 'react';
import ToolCard from '../components/ToolCard';

const tools = [
  {
    to: '/tools/code-minifier',
    title: 'ضاغط الأكواد',
    description: 'أداة متقدمة لضغط وتنسيق أكواد CSS و JavaScript و HTML مع خيارات متعددة وتحسين الأداء.',
    tags: ['CSS', 'JavaScript', 'HTML'],
  },
  {
    to: '/tools/image-to-svg',
    title: 'تحويل الصور إلى SVG',
    description: 'حوّل صورك إلى رسوميات SVG احترافية بمستويات ألوان وتفاصيل قابلة للتخصيص.',
    tags: ['SVG', 'تحويل الصور'],
  },
  {
    to: '/tools/thumbnail-generator',
    title: 'مولد الصور المصغرة بالذكاء الاصطناعي',
    description: 'صمّم صورة المقال على لوحة Canvas، وولّد خلفية أو شخصية أو رمزاً عبر Pollinations أو Puter أو مفتاح API، مع اقتراحات للألوان والخطوط والوسوم.',
    tags: ['تصميم الصور', 'ذكاء اصطناعي'],
  },
  {
    to: '/tools/article-generator',
    title: 'مولّد المقالات',
    description: 'أنشئ مقالات عربية، حرّر عناصرها، حسّن SEO، وجهّزها للنشر إلى Blogger.',
    tags: ['كتابة المحتوى', 'SEO', 'Blogger'],
  },
];

function ToolsPage() {
  return (
    <div className="tools-list" aria-label="الأدوات المتاحة">
      {tools.map((tool) => <ToolCard {...tool} key={tool.to} />)}
    </div>
  );
}

export default ToolsPage;
