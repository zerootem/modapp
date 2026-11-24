import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAccentTheme } from '../data/accentThemes';
import ToolPageGuide from '../components/ToolPageGuide';

const THEME_KEYS = ['iconC','iconCa','iconCs','headC','bodyC','bodyCa','bodyB','linkC','linkB','headerC','headerB','headerHc','notifB','notifC','contentB','contentBs','contentBa','contentL','contentLa','fotB','fotC','transB','statusC','selectC','selectB','scrollT','scrollB','scrollBh','scrollBa','scrollH','scrollV','scrollR','aInvert','svgW','svgH','svgC','onAccent'];

function ThumbnailPage() {
  const { theme, accentTheme } = useTheme();
  const frameRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const sync = (mode = theme, accent = accentTheme) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const tokens = Object.fromEntries(THEME_KEYS.map((key) => [key, rootStyle.getPropertyValue(`--mw-${key}`).trim()]));
      frame.contentWindow?.postMessage({ type: 'mw-theme', theme: mode, accent, tokens }, window.location.origin);
      frame.contentWindow?.postMessage({ type: 'mw-accent', accent: getAccentTheme(accent) }, window.location.origin);
      frame.contentWindow?.postMessage({ type: 'mw-embed', embed: true }, window.location.origin);
      frame.contentWindow?.postMessage({ type: 'mw-thumbnail-fullscreen-state', expanded }, window.location.origin);
    };
    const onThemeChange = (event) => sync(event.detail?.mode || theme, event.detail?.accent || accentTheme);
    window.addEventListener('mw-theme-change', onThemeChange);
    sync();
    const timers = [300, 900, 2000].map((delay) => setTimeout(() => sync(), delay));
    const check = setInterval(() => {
      try {
        const applied = frame.contentDocument?.documentElement?.dataset?.mwTheme;
        if (applied !== `${theme}|${accentTheme}`) sync();
      } catch {
        sync();
      }
    }, 2500);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(check);
      window.removeEventListener('mw-theme-change', onThemeChange);
    };
  }, [theme, accentTheme, expanded]);

  useEffect(() => {
    const frame = frameRef.current;
    const onMessage = (event) => {
      if (!frame || event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
      if (event.data?.type === 'mw-thumbnail-fullscreen') setExpanded(Boolean(event.data.expanded));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('mw-thumbnail-expanded', expanded);
    document.body.classList.toggle('mw-thumbnail-expanded', expanded);
    return () => {
      document.documentElement.classList.remove('mw-thumbnail-expanded');
      document.body.classList.remove('mw-thumbnail-expanded');
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  const syncFrame = () => {
    const rootStyle = getComputedStyle(document.documentElement);
    const tokens = Object.fromEntries(THEME_KEYS.map((key) => [key, rootStyle.getPropertyValue(`--mw-${key}`).trim()]));
    const child = frameRef.current?.contentWindow;
    child?.postMessage({ type: 'mw-theme', theme, accent: accentTheme, tokens }, window.location.origin);
    child?.postMessage({ type: 'mw-accent', accent: getAccentTheme(accentTheme) }, window.location.origin);
    child?.postMessage({ type: 'mw-embed', embed: true }, window.location.origin);
    child?.postMessage({ type: 'mw-thumbnail-fullscreen-state', expanded }, window.location.origin);
  };

  return (
    <ToolPageGuide
      toolId="thumbnail-generator"
      intro="صمّم صورة مصغرة لمقالك على لوحة تحرير واحدة، مع إمكانية إنشاء خلفية أو شخصية أو رمز من وصف نصي ثم ضبط عناصر التصميم."
      note="عند طلب توليد صورة أو اقتراح تصميم، تُرسل المطالبة إلى المزوّد المختار؛ لا تضع معلومات سرية في وصفك."
      steps={[
        'ابدأ بقالب أو أدخل عنوان المقال ووصفه لتحديد اتجاه التصميم.',
        'اختر الخلفية أو الشخصية أو الرمز، ويمكنك طلب توليدها من وصف نصي.',
        'عدّل النصوص والألوان والخطوط والعناصر على لوحة التصميم.',
        'راجع المعاينة ثم نزّل الصورة النهائية إلى جهازك.',
      ]}
    >
      <div className={`tool-embed${expanded ? ' tool-embed-expanded' : ''}`}>
        <iframe
          ref={frameRef}
          className="tool-embed-frame"
          src={`${import.meta.env.BASE_URL}tools/thumbnail-generator.html?embed=1&v=${__APP_BUILD_ID__}`}
          title="مولد الصور المصغرة بالذكاء الاصطناعي"
          onLoad={syncFrame}
        />
      </div>
    </ToolPageGuide>
  );
}

export default ThumbnailPage;
