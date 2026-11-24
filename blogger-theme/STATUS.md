# حالة قالب ModWeeb Theme (آخر تحديث: 2026-11-25)

- المصدر: src/template.xml + src/skin.css + src/theme.js، البناء: `node build.mjs` → dist/modweeb-theme-v1.0.0.xml (XML صالح، ~112KB).
- المعاينة: `python3 -m http.server 4301` ثم /preview/index.html و home.html؛ الاختبار: `python3 test-preview.py` (20 فحصًا).
- مكتمل: هيدر زجاجي، شريط تنقل + PageList، بحث، 6 ألوان × auto/light/soft/dark، 6 لغات (ar/en/fr/es/tr/ur)، بطاقات وبطاقة مميزة، صفحة مقال (فتات، وسوم، مشاركة، مقالات ذات صلة عبر JSONP، تعليقات بلوجر threaded + iframe)، شريط جانبي PopularPosts، وسوم footer، تذييل، أنماط كل عناصر مولد المقالات، TOC تلقائي من H2/H3، FAQ JSON-LD، WebSite/BlogPosting/OG، نسخ كود، لايتبوكس، spoiler، تقدم القراءة.
- قرارات: قالب بلوجر أصلي بلا React؛ الشريط الجانبي section مستقل خارج widget المقالات؛ إزالة بلوك ترقيم التعليقات القديم؛ iframe تعليقات يأخذ src مباشرة + سكربت BLOG_CMT.
- المراجع: react-theme (MIT) https://github.com/blogger-themes/themes؛ مخرجات المولد: /tmp/agt/public/assets/js/legacy/10-app-core.js (details.ac/sp, showH, toc/aToc, dropCap, pRef, note/wr/qs, alert variants, steps, kp-item, table classes, .pre.tabs, zmImg).
- التالي: رفع XML على modweeb-demo.blogspot.com من المستخدم؛ إن ظهر خطأ بلوجر أرسله؛ ثم المرحلة 3 (PWA، ميزات إضافية) وv1.1.
- ملفات: README.md (تركيب عربي)، LICENSE، samples/sample-article.html، docs/ROADMAP_BLOGGER_THEME.md.
