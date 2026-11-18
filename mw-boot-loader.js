/* ModWeb unified boot loader — customizable overlay shared by ModApp tools. */
(function () {
  'use strict';
  var STORAGE_KEY = 'mw-loader-settings';
  var DEFAULTS = {
    speed: 1000,        // ms per worm cycle
    size: 85,           // px
    dash: 900,          // visible worm length
    strokeWidth: 5,     // px
    accent: '#e11462',  // worm color
    iconScale: 0.8,
    showIcon: true,
    minDuration: 600,   // ms the loader stays visible at minimum
    fade: 800           // ms fade-out
  };
  var THEME_DEFAULTS = {
    light: { bg: '#f8fafc', fill: '#f1f1f0', stroke: '#e3e7ef' },
    dark: { bg: '#1a1a1a', fill: '#2d2d2d', stroke: '#404040' }
  };
  var script = document.currentScript;
  var hookName = script && script.getAttribute('data-hook');
  var panelEnabled = !script || script.getAttribute('data-panel') !== '0';

  function readStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }
  function queryOverrides() {
    var params = new URLSearchParams(location.search);
    var out = {};
    var map = { bootSpeed: 'speed', bootSize: 'size', bootDash: 'dash', bootAccent: 'accent', bootBg: 'bg', bootFill: 'fill', bootStroke: 'stroke' };
    Object.keys(map).forEach(function (key) {
      if (!params.has(key)) return;
      var value = params.get(key);
      out[map[key]] = key === 'bootAccent' || key === 'bootBg' || key === 'bootFill' || key === 'bootStroke' ? value : Number(value);
    });
    if (params.get('bootIcon') === '0') out.showIcon = false;
    return out;
  }
  function prefersDark() {
    var stored = null;
    try { stored = localStorage.getItem('mw-theme') || localStorage.getItem('modweeb-theme'); } catch (error) { /* ignore */ }
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    if (document.documentElement.classList.contains('dark') || document.body && document.body.classList.contains('dark')) return true;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function config() {
    return Object.assign({}, DEFAULTS, readStore(), queryOverrides());
  }
  function apply(cfg) {
    cfg = cfg || config();
    var root = document.documentElement.style;
    var theme = THEME_DEFAULTS[prefersDark() ? 'dark' : 'light'];
    root.setProperty('--boot-speed', Number(cfg.speed) + 'ms');
    root.setProperty('--boot-size', Number(cfg.size) + 'px');
    root.setProperty('--boot-dash', String(Number(cfg.dash)));
    root.setProperty('--boot-stroke-width', Number(cfg.strokeWidth || 5) + 'px');
    root.setProperty('--boot-accent', cfg.accent || DEFAULTS.accent);
    root.setProperty('--boot-icon-scale', String(Number(cfg.iconScale || DEFAULTS.iconScale)));
    root.setProperty('--boot-fade', Number(cfg.fade || DEFAULTS.fade) + 'ms');
    root.setProperty('--boot-bg', cfg.bg || theme.bg);
    root.setProperty('--boot-fill', cfg.fill || theme.fill);
    root.setProperty('--boot-stroke', cfg.stroke || theme.stroke);
    var overlay = document.getElementById('preloader');
    if (overlay) overlay.classList.toggle('no-icon', cfg.showIcon === false);
  }
  function measure() {
    var path = document.querySelector('#preloader .part0');
    if (!path || !path.getTotalLength) return;
    try { path.style.setProperty('--path-length', path.getTotalLength()); } catch (error) { /* ignore */ }
  }
  var shownAt = 0;
  var fallbackTimer = null;
  function show(options) {
    options = options || {};
    var overlay = document.getElementById('preloader');
    if (!overlay) return;
    apply(options.config || config());
    overlay.classList.remove('h');
    overlay.classList.add('e');
    shownAt = Date.now();
    measure();
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(function () { hide(true); }, options.fallback || 12000);
  }
  function holdForPreview() {
    try { return new URLSearchParams(location.search).get('bootHold') === '1'; } catch (error) { return false; }
  }
  function hide(force) {
    var overlay = document.getElementById('preloader');
    if (!overlay || overlay.classList.contains('h')) return;
    if (!force && holdForPreview()) return;
    clearTimeout(fallbackTimer);
    var cfg = config();
    var wait = Math.max(0, Number(cfg.minDuration || 0) - (Date.now() - shownAt));
    setTimeout(function () {
      overlay.classList.add('h');
      setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, Number(cfg.fade || 800) + 50);
    }, wait);
  }
  function set(cfg) {
    var merged = Object.assign({}, readStore(), cfg || {});
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch (error) { /* ignore */ }
    apply();
  }
  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* ignore */ }
    apply();
  }

  /* ---------------- settings panel ---------------- */
  var PANEL_CSS = [
    '.mwbp{position:fixed;inset:0;z-index:2147483600;display:none;direction:rtl;font:500 13px/1.5 "Segoe UI",Tahoma,sans-serif}',
    '.mwbp.on{display:block}',
    '.mwbp-back{position:absolute;inset:0;background:rgba(15,23,42,.45)}',
    '.mwbp-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(440px,92vw);max-height:88vh;overflow:auto;background:var(--mw-contentB,var(--contentB,#fff));color:var(--mw-bodyC,var(--bodyC,#1f2937));border:1px solid var(--mw-contentL,var(--contentL,#e5e7eb));border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.25);padding:14px 16px}',
    '.mwbp-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}',
    '.mwbp-title{font-size:14px;font-weight:700}',
    '.mwbp-x{width:26px;height:26px;border-radius:50%;border:1px solid var(--mw-contentL,var(--contentL,#e5e7eb));background:transparent;color:inherit;cursor:pointer;font-size:15px;line-height:1}',
    '.mwbp-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed var(--mw-contentL,var(--contentL,#e5e7eb))}',
    '.mwbp-row:last-of-type{border-bottom:0}',
    '.mwbp-row label{font-size:12px;flex:1}',
    '.mwbp-val{font-size:11px;min-width:52px;text-align:center;color:var(--mw-notifC,var(--notifC,#6b7280))}',
    '.mwbp input[type=range]{width:150px;accent-color:var(--boot-accent,#e11462)}',
    '.mwbp input[type=color]{width:38px;height:26px;border:1px solid var(--mw-contentL,var(--contentL,#e5e7eb));border-radius:6px;background:transparent;padding:0;cursor:pointer}',
    '.mwbp .auto{font-size:10px;padding:2px 7px;border-radius:10px;border:1px solid var(--mw-contentL,var(--contentL,#e5e7eb));background:transparent;color:inherit;cursor:pointer}',
    '.mwbp .auto.on{background:var(--boot-accent,#e11462);border-color:var(--boot-accent,#e11462);color:#fff}',
    '.mwbp-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}',
    '.mwbp-btn{flex:1 1 auto;min-height:34px;padding:0 12px;border-radius:8px;border:1px solid var(--mw-contentL,var(--contentL,#e5e7eb));background:transparent;color:inherit;font:600 12px/1 inherit;cursor:pointer}',
    '.mwbp-btn.primary{background:var(--boot-accent,#e11462);border-color:var(--boot-accent,#e11462);color:#fff}',
    '.mwbp-hint{margin-top:8px;font-size:10.5px;color:var(--mw-notifC,var(--notifC,#6b7280))}',
    '.mwbp-fab{position:fixed;bottom:14px;left:14px;z-index:2147483001;width:36px;height:36px;border-radius:50%;border:1px solid var(--mw-contentL,var(--contentL,#e5e7eb));background:var(--mw-contentB,var(--contentB,#fff));color:var(--mw-notifC,var(--notifC,#6b7280));display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.15)}',
    '.mwbp-fab svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.mwbp-fab:hover{color:var(--boot-accent,#e11462);border-color:var(--boot-accent,#e11462)}'
  ].join('');
  var panel = null;

  function row(label, control, valueEl) {
    var div = document.createElement('div');
    div.className = 'mwbp-row';
    var text = document.createElement('label');
    text.textContent = label;
    div.appendChild(text);
    if (valueEl) div.appendChild(valueEl);
    div.appendChild(control);
    return div;
  }
  function range(name, min, max, step, value, unit, onChange) {
    var input = document.createElement('input');
    input.type = 'range';
    input.min = min; input.max = max; input.step = step; input.value = value;
    var out = document.createElement('span');
    out.className = 'mwbp-val';
    out.textContent = value + unit;
    input.addEventListener('input', function () {
      out.textContent = input.value + unit;
      onChange(Number(input.value));
    });
    return { node: row(name, input, out), input: input, out: out };
  }
  function colorRow(label, key, value) {
    var wrap = document.createElement('span');
    wrap.style.display = 'inline-flex';
    wrap.style.gap = '6px';
    wrap.style.alignItems = 'center';
    var input = document.createElement('input');
    input.type = 'color';
    input.value = value;
    var auto = document.createElement('button');
    auto.type = 'button';
    auto.className = 'auto';
    auto.textContent = 'تلقائي';
    auto.addEventListener('click', function () {
      var cfg = Object.assign({}, config());
      delete cfg[key];
      set(cfg);
      auto.classList.add('on');
    });
    input.addEventListener('input', function () {
      auto.classList.remove('on');
      var cfg = Object.assign({}, readStore());
      cfg[key] = input.value;
      set(cfg);
    });
    wrap.appendChild(input);
    wrap.appendChild(auto);
    return row(label, wrap);
  }
  function buildPanel() {
    if (panel) return panel;
    var style = document.createElement('style');
    style.textContent = PANEL_CSS;
    document.head.appendChild(style);
    panel = document.createElement('div');
    panel.className = 'mwbp';
    panel.innerHTML = '<div class="mwbp-back" data-close></div><div class="mwbp-card" role="dialog" aria-modal="true" aria-label="إعدادات شاشة التحميل"><div class="mwbp-head"><span class="mwbp-title">إعدادات شاشة التحميل</span><button type="button" class="mwbp-x" data-close aria-label="إغلاق">×</button></div><div class="mwbp-body"></div><div class="mwbp-actions"><button type="button" class="mwbp-btn primary" data-act="preview">معاينة</button><button type="button" class="mwbp-btn" data-act="reset">استعادة الافتراضي</button></div><p class="mwbp-hint">تُحفظ الإعدادات في هذا المتصفح وتُطبَّق على شاشة التحميل في أدوات هذا الموقع.</p></div>';
    document.body.appendChild(panel);
    var cfg = config();
    var body = panel.querySelector('.mwbp-body');
    var speed = range('سرعة الحركة', 200, 4000, 100, cfg.speed, 'ms', function (v) { set({ speed: v }); });
    body.appendChild(speed.node);
    body.appendChild(range('حجم الشاشة', 50, 150, 5, cfg.size, 'px', function (v) { set({ size: v }); }).node);
    body.appendChild(range('طول الضوء الدوار', 200, 1600, 50, cfg.dash, '', function (v) { set({ dash: v }); }).node);
    body.appendChild(range('سماكة المسار', 2, 10, 1, cfg.strokeWidth, 'px', function (v) { set({ strokeWidth: v }); }).node);
    body.appendChild(range('حجم الأيقونة', 50, 110, 5, Math.round((cfg.iconScale || 0.8) * 100), '%', function (v) { set({ iconScale: v / 100 }); }).node);
    var theme = THEME_DEFAULTS[prefersDark() ? 'dark' : 'light'];
    body.appendChild(colorRow('لون الضوء', 'accent', cfg.accent || DEFAULTS.accent));
    body.appendChild(colorRow('خلفية الشاشة', 'bg', cfg.bg || theme.bg));
    body.appendChild(colorRow('لون المسار', 'fill', cfg.fill || theme.fill));
    body.appendChild(colorRow('حدود المسار', 'stroke', cfg.stroke || theme.stroke));
    var icon = document.createElement('input');
    icon.type = 'checkbox';
    icon.checked = cfg.showIcon !== false;
    icon.addEventListener('change', function () { set({ showIcon: icon.checked }); });
    body.appendChild(row('إظهار الأيقونة', icon));
    body.appendChild(range('أدنى مدة ظهور', 0, 3000, 100, cfg.minDuration, 'ms', function (v) { set({ minDuration: v }); }).node);
    panel.addEventListener('click', function (event) {
      var target = event.target;
      if (target.hasAttribute && target.hasAttribute('data-close')) closePanel();
      var act = target.getAttribute && target.getAttribute('data-act');
      if (act === 'preview') {
        apply();
        closePanel();
        show({ config: config(), fallback: Number(config().minDuration || 600) + 1600 });
      }
      if (act === 'reset') {
        reset();
        closePanel();
        setTimeout(function () { show({ config: config(), fallback: 1200 }); }, 50);
      }
    });
    return panel;
  }
  function openPanel() {
    buildPanel().classList.add('on');
  }
  function closePanel() {
    if (panel) panel.classList.remove('on');
  }

  window.MwBootLoader = {
    defaults: DEFAULTS,
    themeDefaults: THEME_DEFAULTS,
    get: config,
    set: set,
    apply: apply,
    show: show,
    hide: hide,
    reset: reset,
    measure: measure,
    openPanel: openPanel,
    closePanel: closePanel
  };
  if (hookName) window[hookName] = hide;

  apply();
  var boot = function () {
    var overlay = document.getElementById('preloader');
    if (overlay && !overlay.classList.contains('h')) {
      overlay.classList.add('e');
      measure();
      shownAt = Date.now();
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(function () { hide(true); }, 12000);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { apply(); });
    } catch (error) { /* older browsers */ }
  }
  function addFab() {
    if (!panelEnabled || !document.body) return;
    if (document.querySelector('.mwbp-fab') || document.getElementById('modweeb-root-loader-btn')) return;
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'mwbp-fab';
    fab.title = 'إعدادات شاشة التحميل';
    fab.setAttribute('aria-label', 'إعدادات شاشة التحميل');
    fab.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
    fab.addEventListener('click', openPanel);
    document.body.appendChild(fab);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addFab); else addFab();
})();
