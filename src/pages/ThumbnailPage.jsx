import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const THEME_KEYS = ['iconC','iconCa','iconCs','headC','bodyC','bodyCa','bodyB','linkC','linkB','headerC','headerB','headerHc','notifB','notifC','contentB','contentBs','contentBa','contentL','contentLa','fotB','fotC','transB','statusC','selectC','selectB','scrollT','scrollB','scrollBh','scrollBa','scrollH','scrollV','scrollR','aInvert','svgW','svgH','svgC'];

function ThumbnailPage() {
  const { theme } = useTheme();
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const sync = (mode = theme) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const tokens = Object.fromEntries(THEME_KEYS.map((key) => [key, rootStyle.getPropertyValue(`--mw-${key}`).trim()]));
      frame.contentWindow?.postMessage({ type: 'mw-theme', theme: mode, tokens }, '*');
      frame.contentWindow?.postMessage({ type: 'mw-embed', embed: true }, '*');
    };
    const onThemeChange = (event) => sync(event.detail?.mode || theme);
    window.addEventListener('mw-theme-change', onThemeChange);
    sync();
    const timer = setTimeout(sync, 400);
    return () => { clearTimeout(timer); window.removeEventListener('mw-theme-change', onThemeChange); };
  }, [theme]);

  return (
    <div className="tool-embed">
      <iframe
        ref={frameRef}
        className="tool-embed-frame"
        src={`${import.meta.env.BASE_URL}tools/thumbnail-generator.html?embed=1&v=${__APP_BUILD_ID__}`}
        title="مولد الصور المصغرة بالذكاء الاصطناعي"
        onLoad={() => {
          const rootStyle = getComputedStyle(document.documentElement);
          const tokens = Object.fromEntries(THEME_KEYS.map((key) => [key, rootStyle.getPropertyValue(`--mw-${key}`).trim()]));
          frameRef.current?.contentWindow?.postMessage({ type: 'mw-theme', theme, tokens }, '*');
          frameRef.current?.contentWindow?.postMessage({ type: 'mw-embed', embed: true }, '*');
        }}
      />
    </div>
  );
}

export default ThumbnailPage;
