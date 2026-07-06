import React from 'react';
import { Link } from 'react-router-dom';

function ToolCard() {
  return (
    <Link to="/tools/code-minifier" className="tool-card">
      <div className="tool-card-content">
        <h3 className="tool-card-title">ضاغط الأكواد</h3>
        <p className="tool-card-desc">
          أداة متقدمة لضغط وتنسيق أكواد CSS و JavaScript و HTML مع خيارات متعددة وتحسين الأداء.
        </p>
      </div>
      <svg className="tool-card-arrow" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </Link>
  );
}

export default ToolCard;
