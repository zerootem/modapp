import React from 'react';
import CodeMinifier from '../components/CodeMinifier';
import ToolPageGuide from '../components/ToolPageGuide';

function ToolDetail() {
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
      <CodeMinifier />
    </ToolPageGuide>
  );
}

export default ToolDetail;
