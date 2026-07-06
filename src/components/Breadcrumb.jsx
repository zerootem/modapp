import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // بناء عناصر المسار
  let items = [{ label: 'الرئيسية', path: '/', icon: 'home' }];

  if (pathSegments[0] === 'tools') {
    items.push({ label: 'أدوات', path: '/tools', icon: 'tools' });
  }
  if (pathSegments[1] === 'code-minifier') {
    items.push({ label: 'ضاغط الأكواد', path: '/tools/code-minifier', icon: 'minify' });
  }

  // تحديد الأيقونة المناسبة
  const getIcon = (type) => {
    switch (type) {
      case 'home':
        return <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>;
      case 'tools':
        return <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>;
      case 'minify':
        return <polyline points="4 17 10 11 4 5"/>;
      default:
        return null;
    }
  };

  return (
    <nav className="breadcrumb-nav">
      <div className="breadcrumb-list">
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            {index > 0 && <span className="breadcrumb-sep">›</span>}
            {index === items.length - 1 ? (
              <span className="breadcrumb-item active">
                <svg className="breadcrumb-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {getIcon(item.icon)}
                </svg>
                <span>{item.label}</span>
              </span>
            ) : (
              <Link to={item.path} className="breadcrumb-item">
                <svg className="breadcrumb-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  {getIcon(item.icon)}
                </svg>
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
