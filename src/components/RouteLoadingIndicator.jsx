import React, { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function RouteLoadingIndicator() {
  const location = useLocation();
  const previousPath = useRef(null);
  const [visible, setVisible] = useState(false);
  const pathKey = `${location.pathname}${location.search}`;

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathKey;
      return undefined;
    }
    if (previousPath.current === pathKey) return undefined;

    previousPath.current = pathKey;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 320);
    return () => window.clearTimeout(timer);
  }, [pathKey]);

  if (!visible) return null;

  return (
    <div className="route-transition-loader" role="status" aria-live="polite" aria-label="جارٍ فتح الأداة">
      <LoaderCircle className="route-transition-loader-icon" aria-hidden="true" />
    </div>
  );
}

export default RouteLoadingIndicator;
