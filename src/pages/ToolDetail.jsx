import React, { useState } from 'react';
import CodeMinifier from '../components/CodeMinifier';
import ToolPageGuide from '../components/ToolPageGuide';
import ToolShell from '../components/ToolShell';

function ToolDetail() {
  const [preview, setPreview] = useState(false);
  return (
    <ToolPageGuide
      toolId="code-minifier"
      intro="اضغط أكواد JavaScript وCSS وHTML أو نسّقها لتصبح أوضح وأسهل في النقل والاستخدام، مباشرة من واجهة المتصفح."
      note="راجع النتيجة قبل اعتمادها، واحتفظ بنسخة من الكود الأصلي خصوصاً عند ضغط ملفات الإنتاج."
      steps={[
        'اختر نوع الكود: JavaScript أو CSS أو HTML.',
        'ألصق الكود في المحرر أو اسحب ملفاً مناسباً إلى منطقة التحرير.',
        'اضغط زر التصغير، أو استخدم خيارات التنسيق والمقارنة المتاحة.',
        'راجع الإحصاءات والنتيجة، ثم انسخ الكود أو نزّله عند الحاجة.',
      ]}
    >
      <ToolShell
        title="ضاغط الأكواد"
        subtitle="JavaScript · CSS · HTML"
        previewLabel="نتيجة الضغط"
        preview={preview}
        onPreviewChange={setPreview}
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6M14 4l-4 16" /></svg>}
      >
        <CodeMinifier previewVisible={preview} />
      </ToolShell>
    </ToolPageGuide>
  );
}

export default ToolDetail;
