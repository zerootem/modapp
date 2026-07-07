import React, { useState, useRef, useEffect, useCallback } from 'react';

function ImageToSvg() {
  const [imageDataURL, setImageDataURL] = useState('');
  const [currentSVG, setCurrentSVG] = useState('');
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusError, setStatusError] = useState(false);
  const [colorCount, setColorCount] = useState(8);
  const [detailLevel, setDetailLevel] = useState(4);
  const [showCode, setShowCode] = useState(false);

  const statusTimer = useRef(null);
  const fileInputRef = useRef(null);
  const svgThumbRef = useRef(null);
  const svgCodeRef = useRef(null);
  const toolRef = useRef(null);

  const showStatus = useCallback((msg, isError = false) => {
    clearTimeout(statusTimer.current);
    setStatusMsg(msg);
    setStatusError(isError);
    statusTimer.current = setTimeout(() => setStatusMsg(''), 2500);
  }, []);

  const loadPreview = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      showStatus('الرجاء اختيار ملف صورة فقط', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageDataURL(ev.target.result);
      setCurrentSVG('');
      setPreviewVisible(true);
      setShowCode(false);
      showStatus('تم تحميل الصورة');
    };
    reader.readAsDataURL(file);
  }, [showStatus]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) loadPreview(file);
  };

  const startConversion = useCallback(() => {
    if (!imageDataURL) { showStatus('الرجاء تحميل صورة أولاً', true); return; }
    if (typeof window.ImageTracer === 'undefined') { showStatus('مكتبة التحويل لم تُحمّل بعد.', true); return; }

    setIsConverting(true);
    setTimeout(() => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const options = {
              numberofcolors: colorCount,
              pathomit: detailLevel,
              ltres: 1, qtres: 1, scale: 1, strokewidth: 1,
              linefilter: true, roundcoords: 1, desc: false,
              blurradius: 0, blurdelta: 0
            };
            let svg = window.ImageTracer.imagedataToSVG(imageData, options);
            svg = svg.replace(/<svg([^>]*)>/, '<svg$1 width="' + img.width + '" height="' + img.height + '" viewBox="0 0 ' + img.width + ' ' + img.height + '" preserveAspectRatio="xMidYMid meet">');
            setCurrentSVG(svg);
            showStatus('تم التحويل بنجاح');
          } catch (err) {
            console.error(err);
            showStatus('حدث خطأ أثناء المعالجة', true);
          } finally {
            setIsConverting(false);
          }
        };
        img.onerror = () => {
          showStatus('تعذّر تحميل الصورة للتحويل', true);
          setIsConverting(false);
        };
        img.src = imageDataURL;
      } catch (err) {
        console.error(err);
        showStatus('حدث خطأ غير متوقع', true);
        setIsConverting(false);
      }
    }, 30);
  }, [imageDataURL, colorCount, detailLevel, showStatus]);

  const copySVG = () => {
    if (!currentSVG) { showStatus('لا يوجد SVG لنسخه', true); return; }
    navigator.clipboard.writeText(currentSVG)
      .then(() => showStatus('تم نسخ كود SVG'))
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = currentSVG;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showStatus('تم النسخ');
      });
  };

  const downloadSVG = () => {
    if (!currentSVG) { showStatus('لا يوجد SVG لتحميله', true); return; }
    const blob = new Blob([currentSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-image.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('تم التحميل');
  };

  const togglePreview = () => {
    if (!imageDataURL && !currentSVG) { showStatus('لا توجد صورة أو SVG لعرضها', true); return; }
    setPreviewVisible(!previewVisible);
    showStatus(previewVisible ? 'تم إخفاء المعاينات' : 'تم إظهار المعاينات');
  };

  const resetAll = () => {
    setImageDataURL('');
    setCurrentSVG('');
    setPreviewVisible(true);
    setShowCode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showStatus('تم إعادة التعيين');
  };

  const SVG_SIZE_THRESHOLD = 500000;

  const toggleCode = () => {
    if (!currentSVG) { showStatus('لا يوجد SVG لعرضه', true); return; }
    if (showCode) {
      setShowCode(false);
      return;
    }
    if (currentSVG.length > SVG_SIZE_THRESHOLD) {
      setShowCode('overflow');
    } else {
      setShowCode(true);
    }
  };

  const openSVGInNewTab = () => {
    if (!currentSVG) return;
    const blob = new Blob([currentSVG], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  // Drag & Drop
  useEffect(() => {
    const tool = toolRef.current;
    if (!tool) return;
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) loadPreview(file);
    };
    tool.addEventListener('dragover', handleDragOver);
    tool.addEventListener('drop', handleDrop);
    return () => {
      tool.removeEventListener('dragover', handleDragOver);
      tool.removeEventListener('drop', handleDrop);
    };
  }, [loadPreview]);

  // تحميل مكتبة ImageTracer
  useEffect(() => {
    if (window.ImageTracer) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/imagetracerjs@1.2.3/imagetracer_v1.2.3.min.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="svg-tool" ref={toolRef}>
      <div className="svg-status" style={{ display: statusMsg ? 'block' : 'none', color: statusError ? '#ef4444' : 'var(--mw-notifC)' }}>
        {statusMsg}
      </div>

      <div className="svg-header">
        <div className="svg-header-actions">
          <button onClick={() => fileInputRef.current?.click()} className="svg-btn">
            <svg className="line" viewBox="0 0 24 24">
              <path d="M12 9V2L10 4"/><path d="M12 2L14 4"/>
              <path d="M1.98 13H6.39c.38 0 .72.21.89.55l1.17 2.34c.34.68 1.03 1.11 1.79 1.11h3.53c.76 0 1.45-.43 1.79-1.11l1.17-2.34c.17-.34.52-.55.89-.55h4.36"/>
              <path d="M7 5.13C3.46 5.65 2 7.73 2 12v3c0 5 2 7 7 7h6c5 0 7-2 7-7v-3c0-4.27-1.46-6.35-5-6.87"/>
            </svg>
            اختر صورة
          </button>
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

          {currentSVG && (
            <>
              <button onClick={copySVG} className="svg-btn">
                <svg className="line" viewBox="0 0 24 24">
                  <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"/>
                  <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"/>
                </svg>
                نسخ
              </button>
              <button onClick={downloadSVG} className="svg-btn">
                <svg className="line" viewBox="0 0 24 24">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                  <path d="M12 8.5V14.5"/><path d="M9 12.5L12 15.5L15 12.5"/>
                </svg>
                تحميل
              </button>
              <button onClick={toggleCode} className="svg-btn">
                <svg className="line" viewBox="0 0 24 24">
                  <path d="M8.5 18.97H8C4 18.97 2 17.97 2 12.97V7.97C2 3.97 4 1.97 8 1.97H16C20 1.97 22 3.97 22 7.97V12.97C22 16.97 20 18.97 16 18.97H15.5c-.31 0-.61.15-.8.4l-1.5 2c-.66.88-1.74.88-2.4 0l-1.5-2c-.16-.22-.52-.4-.8-.4z"/>
                  <path d="M8 8.7L6 10.7L8 12.7"/><path d="M16 8.7L18 10.7L16 12.7"/>
                  <path d="M13 8.37L11 13.03"/>
                </svg>
                الكود
              </button>
            </>
          )}

          <button onClick={startConversion} className="svg-btn primary" disabled={isConverting}>
            <span>{isConverting ? '' : 'تحويل'}</span>
            {isConverting && (
              <svg className="line spin" viewBox="0 0 24 24">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="svg-main">
        <div className="svg-actions-bar">
          <div className="svg-control-group">
            <label>الألوان:</label>
            <select value={colorCount} onChange={(e) => setColorCount(Number(e.target.value))}>
              <option value="2">2 (أبيض وأسود)</option>
              <option value="4">4 ألوان</option>
              <option value="8">8 ألوان</option>
              <option value="16">16 لون</option>
              <option value="32">32 لون</option>
            </select>
          </div>
          <div className="svg-control-group">
            <label>التفاصيل:</label>
            <select value={detailLevel} onChange={(e) => setDetailLevel(Number(e.target.value))}>
              <option value="8">منخفضة</option>
              <option value="4">متوسطة</option>
              <option value="1">عالية</option>
            </select>
          </div>
          <button onClick={togglePreview} className="svg-btn icon-only" title="إخفاء/عرض المعاينة">
            <svg className="line" viewBox="0 0 24 24">
              <path d="M14.53 9.47L9.47 14.53c-.65-.65-1.05-1.54-1.05-2.53 0-1.98 1.6-3.58 3.58-3.58.99 0 1.88.4 2.53 1.05z"/>
              <path d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73 8.47 3.73 5.18 5.81 2.89 9.41c-.9 1.41-.9 3.78 0 5.19.79 1.24 1.71 2.31 2.71 3.17"/>
              <path d="M8.42 19.53c1.14.48 2.35.74 3.58.74 3.53 0 6.82-2.08 9.11-5.18.9-1.41.9-3.78 0-5.19-.33-.52-.69-1.01-1.06-1.47"/>
              <path d="M15.51 12.7c-.26 1.41-1.41 2.56-2.82 2.82M9.47 14.53L2 22M22 2l-7.47 7.47"/>
            </svg>
          </button>
          <button onClick={resetAll} className="svg-btn icon-only" title="مسح">
            <svg className="line" viewBox="0 0 24 24">
              <path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98"/>
              <path d="M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3"/>
              <path d="M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14"/>
              <path d="M10.33 16.5h3.33M9.5 12.5h5"/>
            </svg>
          </button>
        </div>

        {/* شريط المعاينة */}
        {previewVisible && (
          <div className="preview-strip">
            <div className="thumb-container">
              <span>الأصلية</span>
              <div className="thumb-img">
                <img
                  src={imageDataURL || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
                  alt="الصورة الأصلية"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </div>
            <div className="thumb-container">
              <span>SVG الناتج</span>
              <div className="thumb-img" ref={svgThumbRef} dangerouslySetInnerHTML={{ __html: currentSVG }} />
            </div>
          </div>
        )}

        {/* عرض الكود */}
        {showCode === true && (
          <textarea className="code-area" readOnly value={currentSVG} placeholder="كود SVG سيظهر هنا..." />
        )}
        {showCode === 'overflow' && (
          <div className="code-overflow">
            <p>⚠️ حجم كود SVG كبير جداً (أكثر من 500 كيلوبايت)، وقد يؤدي عرضه هنا إلى تجميد المتصفح.</p>
            <button onClick={openSVGInNewTab} className="svg-btn">فتح الكود في نافذة جديدة</button>
            <button onClick={downloadSVG} className="svg-btn">تحميل الملف</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageToSvg;
