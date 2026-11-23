import React from 'react';
import ImageToSvg from '../components/ImageToSvg';
import ToolPageGuide from '../components/ToolPageGuide';

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
      <ImageToSvg />
    </ToolPageGuide>
  );
}

export default ImageToSvgPage;
