import React, { useState, useRef, useEffect, useCallback } from 'react';

function CodeMinifier() {
  const [currentType, setCurrentType] = useState('css');
  const [inputCode, setInputCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [lastMinified, setLastMinified] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({ origLen: 0, miniLen: 0, ratio: 0, timeMs: 0, origLines: 0, miniLines: 0 });
  const [statusMsg, setStatusMsg] = useState('');
  const [statusError, setStatusError] = useState(false);

  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);
  const [autoMinify, setAutoMinify] = useState(false);
  const [dropConsole, setDropConsole] = useState(false);
  const [mangle, setMangle] = useState(false);
  const [mergeRules, setMergeRules] = useState(false);
  const [optimizeColors, setOptimizeColors] = useState(false);
  const [minifyInline, setMinifyInline] = useState(false);
  const [removeEmptyAttr, setRemoveEmptyAttr] = useState(false);

  const textareaRef = useRef(null);
  const statusTimer = useRef(null);
  const autoTimer = useRef(null);
  const terserRef = useRef(null);
  const editorWrapRef = useRef(null);

  const showStatus = useCallback((msg, isError = false) => {
    clearTimeout(statusTimer.current);
    setStatusMsg(msg);
    setStatusError(isError);
    statusTimer.current = setTimeout(() => setStatusMsg(''), 2200);
  }, []);

  const formatBytes = (chars) => {
    const bytes = new Blob([chars]).size;
    return bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';
  };

  const pushUndo = useCallback((code) => {
    setUndoStack(prev => {
      const newStack = [...prev, code];
      return newStack.slice(-30);
    });
  }, []);

  const updateStats = useCallback((orig, mini, timeMs) => {
    const ol = orig.length;
    const ml = mini.length;
    const ratio = ol ? Math.round((1 - ml / ol) * 100) : 0;
    setStats({
      origLen: ol, miniLen: ml, ratio, timeMs,
      origLines: orig.split(/\r?\n/).length,
      miniLines: mini.split(/\r?\n/).length
    });
  }, []);

  const saveSession = useCallback(() => {
    try {
      const session = {
        type: currentType, code: inputCode, original: originalCode,
        lastMinified: lastMinified,
        options: { removeComments, removeWhitespace, autoMinify, dropConsole, mangle, mergeRules, optimizeColors, minifyInline, removeEmptyAttr }
      };
      localStorage.setItem('pro-minifier-session', JSON.stringify(session));
    } catch (e) {}
  }, [currentType, inputCode, originalCode, lastMinified, removeComments, removeWhitespace, autoMinify, dropConsole, mangle, mergeRules, optimizeColors, minifyInline, removeEmptyAttr]);

  const loadSession = useCallback(() => {
    try {
      const raw = localStorage.getItem('pro-minifier-session');
      if (!raw) return;
      const session = JSON.parse(raw);
      if (session.type) setCurrentType(session.type);
      if (session.code) setInputCode(session.code);
      setOriginalCode(session.original || '');
      setLastMinified(session.lastMinified || '');
      const opts = session.options;
      if (opts) {
        setRemoveComments(opts.removeComments !== false);
        setRemoveWhitespace(opts.removeWhitespace !== false);
        setAutoMinify(opts.autoMinify === true);
        setDropConsole(opts.dropConsole === true);
        setMangle(opts.mangle === true);
        setMergeRules(opts.mergeRules === true);
        setOptimizeColors(opts.optimizeColors === true);
        setMinifyInline(opts.minifyInline === true);
        setRemoveEmptyAttr(opts.removeEmptyAttr === true);
      }
    } catch (e) {}
  }, []);

  const fallbackJS = (code, opts) => {
    let out = code;
    if (opts.removeComments) {
      out = out.replace(/\/\*[\s\S]*?\*\//g, '');
      out = out.replace(/(?::\s*\/\/.*$)|(?:\/\/.*$)/gm, '');
    }
    if (opts.dropConsole) {
      out = out.replace(/console\.(?:log|debug|info|warn|error|table|trace|time|timeEnd|count|group|groupEnd)\s*\([^;]*\);?/g, '');
    }
    if (opts.removeWhitespace) {
      const tokens = [];
      let prot = out.replace(/`(?:\\.|[^`\\])*`/g, m => (tokens.push(m), '\x00' + (tokens.length-1)));
      prot = prot.replace(/"(?:\\.|[^"\\])*"/g, m => (tokens.push(m), '\x00' + (tokens.length-1)));
      prot = prot.replace(/'(?:\\.|[^'\\])*'/g, m => (tokens.push(m), '\x00' + (tokens.length-1)));
      prot = prot.replace(/(\/[^*\/](?:\\.|[^\/\\])*\/[gimsuyd]*)/g, m => (tokens.push(m), '\x00' + (tokens.length-1)));
      prot = prot.replace(/\s+/g, ' ').replace(/\s*([{}();,:!+\-*/%=<>&|^~?])\s*/g, '$1').replace(/^\s+|\s+$/g, '');
      out = prot.replace(/\x00(\d+)/g, (_, i) => tokens[parseInt(i)]);
    }
    return out.trim();
  };

  const fallbackCSS = (code, opts) => {
    let out = code;
    if (opts.removeComments) out = out.replace(/\/\*[\s\S]*?\*\//g, '');
    if (opts.removeWhitespace || opts.optimizeColors) {
      const tokens = [];
      let prot = out.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, m => (tokens.push(m), '\x00' + (tokens.length-1)));
      if (opts.removeWhitespace) {
        prot = prot.replace(/\s+/g, ' ').replace(/\s*([{};:,>+~])\s*/g, '$1').replace(/;\s*}/g, '}').replace(/^\s+|\s+$/g, '');
      }
      if (opts.optimizeColors) {
        prot = prot.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3\b/g, '#$1$2$3');
        prot = prot.replace(/0(px|em|rem|%|vh|vw|vmin|vmax|ms|s)/g, '0');
      }
      out = prot.replace(/\x00(\d+)/g, (_, i) => tokens[parseInt(i)]);
    }
    return out.trim();
  };

  const fallbackHTML = (code, opts) => {
    let out = code;
    if (opts.removeComments) out = out.replace(/<!--[\s\S]*?-->/g, '');
    if (opts.removeWhitespace) {
      out = out.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    }
    if (opts.removeEmptyAttr) {
      out = out.replace(/\s+(?:class|id|style|type|src|href|alt|title|role|aria-\w+)=["']\s*["']/g, '');
    }
    return out;
  };

  const loadTerser = useCallback(async () => {
    if (terserRef.current) return terserRef.current;
    return new Promise((resolve, reject) => {
      if (window.Terser) { terserRef.current = window.Terser; resolve(window.Terser); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/terser@5.31.0/dist/bundle.min.js';
      script.onload = () => { terserRef.current = window.Terser; resolve(window.Terser); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }, []);

  const proMinify = useCallback(async (silent = false) => {
    const code = textareaRef.current?.value;
    if (!code || !code.trim()) {
      if (!silent) showStatus('لا يوجد كود لضغطه', true);
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    pushUndo(code);
    setOriginalCode(code);
    const start = performance.now();

    try {
      const opts = {
        removeComments, removeWhitespace, dropConsole, mangle,
        mergeRules, optimizeColors, minifyInline, removeEmptyAttr
      };
      let output = '';

      if (currentType === 'js' && (opts.mangle || code.length > 50000)) {
        try {
          const T = await loadTerser();
          const res = await T.minify(code, {
            compress: { drop_console: opts.dropConsole, passes: 2 },
            mangle: opts.mangle ? { toplevel: false } : false,
            output: { comments: false }
          });
          if (res.error) throw res.error;
          output = res.code;
        } catch (e) {
          console.warn('Terser failed, fallback:', e);
          output = fallbackJS(code, opts);
          if (opts.mangle) showStatus('تم استخدام المحرك الاحتياطي بدون تقصير المتغيرات', true);
        }
      } else if (currentType === 'css') {
        output = fallbackCSS(code, opts);
      } else if (currentType === 'html') {
        output = fallbackHTML(code, opts);
      } else {
        output = code;
      }

      const elapsed = Math.round(performance.now() - start);
      setLastMinified(output);
      if (textareaRef.current) textareaRef.current.value = output;
      setInputCode(output);
      updateStats(code, output, elapsed);
      if (!silent) showStatus(`تم الضغط بنجاح - نسبة التوفير: ${Math.round((1 - output.length / code.length) * 100)}%`);
    } catch (e) {
      console.error(e);
      showStatus('حدث خطأ غير متوقع', true);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, pushUndo, showStatus, currentType, removeComments, removeWhitespace, dropConsole, mangle, mergeRules, optimizeColors, minifyInline, removeEmptyAttr, loadTerser, updateStats]);

  const proUndo = () => {
    if (undoStack.length === 0) {
      showStatus('لا يوجد كود سابق', true);
      return;
    }
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(prevStack => prevStack.slice(0, -1));
    if (textareaRef.current) textareaRef.current.value = prev;
    setInputCode(prev);
    setOriginalCode(prev);
    setLastMinified('');
    setStats({ origLen: 0, miniLen: 0, ratio: 0, timeMs: 0, origLines: 0, miniLines: 0 });
    showStatus('تم الاسترجاع');
  };

  const proClear = () => {
    const code = textareaRef.current?.value;
    if (code && code.trim()) pushUndo(code);
    if (textareaRef.current) textareaRef.current.value = '';
    setInputCode('');
    setOriginalCode('');
    setLastMinified('');
    setStats({ origLen: 0, miniLen: 0, ratio: 0, timeMs: 0, origLines: 0, miniLines: 0 });
    showStatus('تم مسح الكل');
  };

  const proCopy = () => {
    const code = textareaRef.current?.value;
    if (!code || !code.trim()) {
      showStatus('لا يوجد كود لنسخه', true);
      return;
    }
    navigator.clipboard.writeText(code).then(() => showStatus('تم النسخ')).catch(() => {
      textareaRef.current?.select();
      document.execCommand('copy');
      showStatus('تم النسخ (احتياطي)');
    });
  };

  const proDownload = () => {
    const code = textareaRef.current?.value;
    if (!code || !code.trim()) {
      showStatus('لا يوجد كود للتحميل', true);
      return;
    }
    const ext = { css: 'css', js: 'js', html: 'html' }[currentType] || 'txt';
    const filename = `minified.${lastMinified ? 'min.' : ''}${ext}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('تم التحميل');
  };

  const proBeautify = () => {
    const code = textareaRef.current?.value;
    if (!code || !code.trim()) {
      showStatus('لا يوجد كود لتنسيقه', true);
      return;
    }
    pushUndo(code);
    let formatted = code;
    if (currentType === 'css' || currentType === 'js') {
      formatted = code.replace(/\s*{\s*/g, ' {\n  ').replace(/;\s*/g, ';\n  ').replace(/}\s*/g, '}\n').replace(/^\s+|\s+$/g, '');
    } else if (currentType === 'html') {
      formatted = code.replace(/>\s+</g, '>\n<').trim();
    }
    if (textareaRef.current) textareaRef.current.value = formatted;
    setInputCode(formatted);
    setLastMinified('');
    setStats({ origLen: 0, miniLen: 0, ratio: 0, timeMs: 0, origLines: 0, miniLines: 0 });
    showStatus('تم التنسيق');
  };

  const switchTab = (type) => {
    setCurrentType(type);
    setStats({ origLen: 0, miniLen: 0, ratio: 0, timeMs: 0, origLines: 0, miniLines: 0 });
    showStatus(`وضع ${type.toUpperCase()} نشط`);
  };

  useEffect(() => { loadSession(); }, [loadSession]);
  useEffect(() => { saveSession(); }, [saveSession]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); proMinify(); }
      if (e.ctrlKey && e.key === 'z' && document.activeElement !== textareaRef.current) { e.preventDefault(); proUndo(); }
      if (e.ctrlKey && e.key === 's' && document.activeElement === textareaRef.current) { e.preventDefault(); proDownload(); }
      if (e.ctrlKey && e.shiftKey && e.key === 'C') { e.preventDefault(); proCopy(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [proMinify, proUndo, proDownload, proCopy]);

  useEffect(() => {
    const editor = editorWrapRef.current;
    if (!editor) return;
    const handleDragOver = (e) => { e.preventDefault(); editor.style.background = 'rgba(37,99,235,0.03)'; };
    const handleDragLeave = (e) => { e.preventDefault(); editor.style.background = ''; };
    const handleDrop = (e) => {
      e.preventDefault();
      editor.style.background = '';
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showStatus('حجم الملف كبير جدا', true);
        return;
      }
      const ext = file.name.split('.').pop().toLowerCase();
      const detected = { css: 'css', js: 'js', html: 'html', htm: 'html' }[ext];
      if (detected && detected !== currentType) switchTab(detected);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (textareaRef.current) {
          if (textareaRef.current.value.trim()) pushUndo(textareaRef.current.value);
          textareaRef.current.value = ev.target.result;
          setInputCode(ev.target.result);
          setOriginalCode(ev.target.result);
          setLastMinified('');
          setStats({ origLen: 0, miniLen: 0, ratio: 0, timeMs: 0, origLines: 0, miniLines: 0 });
          showStatus(`تم تحميل الملف: ${file.name}`);
          if (autoMinify) setTimeout(() => proMinify(true), 300);
        }
      };
      reader.onerror = () => showStatus('فشل قراءة الملف', true);
      reader.readAsText(file);
    };
    editor.addEventListener('dragover', handleDragOver);
    editor.addEventListener('dragleave', handleDragLeave);
    editor.addEventListener('drop', handleDrop);
    return () => {
      editor.removeEventListener('dragover', handleDragOver);
      editor.removeEventListener('dragleave', handleDragLeave);
      editor.removeEventListener('drop', handleDrop);
    };
  }, [currentType, pushUndo, showStatus, autoMinify, proMinify, switchTab]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleInput = () => {
      setInputCode(textarea.value);
      setStats(prev => ({ ...prev, origLen: 0 }));
      if (autoMinify && !isProcessing) {
        clearTimeout(autoTimer.current);
        autoTimer.current = setTimeout(() => {
          if (textarea.value.trim() && textarea.value !== lastMinified) proMinify(true);
        }, 800);
      }
    };
    textarea.addEventListener('input', handleInput);
    return () => textarea.removeEventListener('input', handleInput);
  }, [autoMinify, isProcessing, lastMinified, proMinify]);

  const placeholderText = {
    css: 'الصق كود CSS هنا...',
    js: 'الصق كود JavaScript هنا...',
    html: 'الصق كود HTML هنا...'
  }[currentType] || '';

  return (
    <div className="minifier-tool">
      <div id="minifierStatus" className="minifier-status" style={{ display: statusMsg ? 'block' : 'none', color: statusError ? '#ef4444' : 'var(--notifC,#888)' }}>
        {statusMsg}
      </div>

      <div className="minifier-header">
        <div className="minifier-header-title">
          <span>ضاغط الأكواد</span>
        </div>
        <div className="minifier-header-actions">
          <button onClick={proUndo} className="minifier-btn icon-only" title="استرجاع">
            <svg className="tool-icon" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </button>
          <button onClick={proClear} className="minifier-btn icon-only" title="مسح">
            <svg className="tool-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
          <button onClick={() => proMinify(false)} className="minifier-btn primary" disabled={isProcessing}>
            <span>{isProcessing ? 'جاري الضغط...' : 'ضغط الكود'}</span>
            {isProcessing && (
              <svg className="tool-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" className="spin">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            )}
          </button>
          <button onClick={proCopy} className="minifier-btn primary">نسخ</button>
          <button onClick={proDownload} className="minifier-btn icon-only" title="تحميل">
            <svg className="tool-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button onClick={proBeautify} className="minifier-btn" title="تنسيق">تنسيق</button>
        </div>
      </div>

      <div className="minifier-tabs">
        <button className={`minifier-tab-btn ${currentType === 'css' ? 'active' : ''}`} onClick={() => switchTab('css')}>CSS</button>
        <button className={`minifier-tab-btn ${currentType === 'js' ? 'active' : ''}`} onClick={() => switchTab('js')}>JavaScript</button>
        <button className={`minifier-tab-btn ${currentType === 'html' ? 'active' : ''}`} onClick={() => switchTab('html')}>HTML</button>
      </div>

      <div className="minifier-main">
        <div className="minifier-editor" ref={editorWrapRef}>
          <textarea ref={textareaRef} className="minifier-textarea" placeholder={placeholderText} defaultValue={inputCode} />
          <div className="minifier-options">
            <label><input type="checkbox" checked={removeComments} onChange={e => setRemoveComments(e.target.checked)} /> إزالة التعليقات</label>
            <label><input type="checkbox" checked={removeWhitespace} onChange={e => setRemoveWhitespace(e.target.checked)} /> إزالة الفراغات</label>
            <label><input type="checkbox" checked={autoMinify} onChange={e => setAutoMinify(e.target.checked)} /> ضغط تلقائي</label>
            <span style={{margin:'0 0.25rem',color:'var(--notifC,#888)'}}></span>
            <label style={{display: currentType === 'js' ? '' : 'none'}}><input type="checkbox" checked={dropConsole} onChange={e => setDropConsole(e.target.checked)} /> حذف console</label>
            <label style={{display: currentType === 'js' ? '' : 'none'}}><input type="checkbox" checked={mangle} onChange={e => setMangle(e.target.checked)} /> تقصير المتغيرات</label>
            <span style={{margin:'0 0.25rem',color:'var(--notifC,#888)'}}></span>
            <label style={{display: currentType === 'css' ? '' : 'none'}}><input type="checkbox" checked={mergeRules} onChange={e => setMergeRules(e.target.checked)} /> دمج قواعد CSS</label>
            <label style={{display: currentType === 'css' ? '' : 'none'}}><input type="checkbox" checked={optimizeColors} onChange={e => setOptimizeColors(e.target.checked)} /> تحسين الألوان</label>
            <span style={{margin:'0 0.25rem',color:'var(--notifC,#888)'}}></span>
            <label style={{display: currentType === 'html' ? '' : 'none'}}><input type="checkbox" checked={minifyInline} onChange={e => setMinifyInline(e.target.checked)} /> ضغط inline</label>
            <label style={{display: currentType === 'html' ? '' : 'none'}}><input type="checkbox" checked={removeEmptyAttr} onChange={e => setRemoveEmptyAttr(e.target.checked)} /> حذف السمات الفارغة</label>
          </div>
          <div className="minify-stats" style={{display: stats.origLen > 0 ? 'flex' : 'none'}}>
            <span>المدخل: {stats.origLen.toLocaleString()} حرف ({formatBytes(String(stats.origLen))})</span>
            <span>الناتج: {stats.miniLen.toLocaleString()} حرف ({formatBytes(String(stats.miniLen))})</span>
            <span>نسبة الضغط: {stats.ratio}%</span>
            <span>الوقت: {stats.timeMs}ms</span>
            <span>الأسطر: {stats.origLines} - {stats.miniLines}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeMinifier;
