import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildClassicImageUrl,
  imageDimensions,
  imagePromptForKind,
  buildDesignPrompt,
  normalizeDesignSuggestion,
  parseDesignResponse,
  requestDesignSuggestions,
} from '../public/tools/thumbnail-ai.js';

const fonts = [
  { label: 'Cairo', value: "'Cairo', sans-serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
];

test('builds a classic no-key image request with an encoded prompt and selected dimensions', () => {
  const url = new URL(buildClassicImageUrl('خلفية زرقاء & تقنية', { kind: 'background', ratio: '16:9', seed: 42 }));
  assert.equal(url.origin, 'https://image.pollinations.ai');
  assert.equal(url.searchParams.get('model'), 'sana');
  assert.equal(url.searchParams.get('width'), '1280');
  assert.equal(url.searchParams.get('height'), '720');
  assert.equal(url.searchParams.get('seed'), '42');
  assert.equal(url.searchParams.get('key'), null);
  assert.match(decodeURIComponent(url.pathname), /خلفية زرقاء/);
});

test('image prompts adapt to background, character, and icon use without text overlays', () => {
  assert.match(imagePromptForKind('سماء هادئة', 'background'), /negative space/i);
  assert.match(imagePromptForKind('شخصية خيالية', 'character'), /fictional character/i);
  assert.match(imagePromptForKind('رمز تقني', 'icon'), /symbol/i);
  assert.throws(() => imagePromptForKind('   '), /اكتب وصفاً/);
});

test('dimensions use a square default for characters/icons and allow only known ratios', () => {
  assert.deepEqual(imageDimensions('icon'), { width: 768, height: 768 });
  assert.deepEqual(imageDimensions('background'), { width: 1280, height: 720 });
  assert.deepEqual(imageDimensions('background', '4:3'), { width: 1200, height: 900 });
  assert.deepEqual(imageDimensions('background', 'unknown'), { width: 1280, height: 720 });
});

test('normalizes model output to safe colors, a whitelisted font, and plain bounded tags', () => {
  const design = normalizeDesignSuggestion({
    backgroundColor: '#ffffff',
    titleColor: '#ffffff',
    descriptionColor: '#fefefe',
    organizationColor: 'url(javascript:alert(1))',
    tagTextColor: '#000000',
    font: 'expression(alert(1))',
    tags: ['<img src=x onerror=alert(1)>', 'تسويق ذكي!!', 'تقنية'],
  }, fonts);
  assert.equal(design.backgroundColor, '#ffffff');
  assert.equal(design.titleColor, '#0f172a');
  assert.equal(design.descriptionColor, '#0f172a');
  assert.equal(design.organizationColor, '#0f172a');
  assert.equal(design.tagTextColor, '#000000');
  assert.equal(design.font, '');
  assert.deepEqual(design.tags, ['تسويق ذكي', 'تقنية']);
  for (const tag of design.tags) assert.doesNotMatch(tag, /[<>/]/);
});

test('parses plain JSON, fenced JSON, and OpenAI-style text responses', () => {
  assert.deepEqual(parseDesignResponse('{"tags":["تقنية"]}'), { tags: ['تقنية'] });
  assert.deepEqual(parseDesignResponse('```json\n{"font":"Cairo"}\n```'), { font: 'Cairo' });
  assert.deepEqual(parseDesignResponse(JSON.stringify({ choices: [{ message: { content: '{"tags":["مقال"]}' } }] })), { tags: ['مقال'] });
  assert.throws(() => parseDesignResponse('لا يوجد JSON'), /تنسيق تصميم صالح/);
});

test('builds a JSON-only design prompt from article title/description and allowed fonts', () => {
  const prompt = buildDesignPrompt('عنوان المقال', 'وصف المقال', fonts);
  assert.match(prompt, /عنوان المقال/);
  assert.match(prompt, /وصف المقال/);
  assert.match(prompt, /Cairo/);
  assert.match(prompt, /JSON صالحاً فقط/);
  assert.throws(() => buildDesignPrompt('', '', fonts), /أدخل عنوان المقال/);
});

test('requests design over the no-key Classic text endpoint and validates the response', async () => {
  let capturedUrl;
  let capturedOptions;
  const fetchImpl = async (url, options) => {
    capturedUrl = new URL(url);
    capturedOptions = options;
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({
        backgroundColor: '#152238',
        titleColor: '#ffffff',
        descriptionColor: '#eeeeee',
        organizationColor: '#ffffff',
        tagTextColor: '#ffffff',
        font: "'Cairo', sans-serif",
        tags: ['ذكاء اصطناعي', 'تصميم'],
      }),
    };
  };
  const result = await requestDesignSuggestions({ title: 'عنوان', description: 'وصف', fonts, fetchImpl });
  assert.equal(capturedUrl.origin, 'https://text.pollinations.ai');
  assert.equal(capturedUrl.searchParams.get('model'), 'openai-fast');
  assert.equal(capturedUrl.searchParams.get('json'), 'true');
  assert.equal(capturedOptions.credentials, 'omit');
  assert.equal(capturedOptions.mode, 'cors');
  assert.equal(capturedOptions.headers.Authorization, undefined);
  assert.equal(result.font, "'Cairo', sans-serif");
  assert.deepEqual(result.tags, ['ذكاء اصطناعي', 'تصميم']);
});

test('does not send a request without an article title', async () => {
  let called = false;
  await assert.rejects(
    requestDesignSuggestions({ title: ' ', fonts, fetchImpl: async () => { called = true; } }),
    /أدخل عنوان المقال/,
  );
  assert.equal(called, false);
});
