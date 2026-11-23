import React from 'react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: 'sparkles',
    title: 'أدوات عملية',
    text: 'نجمع أدوات ويب تساعد صناع المحتوى والمستخدمين على إنجاز مهام متكررة بواجهة عربية واضحة.',
  },
  {
    icon: 'layers',
    title: 'تجربة موحّدة',
    text: 'تصل إلى الأدوات من مركز واحد، مع الحفاظ على استقلال كل أداة ووظائفها الأساسية.',
  },
  {
    icon: 'shield',
    title: 'وضوح وخصوصية',
    text: 'نوضح متى تُستخدم خدمة خارجية أو يُحفظ إعداد محلياً. لا تضع معلومات سرية في المطالبات أو الملفات.',
  },
];

function ValueIcon({ name }) {
  if (name === 'sparkles') return <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>;
  if (name === 'layers') return <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>;
  return <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>;
}

function AboutPage() {
  return (
    <article className="about-page mw-prose" dir="rtl" lang="ar">
      <section className="about-hero">
        <span className="about-eyebrow" dir="auto">ModApp · مركز الأدوات</span>
        <h1 dir="auto">أدوات رقمية مفيدة، في مكان واحد.</h1>
        <p dir="auto">مركز عربي يجمع أدوات ويب تساعدك على إنشاء المحتوى، إعداد الصور، وتحويل الأكواد والملفات بسهولة.</p>
        <div className="about-actions" aria-label="روابط ذات صلة">
          <Link className="about-cta" to="/tools" dir="auto">
            <span>استكشف الأدوات</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0 6 6m-6-6 6-6"/></svg>
          </Link>
          <Link className="about-secondary-cta" to="/privacy" dir="auto">سياسة الخصوصية</Link>
          <Link className="about-secondary-cta" to="/terms" dir="auto">شروط الاستخدام</Link>
        </div>
      </section>

      <section className="about-values" aria-label="مبادئ المركز">
        {values.map((value) => (
          <div className="about-value-card" key={value.title}>
            <span className="about-value-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><ValueIcon name={value.icon} /></svg></span>
            <h2 dir="auto">{value.title}</h2>
            <p dir="auto">{value.text}</p>
          </div>
        ))}
      </section>

      <section className="about-details">
        <div>
          <h2 dir="auto">ما الذي ستجده هنا؟</h2>
          <p dir="auto">تتضمن المكتبة أدوات لمعالجة الأكواد والصور، ومولّد صور مصغرة، ومولّد مقالات عربي. نطوّر المركز تدريجياً مع التركيز على سهولة الاستخدام والتوافق مع الهاتف.</p>
        </div>
        <div>
          <h2 dir="auto">كيف تعمل الأدوات؟</h2>
          <p dir="auto">تعمل واجهة المركز في المتصفح، وتُفتح الأدوات داخل صفحتها أو في إطار منفصل بحسب طبيعتها. بعض الميزات الاختيارية، مثل توليد الصور أو المحتوى، قد تتصل بمزوّد خارجي عند استخدامها؛ راجع التنبيهات داخل الأداة وشروط المزوّد.</p>
        </div>
      </section>

      <p className="about-note" dir="auto">هذا المركز من تطوير <a href="https://www.modweeb.com" target="_blank" rel="noopener noreferrer">مود ويب</a>. استخدام الأدوات وخدماتها الخارجية يخضع لشروط كل أداة ومزوّد.</p>
    </article>
  );
}

export default AboutPage;
