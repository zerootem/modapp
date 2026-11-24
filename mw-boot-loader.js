/* ملف توافق فقط: يخفي شاشة التحميل القديمة في الصفحات المخزنة مسبقًا. لا يعرض أي أيقونات أو مؤثرات. */
(function () {
  'use strict';
  function hide() {
    var el = document.getElementById('preloader');
    if (el) {
      el.classList.remove('e');
      el.classList.add('h');
      el.setAttribute('aria-hidden', 'true');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 600);
    }
    document.documentElement.classList.remove('mw-booting');
  }
  window.__modweebHidePreloader = hide;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide, { once: true });
  else hide();
  setTimeout(hide, 1200);
})();
