const IMAGE_ENDPOINT = 'https://image.pollinations.ai/prompt/';
const TEXT_ENDPOINT = 'https://text.pollinations.ai/';
const IMAGE_MODEL = 'sana';
const TEXT_MODEL = 'openai-fast';
const MAX_PROMPT_LENGTH = 700;
const SAFE_COLOR = /^#[0-9a-f]{6}$/i;

export function imagePromptForKind(prompt, kind = 'background') {
  const cleanPrompt = [...String(prompt ?? '')]
    .map((character) => {
      const code = character.codePointAt(0);
      return code <= 31 || (code >= 127 && code <= 159) ? ' ' : character;
    })
    .join('')
    .trim()
    .slice(0, MAX_PROMPT_LENGTH);
  if (!cleanPrompt) throw new Error('اكتب وصفاً للصورة أولاً.');

  const direction = {
    background: 'Create a polished wide article-thumbnail background. Keep clear negative space for title text. Do not render letters, captions, logos, or watermarks.',
    character: 'Create one clear fictional character or subject as a thumbnail illustration, well separated from its setting. Do not render letters, captions, logos, or watermarks.',
    icon: 'Create one simple, bold, recognizable symbol for a small article-thumbnail corner badge, centered with a clean uncluttered background. Do not render letters, captions, logos, or watermarks.',
  }[kind] || 'Create a polished article-thumbnail illustration. Do not render letters, captions, logos, or watermarks.';

  return `${cleanPrompt}. ${direction}`;
}

export function imageDimensions(kind = 'background', ratio = '') {
  const defaults = kind === 'icon' || kind === 'character'
    ? { width: 768, height: 768 }
    : { width: 1280, height: 720 };
  const dimensions = {
    '16:9': { width: 1280, height: 720 },
    '4:3': { width: 1200, height: 900 },
    '1:1': { width: 768, height: 768 },
  };
  return dimensions[ratio] || defaults;
}

export function buildClassicImageUrl(prompt, { kind = 'background', ratio = '16:9', model = '', seed = Math.floor(Math.random() * 2_000_000_000) } = {}) {
  const fullPrompt = imagePromptForKind(prompt, kind);
  const { width, height } = imageDimensions(kind, ratio);
  const url = new URL(encodeURIComponent(fullPrompt), IMAGE_ENDPOINT);
  url.search = new URLSearchParams({
    width: String(width),
    height: String(height),
    model: model || IMAGE_MODEL,
    seed: String(Number.isFinite(Number(seed)) ? Math.trunc(Number(seed)) : 1),
    nologo: 'true',
  }).toString();
  return url.toString();
}

function parseJsonText(value) {
  if (value && typeof value === 'object') return value;
  const text = String(value ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('لم يُرجع المساعد تنسيق تصميم صالحاً.');
    return JSON.parse(text.slice(start, end + 1));
  }
}

export function parseDesignResponse(responseText) {
  const parsed = parseJsonText(responseText);
  if (typeof parsed === 'string') return parseJsonText(parsed);
  const nested = parsed?.choices?.[0]?.message?.content ?? parsed?.content ?? parsed?.result;
  if (nested && typeof nested === 'string') return parseJsonText(nested);
  return parsed?.design && typeof parsed.design === 'object' ? parsed.design : parsed;
}

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16) / 255).map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a, b) {
  const values = [luminance(a), luminance(b)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function safeTag(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 22);
}

export function normalizeDesignSuggestion(input, fonts = []) {
  const data = input && typeof input === 'object' ? input : {};
  const colors = {
    backgroundColor: data.backgroundColor ?? data.background,
    titleColor: data.titleColor ?? data.title,
    descriptionColor: data.descriptionColor ?? data.description,
    organizationColor: data.organizationColor ?? data.organization,
    tagTextColor: data.tagTextColor ?? data.tagsColor,
  };
  const validColorCount = Object.values(colors).filter((value) => SAFE_COLOR.test(String(value ?? ''))).length;
  const rawTags = Array.isArray(data.tags) ? data.tags : [];
  const tags = [...new Set(rawTags.map(safeTag).filter(Boolean))].slice(0, 5);
  const font = fonts.find((option) => option.value === data.font || option.label === data.font)?.value || '';
  if (validColorCount === 0 && tags.length === 0 && !font) {
    throw new Error('تعذر قراءة ألوان أو خطوط أو وسوم صالحة من استجابة المساعد.');
  }

  const backgroundColor = SAFE_COLOR.test(String(colors.backgroundColor ?? '')) ? colors.backgroundColor : '#f8fafc';
  const contrastingText = contrastRatio(backgroundColor, '#ffffff') >= contrastRatio(backgroundColor, '#0f172a') ? '#ffffff' : '#0f172a';
  const usableColor = (value, minimum) => SAFE_COLOR.test(String(value ?? '')) && contrastRatio(backgroundColor, value) >= minimum
    ? value
    : contrastingText;

  return {
    backgroundColor,
    titleColor: usableColor(colors.titleColor, 3),
    descriptionColor: usableColor(colors.descriptionColor, 4.5),
    organizationColor: usableColor(colors.organizationColor, 4.5),
    tagTextColor: usableColor(colors.tagTextColor, 4.5),
    font,
    tags,
  };
}

export function buildDesignPrompt(title, description, fonts) {
  const safeTitle = String(title ?? '').trim().slice(0, 180);
  const safeDescription = String(description ?? '').trim().slice(0, 500);
  if (!safeTitle) throw new Error('أدخل عنوان المقال في الأداة أولاً.');
  const availableFonts = fonts.map(({ label, value }) => ({ label: String(label).slice(0, 40), value: String(value).slice(0, 80) }));
  return [
    'أنت مساعد تصميم صور مصغرة لمقالات عربية. اقترح فقط لوحة ألوان مقروءة، وخطاً من الخيارات، وخمس وسوم قصيرة ملائمة لموضوع المقال.',
    'أعد JSON صالحاً فقط بهذه المفاتيح: backgroundColor, titleColor, descriptionColor, organizationColor, tagTextColor, font, tags. استخدم ألوان #RRGGBB عالية التباين. قيمة font يجب أن تطابق value حرفياً من القائمة. اجعل tags مصفوفة من 3 إلى 5 عبارات قصيرة. لا تضف HTML أو Markdown أو شرحاً.',
    `الخطوط المسموح بها: ${JSON.stringify(availableFonts)}`,
    `عنوان المقال: ${safeTitle}`,
    `وصف المقال: ${safeDescription || 'غير متوفر؛ اعتمد على العنوان فقط.'}`,
  ].join('\n');
}

export async function requestDesignSuggestions({ title, description = '', fonts = [], fetchImpl = globalThis.fetch, signal } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('المتصفح لا يدعم الاتصال بخدمة التصميم.');
  const prompt = buildDesignPrompt(title, description, fonts);
  const url = new URL(encodeURIComponent(prompt), TEXT_ENDPOINT);
  url.search = new URLSearchParams({ model: TEXT_MODEL, json: 'true', max_tokens: '500', safe: 'true' }).toString();
  const response = await fetchImpl(url.toString(), {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    headers: { Accept: 'application/json, text/plain' },
    signal,
  });
  const body = await response.text();
  if (!response.ok) {
    const reason = response.status === 429
      ? 'وصلت الخدمة إلى حد الطلبات المؤقت.'
      : response.status === 402
        ? 'الخدمة لا تتيح الطلب المجاني حالياً أو تطلب رصيداً.'
        : response.status === 401 || response.status === 403
          ? 'تطلب الخدمة إذناً لم يعد متاحاً على الواجهة المجانية.'
          : `تعذّر الاتصال بخدمة التصميم (${response.status}).`;
    throw new Error(reason);
  }
  return normalizeDesignSuggestion(parseDesignResponse(body), fonts);
}

function setStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = isError ? 'error' : 'info';
}

function errorMessage(error) {
  if (error instanceof DOMException && error.name === 'AbortError') return 'أُلغي الطلب.';
  return error instanceof Error ? error.message : 'حدث خطأ غير متوقع.';
}

export const THUMB_PROVIDERS = {
  pollinations: { label: 'Pollinations — مجاني بلا مفتاح', models: ['sana', 'flux', 'turbo'] },
  puter: { label: 'Puter — بلا مفتاح', models: ['gpt-image-1', 'dall-e-3'] },
  api: { label: 'API مخصص — OpenAI متوافق', models: [] },
};
function readField(root, id) {
  const el = root.getElementById(id);
  return el ? String(el.value || '').trim() : '';
}
export function readAiSettings(root) {
  return {
    provider: readField(root, 'mwAiProvider') || 'pollinations',
    model: readField(root, 'mwAiModel'),
    apiModel: readField(root, 'mwAiApiModel'),
    baseUrl: readField(root, 'mwAiBaseUrl'),
    apiKey: readField(root, 'mwAiApiKey'),
  };
}
async function blobFromUrl(url, signal) {
  const response = await fetch(url, { signal, mode: 'cors', credentials: 'omit', headers: { Accept: 'image/*' } });
  if (!response.ok) throw new Error(`تعذّر تنزيل الصورة المولدة (${response.status}).`);
  const blob = await response.blob();
  if (!blob.type.startsWith('image/') || blob.size === 0) throw new Error('لم تُرجع الخدمة ملف صورة صالحاً.');
  return blob;
}
export async function generatePuterImage(prompt, { kind = 'background', ratio = '16:9', model = '', signal } = {}) {
  const puter = typeof window !== 'undefined' ? window.puter : null;
  if (!puter?.ai?.txt2img) throw new Error('مكتبة Puter غير متاحة؛ تحقق من الاتصال ثم أعد تحميل الصفحة.');
  const image = await puter.ai.txt2img(imagePromptForKind(prompt, kind), { model: model || 'gpt-image-1', aspect_ratio: ratio });
  const src = typeof image === 'string' ? image : String(image?.src || '');
  if (!/^(https:|data:image\/|blob:)/i.test(src)) throw new Error('لم يُرجع Puter رابط صورة صالحاً.');
  if (src.startsWith('data:image/')) {
    const response = await fetch(src);
    return response.blob();
  }
  return blobFromUrl(src, signal);
}
export async function generateApiImage(prompt, { kind = 'background', ratio = '16:9', model = '', baseUrl = '', apiKey = '', signal } = {}) {
  if (!baseUrl) throw new Error('أدخل عنوان الـAPI (Base URL) أولاً.');
  if (!apiKey) throw new Error('أدخل مفتاح الـAPI أولاً.');
  const { width, height } = imageDimensions(kind, ratio);
  const endpoint = /\/images\/generations\/?$/.test(baseUrl)
    ? baseUrl.replace(/\/+$/, '')
    : `${baseUrl.replace(/\/+$/, '')}/images/generations`;
  const response = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || 'gpt-image-1', prompt: imagePromptForKind(prompt, kind), n: 1, size: `${width}x${height}`, response_format: 'b64_json' }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const reason = data?.error?.message || (response.status === 401 ? 'المفتاح غير صالح.' : `تعذّر توليد الصورة (${response.status}).`);
    throw new Error(reason);
  }
  const item = data?.data?.[0];
  if (item?.b64_json) {
    const bytes = Uint8Array.from(atob(item.b64_json), (char) => char.charCodeAt(0));
    return new Blob([bytes], { type: 'image/png' });
  }
  if (item?.url) return blobFromUrl(item.url, signal);
  throw new Error('لم يُرجع المزود صورة صالحة.');
}

export function installThumbnailAI(root = document) {
  const generateButton = root.getElementById('mwAiGenerateBtn');
  const designButton = root.getElementById('mwDesignAssistBtn');
  const status = root.getElementById('mwAiStatus');
  const promptField = root.getElementById('mwAiPrompt');
  const kindField = root.getElementById('mwAiImageKind');
  const ratioField = root.getElementById('mwAiImageRatio');
  const resultPanel = root.getElementById('mwAiResult');
  const resultImage = root.getElementById('mwAiResultImage');
  const downloadButton = root.getElementById('mwAiDownloadBtn');
  const cancelButton = root.getElementById('mwAiCancelBtn');
  if (!generateButton || !designButton || !status || !promptField || !kindField || !ratioField || !resultPanel || !resultImage) return;

  let generatedBlob = null;
  let generatedObjectUrl = null;
  let imageController = null;
  let designController = null;
  const resultActions = [...root.querySelectorAll('[data-ai-apply]')];

  kindField.addEventListener('change', () => {
    if (kindField.value === 'background' && ratioField.value === '1:1') ratioField.value = '16:9';
    else if (kindField.value !== 'background') ratioField.value = '1:1';
  });

  generateButton.addEventListener('click', async () => {
    if (imageController) return;
    let timeout;
    try {
      const settings = readAiSettings(root);
      imageController = new AbortController();
      timeout = setTimeout(() => imageController?.abort(), 180_000);
      generateButton.disabled = true;
      if (cancelButton) cancelButton.hidden = false;
      setStatus(status, settings.provider === 'pollinations'
        ? 'جارٍ إرسال الوصف إلى Pollinations وتوليد الصورة… قد يستغرق ذلك بعض الوقت.'
        : `جارٍ توليد الصورة عبر ${THUMB_PROVIDERS[settings.provider]?.label || settings.provider}…`);
      resultPanel.hidden = true;
      let blob;
      if (settings.provider === 'puter') {
        blob = await generatePuterImage(promptField.value, { kind: kindField.value, ratio: ratioField.value, model: settings.model, signal: imageController.signal });
      } else if (settings.provider === 'api') {
        blob = await generateApiImage(promptField.value, { kind: kindField.value, ratio: ratioField.value, model: settings.apiModel || settings.model, baseUrl: settings.baseUrl, apiKey: settings.apiKey, signal: imageController.signal });
      } else {
        const url = buildClassicImageUrl(promptField.value, { kind: kindField.value, ratio: ratioField.value, model: settings.model || undefined });
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
          headers: { Accept: 'image/*' },
          signal: imageController.signal,
        });
        if (!response.ok) {
          const reason = response.status === 429
            ? 'وصلت إلى حد الطلبات المؤقت؛ انتظر قليلاً ثم حاول مجدداً.'
            : response.status === 402
              ? 'توفّر المسار المجاني تغيّر أو يتطلب رصيداً حالياً.'
              : response.status === 401 || response.status === 403
                ? 'واجهة التوليد بلا مفتاح لم تعد متاحة لهذا الطلب.'
                : `تعذّر توليد الصورة (${response.status}).`;
          throw new Error(reason);
        }
        blob = await response.blob();
        if (!blob.type.startsWith('image/') || blob.size === 0) throw new Error('لم تُرجع الخدمة ملف صورة صالحاً.');
      }
      if (blob.size > 20 * 1024 * 1024) throw new Error('الصورة أكبر من الحد المحلي البالغ 20 ميغابايت.');
      generatedBlob = blob;
      if (generatedObjectUrl) URL.revokeObjectURL(generatedObjectUrl);
      generatedObjectUrl = URL.createObjectURL(blob);
      resultImage.src = generatedObjectUrl;
      resultImage.alt = `صورة مولدة بالذكاء الاصطناعي: ${kindField.selectedOptions[0]?.textContent || kindField.value}`;
      resultPanel.hidden = false;
      resultActions.forEach((button) => { button.disabled = false; });
      setStatus(status, 'تم التوليد. يمكنك تنزيل الصورة أو إدراجها في التصميم.');
    } catch (error) {
      setStatus(status, errorMessage(error), true);
    } finally {
      clearTimeout(timeout);
      imageController = null;
      generateButton.disabled = false;
      if (cancelButton) cancelButton.hidden = true;
    }
  });

  cancelButton?.addEventListener('click', () => imageController?.abort());
  downloadButton?.addEventListener('click', () => {
    if (!generatedObjectUrl) return;
    const anchor = document.createElement('a');
    anchor.href = generatedObjectUrl;
    const extension = generatedBlob?.type.includes('jpeg') ? 'jpg' : generatedBlob?.type.split('/')[1] || 'png';
    anchor.download = `modweeb-${kindField.value}-${Date.now()}.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  });

  resultActions.forEach((button) => button.addEventListener('click', async () => {
    if (!generatedBlob) return;
    try {
      button.disabled = true;
      const target = button.dataset.aiApply;
      if (!window.ModweebThumbnail?.applyGeneratedImage) throw new Error('تعذّر تهيئة محرر الصورة. أعد تحميل الصفحة وحاول مجدداً.');
      await window.ModweebThumbnail.applyGeneratedImage(generatedBlob, target);
      setStatus(status, target === 'background' ? 'أُضيفت الصورة كخلفية.' : target === 'character' ? 'أُضيفت الصورة كشخصية/صورة رئيسية.' : 'أُضيفت الصورة كرمز زاوية.');
    } catch (error) {
      setStatus(status, errorMessage(error), true);
    } finally {
      button.disabled = false;
    }
  }));

  designButton.addEventListener('click', async () => {
    if (designController) return;
    const title = root.getElementById('mwTitle')?.value || '';
    const description = root.getElementById('mwDescription')?.value || '';
    const fontSelect = root.getElementById('mwFontFamily');
    const fonts = fontSelect ? [...fontSelect.options].map((option) => ({ value: option.value, label: option.textContent.trim() })) : [];
    designController = new AbortController();
    const timeout = setTimeout(() => designController?.abort(), 45_000);
    designButton.disabled = true;
    setStatus(status, 'جارٍ تحليل العنوان والوصف وإعداد لوحة التصميم…');
    try {
      const design = await requestDesignSuggestions({ title, description, fonts, signal: designController.signal });
      if (!window.ModweebThumbnail?.applyDesign) throw new Error('تعذّر تهيئة مساعد التصميم داخل المحرر.');
      window.ModweebThumbnail.applyDesign(design);
      setStatus(status, 'طُبق اقتراح التصميم. راجع الألوان والوسوم قبل تنزيل الصورة.');
    } catch (error) {
      setStatus(status, errorMessage(error), true);
    } finally {
      clearTimeout(timeout);
      designController = null;
      designButton.disabled = false;
    }
  });

  window.addEventListener('pagehide', () => {
    imageController?.abort();
    designController?.abort();
    if (generatedObjectUrl) URL.revokeObjectURL(generatedObjectUrl);
  }, { once: true });
}

if (typeof document !== 'undefined') installThumbnailAI();
