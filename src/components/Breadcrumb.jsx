import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TOOL_LABELS = {
  'code-minifier': 'ضاغط الأكواد',
  'image-to-svg': 'تحويل الصور إلى SVG',
  'thumbnail-generator': 'مولد الصور المصغرة',
  'article-generator': 'مولّد المقالات',
};

function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const toolLabel = pathSegments[0] === 'tools' && pathSegments.length === 2
    ? TOOL_LABELS[pathSegments[1]]
    : null;

  // The secondary navigation is only useful after a tool has been opened.
  if (!toolLabel) return null;

  const items = [
    { label: 'الرئيسية', path: 'https://www.modweeb.com', icon: 'home', external: true, iconOnly: true },
    { label: 'أدوات', path: '/tools', icon: 'wrench' },
    { label: toolLabel, path: location.pathname, active: true, noIcon: true },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'home':
        return <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h5v-6h4v6h5V9"/></>;
      case 'wrench':
        return <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>;
      default:
        return null;
    }
  };

  const icon = (type) => (
    <svg className="breadcrumb-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {getIcon(type)}
    </svg>
  );

  return (
    <nav className="breadcrumb-nav" aria-label="مسار التنقل">
      <div className="breadcrumb-list">
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && <span className="breadcrumb-sep" aria-hidden="true">‹</span>}
            {item.active ? (
              <span className={`breadcrumb-item active${item.iconOnly ? ' breadcrumb-home-only' : ''}`} aria-current="page" aria-label={item.iconOnly ? item.label : undefined} title={item.iconOnly ? item.label : undefined}>
                {!item.noIcon && item.icon && icon(item.icon)}
                {!item.iconOnly && <span>{item.label}</span>}
              </span>
            ) : item.external ? (
              <a href={item.path} target="_blank" rel="noopener noreferrer" className={`breadcrumb-item${item.iconOnly ? ' breadcrumb-home-only' : ''}`} aria-label={item.label} title={item.label}>
                {item.icon && icon(item.icon)}
                {!item.iconOnly && <span>{item.label}</span>}
              </a>
            ) : (
              <Link to={item.path} className="breadcrumb-item">
                {item.icon && icon(item.icon)}
                <span>{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

export default Breadcrumb;
