import React, { useMemo, useRef, useState } from 'react';
import ToolPageGuide from '../components/ToolPageGuide';
import ToolShell, { useToolNotice } from '../components/ToolShell';

const STYLES = [
  { id: 'ac', label: 'أكورديون' },
  { id: 'ac-alt', label: 'أكورديون بديل' },
  { id: 'sp', label: 'مطوي (spoiler)' },
  { id: 'cards', label: 'بطاقات مفتوحة' },
  { id: 'plain', label: 'قائمة بسيطة' },
];

const uid = () => `faq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMarkup({ items, style, heading, includeHeading }) {
  const valid = items.filter((item) => item.question.trim() && item.answer.trim());
  if (!valid.length) return '';
  const blocks = valid.map((item) => {
    const q = escapeHtml(item.question.trim());
    const a = escapeHtml(item.answer.trim());
    if (style === 'cards') return `  <div class="faq-card">\n    <h4>${q}</h4>\n    <p>${a}</p>\n  </div>`;
    if (style === 'plain') return `  <h4>${q}</h4>\n  <p>${a}</p>`;
    const cls = style === 'ac-alt' ? ' class="ac alt"' : style === 'sp' ? ' class="sp"' : ' class="ac"';
    return `  <details${cls}>\n    <summary>${q}</summary>\n    <div><p>${a}</p></div>\n  </details>`;
  });
  const head = includeHeading && heading.trim() ? `<h2>${escapeHtml(heading.trim())}</h2>\n` : '';
  if (style === 'cards') return `${head}<div class="faq-cards">\n${blocks.join('\n')}\n</div>`;
  if (style === 'plain') return `${head}<div class="faq-plain">\n${blocks.join('\n')}\n</div>`;
  return `${head}${blocks.join('\n')}`;
}

function buildSchema(items) {
  const valid = items.filter((item) => item.question.trim() && item.answer.trim());
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((item) => ({
      '@type': 'Question',
      name: item.question.trim(),
      acceptedAnswer: { '@type': 'Answer', text: item.answer.trim() },
    })),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}

function FaqWorkspace() {
  const notify = useToolNotice();
  const [items, setItems] = useState([
    { id: uid(), question: 'كيف أضيف الأسئلة الشائعة إلى مقال في بلوجر؟', answer: 'انسخ الكود الناتج والصقه في عرض HTML للمنشور داخل بلوجر، ثم احفظ المنشور ليفهرس محرك البحث بيانات الأسئلة تلقائياً.' },
    { id: uid(), question: 'هل يظهر كود Schema في نتيجة البحث؟', answer: 'قد تعرض Google الأسئلة الشائعة ضمن النتائج عندما تستوفي الصفحة شروطها، لكن الظهور غير مضمون ويعتمد على تقييم المحرك لجودة المحتوى وصلاحيته.' },
  ]);
  const [style, setStyle] = useState('ac');
  const [heading, setHeading] = useState('الأسئلة الشائعة');
  const [includeHeading, setIncludeHeading] = useState(true);
  const [includeSchema, setIncludeSchema] = useState(true);
  const [tab, setTab] = useState('html');
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const outputRef = useRef(null);

  const markup = useMemo(() => buildMarkup({ items, style, heading, includeHeading }), [items, style, heading, includeHeading]);
  const schema = useMemo(() => buildSchema(items), [items]);
  const validCount = items.filter((item) => item.question.trim() && item.answer.trim()).length;

  const update = (id, key, value) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  const addItem = () => {
    setItems((prev) => [...prev, { id: uid(), question: '', answer: '' }]);
    notify('تمت إضافة سؤال جديد');
  };
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    notify('تم حذف السؤال');
  };
  const moveItem = (index, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };
  const parseImport = () => {
    const blocks = importText.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
    const parsed = [];
    blocks.forEach((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return;
      let question = '';
      let answer = '';
      lines.forEach((line) => {
        const q = line.match(/^(?:س(?:ؤال)?|q(?:uestion)?)\s*[:：]\s*(.+)$/i);
        const a = line.match(/^(?:ج(?:واب)?|a(?:nswer)?)\s*[:：]\s*(.+)$/i);
        if (q) question = q[1];
        else if (a) answer = a[1];
        else if (!question) question = line;
        else answer += (answer ? ' ' : '') + line;
      });
      if (question && answer) parsed.push({ id: uid(), question, answer });
    });
    if (!parsed.length) { notify('لم يتم العثور على أسئلة وأجوبة في النص', 'error'); return; }
    setItems(parsed);
    setImportOpen(false);
    setImportText('');
    notify(`تم استيراد ${parsed.length} سؤالاً`);
  };
  const copy = async (value) => {
    if (!value) { notify('لا يوجد كود لنسخه', 'error'); return; }
    try {
      await navigator.clipboard.writeText(value);
      notify('تم نسخ الكود بنجاح');
    } catch {
      notify('تعذر النسخ من المتصفح', 'error');
    }
  };
  const download = () => {
    const value = tab === 'schema' ? schema : tab === 'both' ? `${markup}\n\n${schema}` : markup;
    if (!value) { notify('لا يوجد كود لتنزيله', 'error'); return; }
    const blob = new Blob([value], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'faq-schema.html';
    link.click();
    URL.revokeObjectURL(url);
    notify('تم تنزيل الملف');
  };
  const output = tab === 'schema' ? schema : tab === 'both' ? `${markup}\n\n${schema}` : markup;

  return (
    <div className="faq-layout">
      <div className="faq-col">
        <section className="faq-panel">
          <div className="faq-panel-head">
            <h2>الأسئلة والأجوبة</h2>
            <span className="count">{validCount}/{items.length}</span>
          </div>
          <div className="faq-panel-body">
            {items.map((item, index) => (
              <div className="faq-item" key={item.id}>
                <div className="faq-item-head">
                  <span className="faq-item-index">سؤال {index + 1}</span>
                  <div className="faq-item-tools">
                    <button type="button" onClick={() => moveItem(index, -1)} title="تحريك لأعلى" aria-label="تحريك لأعلى">↑</button>
                    <button type="button" onClick={() => moveItem(index, 1)} title="تحريك لأسفل" aria-label="تحريك لأسفل">↓</button>
                    <button type="button" className="danger" onClick={() => removeItem(item.id)} title="حذف السؤال" aria-label="حذف السؤال">×</button>
                  </div>
                </div>
                <input
                  className="faq-input"
                  type="text"
                  dir="auto"
                  placeholder="اكتب السؤال كما يبحث عنه القارئ..."
                  value={item.question}
                  onChange={(event) => update(item.id, 'question', event.target.value)}
                />
                <textarea
                  className="faq-textarea"
                  dir="auto"
                  placeholder="اكتب إجابة مفيدة ومكتملة من 3 إلى 5 جمل..."
                  value={item.answer}
                  onChange={(event) => update(item.id, 'answer', event.target.value)}
                />
              </div>
            ))}
            <div className="faq-actions" style={{ marginTop: '0.55rem' }}>
              <button type="button" className="faq-btn primary" onClick={addItem}>+ إضافة سؤال</button>
              <button type="button" className="faq-btn" onClick={() => setImportOpen((prev) => !prev)}>استيراد نص</button>
              <button type="button" className="faq-btn" onClick={() => { setItems([]); notify('تم مسح جميع الأسئلة'); }}>مسح الكل</button>
            </div>
            {importOpen && (
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <textarea
                  className="faq-textarea"
                  dir="auto"
                  style={{ minHeight: 110 }}
                  placeholder={'سؤال: كيف أبدأ؟\nجواب: ابدأ بخطوة بسيطة...\n\nسؤال: ما الفرق؟\nجواب: الفرق في...'}
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                />
                <div className="faq-actions">
                  <button type="button" className="faq-btn primary" onClick={parseImport}>تحليل واستبدال</button>
                  <button type="button" className="faq-btn" onClick={() => { setImportOpen(false); setImportText(''); }}>إلغاء</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="faq-panel">
          <div className="faq-panel-head"><h2>نمط العرض والخيارات</h2></div>
          <div className="faq-panel-body">
            <div className="faq-styles" role="group" aria-label="نمط الأسئلة">
              {STYLES.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="faq-style"
                  aria-pressed={style === option.id}
                  onClick={() => { setStyle(option.id); notify(`نمط: ${option.label}`, 'info'); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="faq-options" style={{ marginTop: '0.5rem' }}>
              <label><input type="checkbox" checked={includeHeading} onChange={(event) => setIncludeHeading(event.target.checked)} /> عنوان للقسم</label>
              <label><input type="checkbox" checked={includeSchema} onChange={(event) => setIncludeSchema(event.target.checked)} /> إضافة JSON-LD Schema</label>
            </div>
            {includeHeading && (
              <input
                className="faq-input"
                type="text"
                dir="auto"
                style={{ marginTop: '0.4rem' }}
                value={heading}
                onChange={(event) => setHeading(event.target.value)}
                placeholder="عنوان القسم"
              />
            )}
          </div>
        </section>
      </div>

      <div className="faq-col tool-preview-pane">
        <section className="faq-panel" style={{ flex: '1 1 auto' }}>
          <div className="faq-panel-head">
            <h2>المعاينة</h2>
            <span className="count">{STYLES.find((option) => option.id === style)?.label}</span>
          </div>
          <div className="faq-panel-body">
            {validCount ? (
              <div className="faq-preview" dangerouslySetInnerHTML={{ __html: markup }} />
            ) : (
              <p style={{ fontSize: '0.7rem', color: 'var(--mw-notifC)', textAlign: 'center', padding: '1rem 0' }}>أضف سؤالاً وجواباً لعرض المعاينة.</p>
            )}
          </div>
        </section>

        <section className="faq-panel" style={{ flex: '1 1 auto' }}>
          <div className="faq-panel-head">
            <h2>الكود</h2>
            <div className="faq-actions">
              <button type="button" className="faq-btn" onClick={download}>تنزيل</button>
              <button type="button" className="faq-btn primary" onClick={() => copy(output)}>نسخ</button>
            </div>
          </div>
          <div className="faq-panel-body" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="faq-tabs">
              <button type="button" className={`faq-tab ${tab === 'html' ? 'active' : ''}`} onClick={() => setTab('html')}>HTML</button>
              <button type="button" className={`faq-tab ${tab === 'schema' ? 'active' : ''}`} onClick={() => setTab('schema')}>JSON-LD</button>
              <button type="button" className={`faq-tab ${tab === 'both' ? 'active' : ''}`} onClick={() => setTab('both')}>الاثنان</button>
            </div>
            <textarea ref={outputRef} className="faq-output" readOnly value={tab === 'both' ? `${markup}\n\n${includeSchema ? schema : ''}` : output} />
          </div>
        </section>
      </div>
    </div>
  );
}

function FaqGeneratorPage() {
  return (
    <ToolPageGuide
      toolId="faq-generator"
      intro="أنشئ أسئلة شائعة منظمة وجاهزة للصق في بلوجر أو ووردبريس، مع خمسة أنماط عرض مختلفة وكود Schema.org يساعد محركات البحث على فهم المحتوى."
      note="اكتب أسئلة حقيقية يبحث عنها الجمهور، وتجنب تكرار ما ورد في متن المقال؛ الظهور المميز في نتائج البحث يعتمد على تقييم Google وليس مضموناً."
      steps={[
        'أضف أسئلة وأجوبة واضحة، أو الصق قائمة جاهزة عبر خيار الاستيراد.',
        'اختر نمط العرض: أكورديون، أكورديون بديل، مطوي، بطاقات أو قائمة بسيطة.',
        'فعّل JSON-LD Schema إن رغبت، ثم راجع المعاينة والكود الناتج.',
        'انسخ الكود أو نزّله وألصقه في عرض HTML للمنشور.',
      ]}
    >
      <ToolShell
        title="مولد الأسئلة الشائعة"
        subtitle="FAQ + Schema.org"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.6" /><path d="M12 16.6h.01" /></svg>}
        previewLabel="المعاينة والكود"
      >
        <FaqWorkspace />
      </ToolShell>
    </ToolPageGuide>
  );
}

export default FaqGeneratorPage;
