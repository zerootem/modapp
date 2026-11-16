import React from 'react';
import { Link } from 'react-router-dom';

function ToolsPage() {
  return (
    <div>
      <Link to="/tools/code-minifier" className="tool-card">
        <div className="tool-card-content">
          <h3 className="tool-card-title">ضاغط الأكواد</h3>
          <p className="tool-card-desc">
            أداة متقدمة لضغط وتنسيق أكواد CSS و JavaScript و HTML مع خيارات متعددة وتحسين الأداء.
          </p>
        </div>
      </Link>

      <Link to="/tools/image-to-svg" className="tool-card">
        <div className="tool-card-content">
          <h3 className="tool-card-title">تحويل الصور إلى SVG</h3>
          <p className="tool-card-desc">
            حوّل صورك إلى رسوميات SVG احترافية بمستويات ألوان وتفاصيل قابلة للتخصيص.
          </p>
        </div>
      </Link>

      <a
        href="https://zerootem.github.io/article-generator-tool/"
        className="tool-card"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="مولّد المقالات — يفتح في علامة تبويب جديدة"
      >
        <div className="tool-card-content">
          <h3 className="tool-card-title">مولّد المقالات</h3>
          <p className="tool-card-desc">
            أنشئ مقالات عربية، حرّر عناصرها، حسّن SEO، وجهّزها للنشر إلى Blogger.
          </p>
        </div>
      </a>
    </div>
  );
}

export default ToolsPage;
