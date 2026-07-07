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
      {/* تمت إزالة أيقونة السهم بالكامل */}
    </Link>
  );
}

export default ToolCard;
