/* ModWeeb Theme 1.0 — vanilla JS, no dependencies */
(function () {
  'use strict';

  var html = document.documentElement;
  var root = document.body;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- i18n ---------------- */
  var I18N = {
    ar: {
      search: 'بحث', menu: 'القائمة', theme: 'المظهر', colors: 'لون السمة',
      auto: 'تلقائي', light: 'فاتح', soft: 'ناعم', dark: 'داكن',
      language: 'اللغة', share: 'شارك المقال', copyLink: 'نسخ الرابط', copied: 'تم النسخ',
      readTime: 'دقيقة قراءة', updated: 'آخر تحديث', published: 'نُشر',
      related: 'اقرأ أيضًا', home: 'الرئيسية', toc: 'جدول المحتويات',
      backToTop: 'العودة للأعلى', prevPost: 'السابق', nextPost: 'التالي',
      comments: 'التعليقات', noComments: 'لا توجد تعليقات بعد',
      older: 'مقالات أقدم', newer: 'مقالات أحدث',
      errorTitle: 'الصفحة غير موجودة', errorText: 'ربما تغيّر الرابط أو حُذف المحتوى. جرّب البحث أو العودة للرئيسية.',
      backHome: 'العودة للرئيسية', tags: 'الوسوم', latest: 'أحدث المقالات', featured: 'مقال مميز',
      explore: 'استكشف المقالات', pages: 'الصفحات', siteDesc: 'مقالات وأدوات في صناعة المحتوى والتقنية.',
      skip: 'تخطَّ إلى المحتوى', more: 'المزيد', allPosts: 'كل المقالات', filter: 'تصفية',
      searchPlaceholder: 'ابحث في المدونة…', searchGo: 'بحث', close: 'إغلاق'
    },
    en: {
      search: 'Search', menu: 'Menu', theme: 'Appearance', colors: 'Accent color',
      auto: 'Auto', light: 'Light', soft: 'Soft', dark: 'Dark',
      language: 'Language', share: 'Share this post', copyLink: 'Copy link', copied: 'Copied',
      readTime: 'min read', updated: 'Updated', published: 'Published',
      related: 'Read next', home: 'Home', toc: 'Table of contents',
      backToTop: 'Back to top', prevPost: 'Previous', nextPost: 'Next',
      comments: 'Comments', noComments: 'No comments yet',
      older: 'Older posts', newer: 'Newer posts',
      errorTitle: 'Page not found', errorText: 'The link may have changed or the content was removed. Try searching or go back home.',
      backHome: 'Back home', tags: 'Tags', latest: 'Latest posts', featured: 'Featured',
      explore: 'Explore articles', pages: 'Pages', siteDesc: 'Articles and tools for content creation and technology.',
      skip: 'Skip to content', more: 'More', allPosts: 'All posts', filter: 'Filter',
      searchPlaceholder: 'Search this blog…', searchGo: 'Search', close: 'Close'
    },
    fr: {
      search: 'Rechercher', menu: 'Menu', theme: 'Apparence', colors: 'Couleur',
      auto: 'Auto', light: 'Clair', soft: 'Doux', dark: 'Sombre',
      language: 'Langue', share: 'Partager', copyLink: 'Copier le lien', copied: 'Copié',
      readTime: 'min de lecture', updated: 'Mis à jour', published: 'Publié',
      related: 'À lire aussi', home: 'Accueil', toc: 'Sommaire',
      backToTop: 'Haut de page', prevPost: 'Précédent', nextPost: 'Suivant',
      comments: 'Commentaires', noComments: 'Aucun commentaire',
      older: 'Articles plus anciens', newer: 'Articles plus récents',
      errorTitle: 'Page introuvable', errorText: 'Le lien a peut-être changé. Essayez la recherche ou revenez à l’accueil.',
      backHome: 'Retour à l’accueil', tags: 'Étiquettes', latest: 'Derniers articles', featured: 'À la une',
      explore: 'Explorer', pages: 'Pages', siteDesc: 'Articles et outils de création de contenu.',
      skip: 'Aller au contenu', more: 'Plus', allPosts: 'Tous les articles', filter: 'Filtrer',
      searchPlaceholder: 'Rechercher…', searchGo: 'Rechercher', close: 'Fermer'
    },
    es: {
      search: 'Buscar', menu: 'Menú', theme: 'Apariencia', colors: 'Color',
      auto: 'Auto', light: 'Claro', soft: 'Suave', dark: 'Oscuro',
      language: 'Idioma', share: 'Compartir', copyLink: 'Copiar enlace', copied: 'Copiado',
      readTime: 'min de lectura', updated: 'Actualizado', published: 'Publicado',
      related: 'Lee también', home: 'Inicio', toc: 'Índice',
      backToTop: 'Volver arriba', prevPost: 'Anterior', nextPost: 'Siguiente',
      comments: 'Comentarios', noComments: 'Sin comentarios',
      older: 'Entradas anteriores', newer: 'Entradas recientes',
      errorTitle: 'Página no encontrada', errorText: 'El enlace cambió o el contenido fue eliminado. Prueba buscar o volver al inicio.',
      backHome: 'Volver al inicio', tags: 'Etiquetas', latest: 'Últimas entradas', featured: 'Destacado',
      explore: 'Explorar', pages: 'Páginas', siteDesc: 'Artículos y herramientas de contenido.',
      skip: 'Ir al contenido', more: 'Más', allPosts: 'Todas', filter: 'Filtrar',
      searchPlaceholder: 'Buscar…', searchGo: 'Buscar', close: 'Cerrar'
    },
    tr: {
      search: 'Ara', menu: 'Menü', theme: 'Görünüm', colors: 'Renk',
      auto: 'Otomatik', light: 'Açık', soft: 'Yumuşak', dark: 'Koyu',
      language: 'Dil', share: 'Paylaş', copyLink: 'Bağlantıyı kopyala', copied: 'Kopyalandı',
      readTime: 'dk okuma', updated: 'Güncellendi', published: 'Yayınlandı',
      related: 'Bunları da okuyun', home: 'Ana sayfa', toc: 'İçindekiler',
      backToTop: 'Yukarı', prevPost: 'Önceki', nextPost: 'Sonraki',
      comments: 'Yorumlar', noComments: 'Henüz yorum yok',
      older: 'Eski yazılar', newer: 'Yeni yazılar',
      errorTitle: 'Sayfa bulunamadı', errorText: 'Bağlantı değişmiş olabilir. Aramayı deneyin veya ana sayfaya dönün.',
      backHome: 'Ana sayfaya dön', tags: 'Etiketler', latest: 'Son yazılar', featured: 'Öne çıkan',
      explore: 'Keşfet', pages: 'Sayfalar', siteDesc: 'İçerik ve teknoloji yazıları.',
      skip: 'İçeriğe geç', more: 'Daha fazla', allPosts: 'Tümü', filter: 'Filtrele',
      searchPlaceholder: 'Ara…', searchGo: 'Ara', close: 'Kapat'
    },
    ur: {
      search: 'تلاش', menu: 'مینو', theme: 'ظاہری شکل', colors: 'رنگ',
      auto: 'خودکار', light: 'روشن', soft: 'نرم', dark: 'تاریک',
      language: 'زبان', share: 'شیئر کریں', copyLink: 'لنک کاپی کریں', copied: 'کاپی ہو گیا',
      readTime: 'منٹ پڑھائی', updated: 'اپ ڈیٹ', published: 'شائع',
      related: 'یہ بھی پڑھیں', home: 'ہوم', toc: 'فہرست',
      backToTop: 'اوپر جائیں', prevPost: 'پچھلا', nextPost: 'اگلا',
      comments: 'تبصرے', noComments: 'ابھی کوئی تبصرہ نہیں',
      older: 'پرانی تحریریں', newer: 'نئی تحریریں',
      errorTitle: 'صفحہ نہیں ملا', errorText: 'لنک بدل گیا ہو یا مواد ہٹا دیا گیا ہو۔ تلاش کریں یا ہوم پر جائیں۔',
      backHome: 'ہوم پر جائیں', tags: 'ٹیگز', latest: 'تازہ تحریریں', featured: 'نمایاں',
      explore: 'مزید دیکھیں', pages: 'صفحات', siteDesc: 'مواد اور ٹیکنالوجی پر تحریریں۔',
      skip: 'مواد پر جائیں', more: 'مزید', allPosts: 'سب', filter: 'فلٹر',
      searchPlaceholder: 'تلاش کریں…', searchGo: 'تلاش', close: 'بند کریں'
    }
  };
  var RTL = { ar: 1, ur: 1, fa: 1, he: 1 };
  var LANGS = [
    { id: 'ar', label: 'العربية' }, { id: 'en', label: 'English' },
    { id: 'fr', label: 'Français' }, { id: 'es', label: 'Español' },
    { id: 'tr', label: 'Türkçe' }, { id: 'ur', label: 'اردو' }
  ];

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function currentLang() {
    var saved = read('mw.lang');
    if (saved && I18N[saved]) return saved;
    var blog = (document.documentElement.getAttribute('lang') || 'ar').slice(0, 2).toLowerCase();
    return I18N[blog] ? blog : 'ar';
  }

  function t(key, lang) {
    var dict = I18N[lang || currentLang()] || I18N.ar;
    return dict[key] || I18N.ar[key] || key;
  }

  function applyLanguage(lang, persist) {
    if (!I18N[lang]) lang = 'ar';
    var dir = RTL[lang] ? 'rtl' : 'ltr';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', dir);
    if (persist) store('mw.lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key === 'siteDesc' && el.getAttribute('data-keep')) return;
      el.textContent = t(key, lang);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), lang));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'), lang));
    });
    document.querySelectorAll('[data-lang-option]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-option') === lang));
    });
    document.querySelectorAll('[data-lang-label]').forEach(function (el) {
      el.textContent = (LANGS.filter(function (l) { return l.id === lang; })[0] || LANGS[0]).label;
    });
    document.dispatchEvent(new CustomEvent('mw:lang', { detail: { lang: lang } }));
  }

  /* ---------------- theme (mode + accent) ---------------- */
  var MODES = ['auto', 'light', 'soft', 'dark'];
  var ACCENTS = ['blue', 'violet', 'teal', 'emerald', 'rose', 'amber'];
  var mqDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function resolveMode(mode) {
    if (mode === 'auto') return mqDark && mqDark.matches ? 'dark' : 'light';
    return MODES.indexOf(mode) > -1 ? mode : 'light';
  }

  function applyMode(mode, persist) {
    if (MODES.indexOf(mode) < 0) mode = 'auto';
    var resolved = resolveMode(mode);
    html.setAttribute('data-mode', resolved);
    html.setAttribute('data-mode-pref', mode);
    if (persist) store('mw.mode', mode);
    document.querySelectorAll('[data-mode-option]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-mode-option') === mode));
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var bg = getComputedStyle(html).getPropertyValue('--mw-bg').trim();
      if (bg) meta.setAttribute('content', bg);
    }
  }

  function applyAccent(accent, persist) {
    if (ACCENTS.indexOf(accent) < 0) accent = 'blue';
    html.setAttribute('data-accent', accent);
    if (persist) store('mw.accent', accent);
    document.querySelectorAll('[data-accent-option]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-accent-option') === accent));
    });
  }

  function initTheme() {
    applyAccent(read('mw.accent') || 'blue', false);
    applyMode(read('mw.mode') || 'auto', false);
    if (mqDark && mqDark.addEventListener) {
      mqDark.addEventListener('change', function () {
        if ((html.getAttribute('data-mode-pref') || 'auto') === 'auto') applyMode('auto', false);
      });
    }
    applyLanguage(currentLang(), false);
  }

  /* ---------------- popovers & panels ---------------- */
  function closeAll(except) {
    document.querySelectorAll('.popover.is-open, .site-search.is-open, .main-nav.is-open').forEach(function (el) {
      if (el === except) return;
      el.classList.remove('is-open');
      var id = el.id;
      document.querySelectorAll('[aria-controls="' + id + '"]').forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function bindToggle(btn) {
    var targetId = btn.getAttribute('aria-controls');
    if (!targetId) return;
    var target = document.getElementById(targetId);
    if (!target) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = target.classList.contains('is-open');
      closeAll(target);
      target.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
      if (!open && target.classList.contains('site-search')) {
        var input = target.querySelector('input[type="search"]');
        if (input) setTimeout(function () { input.focus(); }, 60);
      }
    });
  }

  function initControls() {
    document.querySelectorAll('[data-toggle]').forEach(bindToggle);
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.popover, .site-search, .main-nav, [data-toggle]')) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    document.querySelectorAll('[data-mode-option]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyMode(btn.getAttribute('data-mode-option'), true);
      });
    });
    document.querySelectorAll('[data-accent-option]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyAccent(btn.getAttribute('data-accent-option'), true);
      });
    });
    document.querySelectorAll('[data-lang-option]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLanguage(btn.getAttribute('data-lang-option'), true);
        closeAll();
      });
    });
  }

  /* ---------------- reading progress, header, back-to-top ---------------- */
  function initScrollUI() {
    var bar = document.querySelector('.reading-progress span');
    var header = document.querySelector('.site-header');
    var top = document.querySelector('.to-top');
    var article = document.querySelector('.prose');
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-scrolled', y > 4);
      if (top) top.classList.toggle('is-visible', y > 600);
      if (bar && article) {
        var rect = article.getBoundingClientRect();
        var total = rect.height - window.innerHeight * .4;
        var passed = Math.min(Math.max(-rect.top + 100, 0), Math.max(total, 1));
        bar.style.width = (total > 0 ? (passed / total) * 100 : 0) + '%';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- reading time ---------------- */
  function initReadingTime() {
    var prose = document.querySelector('.prose');
    var slot = document.querySelector('[data-reading-time]');
    if (!prose || !slot) return;
    var text = (prose.textContent || '').trim();
    var words = text.split(/\s+/).filter(Boolean).length;
    var minutes = Math.max(1, Math.round(words / 190));
    slot.textContent = minutes + ' ' + t('readTime');
  }

  /* ---------------- table of contents ---------------- */
  function slug(text, used) {
    var base = (text || 'section').trim().toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
    var id = base, i = 2;
    while (used[id]) { id = base + '-' + i++; }
    used[id] = 1;
    return id;
  }

  function initToc() {
    var boxes = document.querySelectorAll('.aToc');
    if (!boxes.length) return;
    var prose = document.querySelector('.prose');
    if (!prose) return;
    var used = {};
    var headings = Array.prototype.filter.call(prose.querySelectorAll('h2, h3'), function (h) {
      return !h.closest('details.toc') && !h.closest('.aToc');
    });
    if (!headings.length) {
      boxes.forEach(function (box) { var d = box.closest('details'); if (d) d.remove(); });
      return;
    }
    headings.forEach(function (h) {
      if (!h.id) h.id = slug(h.textContent, used);
      else used[h.id] = 1;
    });
    var ol = document.createElement('ol');
    headings.forEach(function (h) {
      var li = document.createElement('li');
      if (h.tagName === 'H3') li.className = 'tocI';
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      ol.appendChild(li);
    });
    boxes.forEach(function (box) {
      if (box.children.length) return;
      box.appendChild(ol.cloneNode(true));
    });
  }

  /* ---------------- copy code ---------------- */
  function initCode() {
    var ICON = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    document.querySelectorAll('.prose pre').forEach(function (pre) {
      if (pre.closest('.pre.tabs') || pre.getAttribute('data-copy') === 'false') return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-code';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = ICON;
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(text);
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 1400);
      });
      pre.appendChild(btn);
    });
  }

  /* ---------------- spoiler blur ---------------- */
  function initSpoilers() {
    document.querySelectorAll('.prose .spoiler').forEach(function (el) {
      el.addEventListener('click', function () { el.classList.toggle('revealed'); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.classList.toggle('revealed'); }
      });
    });
  }

  /* ---------------- lightbox ---------------- */
  function initLightbox() {
    var imgs = document.querySelectorAll('.prose .zmImg');
    if (!imgs.length) return;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button type="button" class="close" aria-label="Close">✕</button><img alt="">';
    document.body.appendChild(box);
    var img = box.querySelector('img');
    function close() { box.classList.remove('is-open'); }
    imgs.forEach(function (wrap) {
      wrap.addEventListener('click', function () {
        var src = wrap.querySelector('img');
        if (!src) return;
        img.src = src.currentSrc || src.src;
        img.alt = src.alt || '';
        box.classList.add('is-open');
      });
    });
    box.addEventListener('click', function (e) { if (e.target === box || e.target.closest('.close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------------- share ---------------- */
  function initShare() {
    var url = location.href;
    var heading = document.querySelector('.article-header h1');
    var title = (heading ? heading.textContent : document.title).trim();
    document.querySelectorAll('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var kind = btn.getAttribute('data-share');
        var enc = encodeURIComponent;
        var map = {
          whatsapp: 'https://wa.me/?text=' + enc(title + ' ' + url),
          x: 'https://twitter.com/intent/tweet?text=' + enc(title) + '&url=' + enc(url),
          facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url),
          telegram: 'https://t.me/share/url?url=' + enc(url) + '&text=' + enc(title),
          linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url)
        };
        if (kind === 'copy') {
          if (navigator.clipboard) navigator.clipboard.writeText(url);
          btn.classList.add('copied');
          var label = btn.querySelector('[data-i18n]');
          if (label) label.textContent = t('copied');
          setTimeout(function () {
            btn.classList.remove('copied');
            if (label) label.textContent = t('copyLink');
          }, 1600);
          return;
        }
        if (map[kind]) window.open(map[kind], '_blank', 'noopener,width=720,height=560');
      });
    });
  }

  /* ---------------- FAQ structured data ---------------- */
  function initFaq() {
    var box = document.querySelector('.prose .showH[itemtype*="FAQPage"], .prose [itemtype*="FAQPage"]');
    if (!box) return;
    var items = [];
    box.querySelectorAll('details').forEach(function (d) {
      var q = d.querySelector('summary');
      var a = d.querySelector('[itemprop="text"], div, p');
      if (!q || !a) return;
      var answer = (a.getAttribute('itemprop') === 'text' ? a.textContent : a.textContent) || '';
      answer = answer.replace(/\s+/g, ' ').trim();
      if (q.textContent.trim() && answer) {
        items.push({
          '@type': 'Question',
          name: q.textContent.trim(),
          acceptedAnswer: { '@type': 'Answer', text: answer }
        });
      }
    });
    if (items.length < 2) return;
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items });
    document.head.appendChild(script);
  }

  /* ---------------- related posts via Blogger JSON feed ---------------- */
  function initRelated() {
    var box = document.querySelector('[data-related]');
    if (!box) return;
    var label = box.getAttribute('data-label');
    var limit = parseInt(box.getAttribute('data-limit'), 10) || 3;
    var blog = box.getAttribute('data-blog');
    var here = box.getAttribute('data-url');
    if (!label || !blog) { box.remove(); return; }

    var cb = 'mwRelated' + Date.now();
    var src = blog.replace(/\/$/, '') + '/feeds/posts/default/-/' + encodeURIComponent(label) +
      '?alt=json-in-script&max-results=' + (limit + 3) + '&callback=' + cb;

    window[cb] = function (json) {
      var entries = (json.feed && json.feed.entry) || [];
      var grid = box.querySelector('[data-related-grid]');
      if (!grid) return;
      var html = '';
      entries.forEach(function (entry) {
        if (html.split('class="card"').length - 1 >= limit) return;
        var link = '';
        (entry.link || []).forEach(function (l) { if (l.rel === 'alternate') link = l.href; });
        if (!link || link === here) return;
        var title = (entry.title && entry.title.$t) || '';
        var thumb = entry.media$thumbnail && entry.media$thumbnail.url
          ? entry.media$thumbnail.url.replace(/\/s72-c\//, '/w640-h360-c/').replace(/=s72-c/, '=w640-h360-c') : '';
        var published = entry.published && entry.published.$t ? entry.published.$t.slice(0, 10) : '';
        html += '<article class="card"><a class="card-media" href="' + link + '" aria-hidden="true" tabindex="-1">' +
          (thumb ? '<img src="' + thumb + '" alt="" loading="lazy" decoding="async">' : '') +
          '</a><div class="card-body"><h3 class="card-title"><a href="' + link + '">' + title + '</a></h3>' +
          (published ? '<div class="meta-line">' + published + '</div>' : '') +
          '</div></article>';
      });
      if (html) {
        grid.innerHTML = html;
        box.hidden = false;
      } else {
        box.remove();
      }
      try { delete window[cb]; } catch (e) { window[cb] = null; }
    };

    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onerror = function () { box.remove(); };
    document.body.appendChild(s);
  }

  /* ---------------- footer year ---------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------- boot ---------------- */
  initTheme();
  initControls();
  initScrollUI();
  initReadingTime();
  initToc();
  initCode();
  initSpoilers();
  initLightbox();
  initShare();
  initFaq();
  initRelated();
  initYear();

  document.addEventListener('mw:lang', function () { initReadingTime(); });
})();
