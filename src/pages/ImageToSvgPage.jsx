import React from 'react';
import ImageToSvg from '../components/ImageToSvg';
import ToolPageGuide from '../components/ToolPageGuide';
import ToolShell from '../components/ToolShell';

function ImageToSvgPage() {
  return (
    <ToolPageGuide
      toolId="image-to-svg"
      intro="حوّل صورة نقطية إلى رسم SVG قابل للتوسّع، واضبط عدد الألوان ومستوى التفاصيل ثم عاين النتيجة قبل تنزيلها."
      note="تُجرى عملية التحويل داخل المتصفح؛ وقد تُحمّل المكتبة اللازمة من شبكة توصيل المحتوى عند أول استخدام."
      steps={[
        'اختر صورة من جهازك لعرض معاينة الأصل.',
        'اضبط عدد الألوان ومستوى التفاصيل بما يناسب الصورة.',
        'ابدأ التحويل ثم افحص معاينة SVG والكود الناتج.',
        'انسخ كود SVG أو نزّل الملف بعد التأكد من النتيجة.',
      ]}
    >
      <ToolShell
        title="تحويل الصور إلى SVG"
        subtitle="صورة أصلية · رسم متجهي"
        previewLabel="معاينة الصورة والرسم"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>}
      >
        <ImageToSvg />
      </ToolShell>
    </ToolPageGuide>
  );
}

export default ImageToSvgPage;
