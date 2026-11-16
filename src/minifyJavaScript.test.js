import test from 'node:test';
import assert from 'node:assert/strict';
import { minifyJavaScript } from './minifyJavaScript.js';

test('compresses small JavaScript and preserves its behavior', async () => {
  const source = `function add (a, b) {\n  // removable note\n  return a + b;\n}`;
  const output = await minifyJavaScript(source);

  assert.ok(output.length < source.length, 'small JavaScript should actually be minified');
  assert.doesNotMatch(output, /removable note/);
  assert.equal(new Function(`${output}; return add(19, 23);`)(), 42);
});

test('does not corrupt URLs or slash sequences inside strings', async () => {
  const source = `function getUrl() { return "https://example.test/a//b"; }`;
  const output = await minifyJavaScript(source);

  assert.equal(new Function(`${output}; return getUrl();`)(), 'https://example.test/a//b');
});

test('respects the keep-comments option', async () => {
  const output = await minifyJavaScript('/* keep this note */ function answer() { return 42; }', {
    removeComments: false,
  });

  assert.match(output, /keep this note/);
});

test('removes console calls when requested', async () => {
  const output = await minifyJavaScript('function answer() { console.log("debug"); return 42; }', {
    dropConsole: true,
  });

  assert.doesNotMatch(output, /console\.log/);
  assert.equal(new Function(`${output}; return answer();`)(), 42);
});

test('rejects invalid JavaScript instead of returning a potentially damaged fallback', async () => {
  await assert.rejects(minifyJavaScript('function { return 1; }'));
});
