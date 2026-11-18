import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

function resolvedTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function ThumbnailPage() {
  const { theme } = useTheme();
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const sync = () => {
      frame.contentWindow?.postMessage({ type: 'mw-theme', theme: resolvedTheme(theme) }, '*');
      frame.contentWindow?.postMessage({ type: 'mw-embed', embed: true }, '*');
    };
    sync();
    const timer = setTimeout(sync, 400);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div className="tool-embed">
      <iframe
        ref={frameRef}
        className="tool-embed-frame"
        src={`${import.meta.env.BASE_URL}tools/thumbnail-generator.html?embed=1`}
        title="مولد الصور المصغرة بالذكاء الاصطناعي"
        onLoad={() => {
          frameRef.current?.contentWindow?.postMessage({ type: 'mw-theme', theme: resolvedTheme(theme) }, '*');
          frameRef.current?.contentWindow?.postMessage({ type: 'mw-embed', embed: true }, '*');
        }}
      />
    </div>
  );
}

export default ThumbnailPage;
