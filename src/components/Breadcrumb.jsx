import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  let items = [];
  items.push({ label: 'الرئيسية', path: 'https://www.modweeb.com', icon: 'home', external: true });

  if (pathSegments[0] === 'tools') {
    const isToolPage = pathSegments.length > 1;
    items.push({ label: 'أدوات', path: '/tools', icon: 'wrench', active: !isToolPage });

    if (pathSegments[1] === 'code-minifier') {
      items.push({ label: 'ضاغط الأكواد', path: '/tools/code-minifier', active: true, noIcon: true });
    } else if (pathSegments[1] === 'image-to-svg') {
      items.push({ label: 'تحويل الصور إلى SVG', path: '/tools/image-to-svg', active: true, noIcon: true });
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'home':
        return <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>;
      case 'wrench':
        return <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>;
      default:
        return null;
    }
  };

  return (
    <nav className="breadcrumb-nav">
      <div className="breadcrumb-list">
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && <span className="breadcrumb-sep">‹</span>}
            {item.active ? (
              <span className="breadcrumb-item active">
                {!item.noIcon && item.icon && (
                  <svg className="breadcrumb-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {getIcon(item.icon)}
                  </svg>
                )}
                <span>{item.label}</span>
              </span>
            ) : item.external ? (
              <a href={item.path} target="_blank" rel="noopener noreferrer" className="breadcrumb-item">
                {item.icon && (
                  <svg className="breadcrumb-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {getIcon(item.icon)}
                  </svg>
                )}
                <span>{item.label}</span>
              </a>
            ) : (
              <Link to={item.path} className="breadcrumb-item">
                {item.icon && (
                  <svg className="breadcrumb-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {getIcon(item.icon)}
                  </svg>
                )}
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
