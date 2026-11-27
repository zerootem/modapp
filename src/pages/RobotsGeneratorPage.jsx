import React, { useEffect, useMemo, useState } from 'react';
import ToolPageGuide from '../components/ToolPageGuide';
import ToolShell, { useToolNotice } from '../components/ToolShell';

const PLATFORMS = [
  {
    id: 'blogger', label: 'Blogger — بلوجر', sitemap: '/sitemap.xml',
    allow: ['/'],
    disallow: ['/search', '/search?', '/feeds/posts/default?alt=json'],
  },
  {
    id: 'wordpress', label: 'WordPress', sitemap: '/wp-sitemap.xml',
    allow: ['/wp-admin/admin-ajax.php'],
    disallow: ['/wp-admin/', '/wp-content/plugins/', '/?s=', '/search/'],
  },
  {
    id: 'woocommerce', label: 'WooCommerce', sitemap: '/wp-sitemap.xml',
    allow: ['/wp-admin/admin-ajax.php'],
    disallow: ['/wp-admin/', '/cart/', '/checkout/', '/my-account/', '/?s=', '/*add-to-cart=*', '/*orderby=*'],
  },
  {
    id: 'shopify', label: 'Shopify', sitemap: '/sitemap.xml',
    allow: ['/', '/products/', '/collections/'],
    disallow: ['/cart', '/orders', '/checkouts/', '/account', '/*?*sort_by*', '/*?*variant='],
  },
  {
    id: 'wix', label: 'Wix', sitemap: '/sitemap.xml',
    allow: ['/'],
    disallow: ['/_partials/', '/*?*wixSiteUrl=', '/*?*gclid='],
  },
  {
    id: 'ghost', label: 'Ghost', sitemap: '/sitemap.xml',
    allow: ['/'],
    disallow: ['/ghost/', '/p/', '/r/', '/members/'],
  },
  {
    id: 'nextjs', label: 'موقع ثابت / Next.js', sitemap: '/sitemap.xml',
    allow: ['/', '/_next/static/'],
    disallow: ['/api/', '/admin/'],
  },
  { id: 'custom', label: 'مخصص', sitemap: '/sitemap.xml', allow: [], disallow: [] },
];

const BOTS = [
  { id: 'googlebot', label: 'Googlebot', ua: 'Googlebot' },
  { id: 'bingbot', label: 'Bingbot', ua: 'Bingbot' },
  { id: 'mediapartners', label: 'AdSense (Mediapartners-Google)', ua: 'Mediapartners-Google' },
  { id: 'adsbot', label: 'AdsBot-Google', ua: 'AdsBot-Google' },
];

const uid = () => Math.random().toString(36).slice(2, 9);

function normalizeUrl(value) {
  const trimmed = value.trim().replace(/\/+$/, '');
  return trimmed;
}

function RobotsWorkspace() {
  const notify = useToolNotice();
  const [siteUrl, setSiteUrl] = useState('https://www.modweeb.com');
  const [platform, setPlatform] = useState('blogger');
  const [allow, setAllow] = useState(PLATFORMS[0].allow.map((value) => ({ id: uid(), value })));
  const [disallow, setDisallow] = useState(PLATFORMS[0].disallow.map((value) => ({ id: uid(), value })));
  const [customSitemap, setCustomSitemap] = useState('');
  const [bots, setBots] = useState({ googlebot: true, bingbot: true, mediapartners: true, adsbot: false });
  const [blockAI, setBlockAI] = useState(false);
  const [crawlDelay, setCrawlDelay] = useState('');
  const [yandexHost, setYandexHost] = useState(false);
  const [blockAll, setBlockAll] = useState(false);
  const [openSections, setOpenSections] = useState({ site: true, paths: true, bots: true, advanced: false });

  const preset = PLATFORMS.find((item) => item.id === platform) || PLATFORMS[0];

  useEffect(() => {
    setAllow(preset.allow.map((value) => ({ id: uid(), value })));
    setDisallow(preset.disallow.map((value) => ({ id: uid(), value })));
  }, [platform]);

  const base = normalizeUrl(siteUrl);
  const sitemapUrl = `${base}${customSitemap.trim() || preset.sitemap}`;

  const warnings = useMemo(() => {
    const list = [];
    if (!/^https?:\/\/[^\s]+\.[^\s]+/i.test(base)) list.push({ type: 'error', text: 'عنوان الموقع غير صالح؛ اكتب رابطاً كاملاً يبدأ بـ https:// أو http://' });
    if (blockAll && allow.some((item) => item.value.trim() === '/')) list.push({ type: 'warn', text: 'قاعدة السماح / تلغي أثر حظر الجميع؛ أزل قاعدة السماح إذا أردت حظر الموقع بالكامل.' });
    if (disallow.some((item) => item.value.trim() === '/')) list.push({ type: 'warn', text: 'القاعدة Disallow: / تمنع الزحف لكل الموقع تقريباً؛ تأكد أنها مقصودة.' });
    if (allow.some((item) => item.value.includes('*') && item.value.trim().startsWith('/') && item.value.length < 3)) list.push({ type: 'warn', text: 'قاعدة السماح واسعة جداً وقد تفتح صفحات غير مطلوبة للفهرسة.' });
    if (!customSitemap.trim()) list.push({ type: 'info', text: `تم اقتراح خريطة الموقع الافتراضية للمنصة: ${preset.sitemap}` });
    return list;
  }, [base, blockAll, allow, disallow, customSitemap, preset]);

  const output = useMemo(() => {
    const lines = ['# robots.txt — تم إنشاؤه بواسطة ModWeeb', `# المنصة: ${preset.label}`, ''];
    if (blockAll) {
      lines.push('User-agent: *', 'Disallow: /', '');
    } else {
      lines.push('User-agent: *');
      allow.forEach((item) => { if (item.value.trim()) lines.push(`Allow: ${item.value.trim()}`); });
      disallow.forEach((item) => { if (item.value.trim()) lines.push(`Disallow: ${item.value.trim()}`); });
      if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
      lines.push('');

      BOTS.forEach((bot) => {
        if (!bots[bot.id]) return;
        lines.push(`User-agent: ${bot.ua}`);
        lines.push('Allow: /');
        if (bot.id === 'mediapartners') lines.push('Disallow: /*?*');
        lines.push('');
      });

      if (blockAI) {
        ['GPTBot', 'CCBot', 'Google-Extended', 'anthropic-ai', 'ClaudeBot', 'PerplexityBot'].forEach((ua) => {
          lines.push(`User-agent: ${ua}`, 'Disallow: /', '');
        });
      }
    }
    lines.push(`Sitemap: ${sitemapUrl}`);
    if (yandexHost) lines.push(`Host: ${base}`);
    return `${lines.join('\n')}\n`;
  }, [blockAll, allow, disallow, crawlDelay, bots, blockAI, sitemapUrl, base, yandexHost, preset]);

  const updatePath = (setter, id, value) => setter((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
  const removePath = (setter, id) => setter((prev) => prev.filter((item) => item.id !== id));
  const addPath = (setter) => setter((prev) => [...prev, { id: uid(), value: '' }]);
  const setSection = (key, value) => setOpenSections((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  const applyPreset = () => {
    setAllow(preset.allow.map((value) => ({ id: uid(), value })));
    setDisallow(preset.disallow.map((value) => ({ id: uid(), value })));
    notify(`تم تطبيق قواعد ${preset.label}`);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      notify('تم نسخ ملف robots.txt');
    } catch {
      notify('تعذر النسخ من المتصفح', 'error');
    }
  };
  const download = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    link.click();
    URL.revokeObjectURL(url);
    notify('تم تنزيل robots.txt');
  };

  return (
    <div className="robots-layout">
      <div className="robots-col">
        <details className="robots-section" open={openSections.site} onToggle={(event) => setSection('site', event.currentTarget.open)}>
          <summary>1. الموقع والمنصة</summary>
          <div className="robots-section-body">
            <div className="robots-field">
              <label htmlFor="robots-site">عنوان الموقع</label>
              <input id="robots-site" className="robots-input" type="url" dir="ltr" value={siteUrl} onChange={(event) => setSiteUrl(event.target.value)} placeholder="https://example.com" />
              <small>يُستخدم في سطر Sitemap وفي مضيف Yandex عند تفعيله.</small>
            </div>
            <div className="robots-field">
              <label htmlFor="robots-platform">منصة الموقع</label>
              <select id="robots-platform" className="robots-select" value={platform} onChange={(event) => setPlatform(event.target.value)}>
                {PLATFORMS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </div>
            <div className="robots-actions" style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <button type="button" className="faq-btn primary" onClick={applyPreset}>تطبيق قواعد المنصة</button>
              <button type="button" className="faq-btn" onClick={() => { setAllow([]); setDisallow([]); notify('تم مسح القواعد المخصصة', 'info'); }}>قواعد فارغة</button>
            </div>
          </div>
        </details>

        <details className="robots-section" open={openSections.paths} onToggle={(event) => setSection('paths', event.currentTarget.open)}>
          <summary>2. قواعد الزحف (Allow / Disallow)</summary>
          <div className="robots-section-body">
            <div className="robots-field">
              <label>مسارات السماح</label>
              <div className="robots-paths">
                {allow.map((item) => (
                  <div className="robots-path" key={item.id}>
                    <input className="robots-input" dir="ltr" value={item.value} onChange={(event) => updatePath(setAllow, item.id, event.target.value)} placeholder="/" />
                    <button type="button" onClick={() => removePath(setAllow, item.id)} aria-label="حذف مسار السماح">×</button>
                  </div>
                ))}
              </div>
              <button type="button" className="faq-btn" onClick={() => addPath(setAllow)} style={{ alignSelf: 'flex-start', marginTop: '0.3rem' }}>+ مسار سماح</button>
            </div>
            <div className="robots-field">
              <label>مسارات المنع</label>
              <div className="robots-paths">
                {disallow.map((item) => (
                  <div className="robots-path" key={item.id}>
                    <input className="robots-input" dir="ltr" value={item.value} onChange={(event) => updatePath(setDisallow, item.id, event.target.value)} placeholder="/search" />
                    <button type="button" onClick={() => removePath(setDisallow, item.id)} aria-label="حذف مسار المنع">×</button>
                  </div>
                ))}
              </div>
              <button type="button" className="faq-btn" onClick={() => addPath(setDisallow)} style={{ alignSelf: 'flex-start', marginTop: '0.3rem' }}>+ مسار منع</button>
            </div>
            <div className="faq-options">
              <label><input type="checkbox" checked={blockAll} onChange={(event) => { setBlockAll(event.target.checked); notify(event.target.checked ? 'تم تفعيل حظر الزحف بالكامل' : 'تم إلغاء حظر الزحف الكامل', event.target.checked ? 'error' : 'success'); }} /> حظر الزحف بالكامل (Disallow: /)</label>
            </div>
          </div>
        </details>

        <details className="robots-section" open={openSections.bots} onToggle={(event) => setSection('bots', event.currentTarget.open)}>
          <summary>3. البوتات ومزوّدو الإعلانات</summary>
          <div className="robots-section-body">
            <div className="faq-options" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.3rem' }}>
              {BOTS.map((bot) => (
                <label key={bot.id}>
                  <input type="checkbox" checked={bots[bot.id]} onChange={(event) => setBots((prev) => ({ ...prev, [bot.id]: event.target.checked }))} />
                  {bot.label}
                </label>
              ))}
              <label><input type="checkbox" checked={blockAI} onChange={(event) => setBlockAI(event.target.checked)} /> حظر بوتات الذكاء الاصطناعي (GPTBot, CCBot...)</label>
            </div>
          </div>
        </details>

        <details className="robots-section" open={openSections.advanced} onToggle={(event) => setSection('advanced', event.currentTarget.open)}>
          <summary>4. خيارات متقدمة</summary>
          <div className="robots-section-body">
            <div className="robots-row">
              <div className="robots-field">
                <label htmlFor="robots-sitemap">مسار خريطة الموقع</label>
                <input id="robots-sitemap" className="robots-input" dir="ltr" value={customSitemap} onChange={(event) => setCustomSitemap(event.target.value)} placeholder={preset.sitemap} />
                <small>يُضاف إلى عنوان الموقع تلقائياً.</small>
              </div>
              <div className="robots-field">
                <label htmlFor="robots-delay">Crawl-delay</label>
                <input id="robots-delay" className="robots-input" dir="ltr" inputMode="numeric" value={crawlDelay} onChange={(event) => setCrawlDelay(event.target.value.replace(/[^\d.]/g, ''))} placeholder="اتركه فارغاً" />
                <small>يُفضّل تركه فارغاً لمعظم المنصات.</small>
              </div>
            </div>
            <div className="faq-options">
              <label><input type="checkbox" checked={yandexHost} onChange={(event) => setYandexHost(event.target.checked)} /> إضافة Host: لـ Yandex</label>
            </div>
          </div>
        </details>
      </div>

      <div className="robots-col tool-preview-pane">
        <section className="faq-panel" style={{ flex: '1 1 auto' }}>
          <div className="faq-panel-head">
            <h2>ملف robots.txt</h2>
            <div className="faq-actions">
              <button type="button" className="faq-btn" onClick={download}>تنزيل</button>
              <button type="button" className="faq-btn primary" onClick={copy}>نسخ</button>
            </div>
          </div>
          <div className="faq-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: '1 1 auto' }}>
            <textarea className="robots-output" readOnly value={output} aria-label="ملف robots.txt الناتج" />
            {warnings.length > 0 && (
              <div className="robots-warnings">
                {warnings.map((warning, index) => (
                  <div key={index} className={`robots-warning ${warning.type === 'error' ? 'error' : ''}`}>{warning.text}</div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function RobotsGeneratorPage() {
  return (
    <ToolPageGuide
      toolId="robots-generator"
      intro="ولّد ملف robots.txt صحيحاً لمدونتك أو متجرك، مع قوالب جاهزة لبلوجر وووردبريس وووكومرس وشوبيفاي وويكس وغيرها، وتحكم دقيق في قواعد الزحف والبوتات وخريطة الموقع."
      note="robots.txt يوجّه الزحف ولا يمنع الفهرسة نهائياً؛ استخدم noindex للصفحات الحساسة، وراجع الملف بعد أي تغيير في بنية الموقع."
      steps={[
        'أدخل عنوان موقعك واختر المنصة لتطبيق قواعدها الجاهزة.',
        'عدّل مسارات السماح والمنع، وحدّد البوتات ومزوّدي الإعلانات.',
        'اضبط خريطة الموقع والخيارات المتقدمة عند الحاجة.',
        'راجع التحذيرات ثم انسخ الملف أو نزّله وارفعه إلى جذر الموقع.',
      ]}
    >
      <ToolShell
        title="مولد ملف robots.txt"
        subtitle="Blogger · WordPress · Shopify · Custom"
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>}
        previewLabel="ملف robots.txt"
      >
        <RobotsWorkspace />
      </ToolShell>
    </ToolPageGuide>
  );
}

export default RobotsGeneratorPage;
