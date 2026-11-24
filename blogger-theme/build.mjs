#!/usr/bin/env node
/**
 * Build the ModWeeb Theme Blogger XML from src/template.xml + src/skin.css + src/theme.js
 * Also generates preview/theme.css with Theme Designer defaults substituted.
 *
 * Usage: node build.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(here, 'package.json'), 'utf8'));
const version = pkg.version;

const skin = readFileSync(join(here, 'src/skin.css'), 'utf8');
const js = readFileSync(join(here, 'src/theme.js'), 'utf8');
const template = readFileSync(join(here, 'src/template.xml'), 'utf8');

/* Blogger substitutes $(variable) inside b:skin; keep as-is for the XML */
for (const [name, content] of [['skin', skin], ['js', js]]) {
  if (content.includes(']]>')) throw new Error(`${name} contains "]]>" which breaks CDATA`);
}

let xml = template
  .replace('{{SKIN}}', skin)
  .replace('{{JS}}', js)
  .replace("b:templateVersion='1.0.0'", `b:templateVersion='${version}'`);

if (xml.includes('{{')) throw new Error('Unresolved placeholder remains in XML');

mkdirSync(join(here, 'dist'), { recursive: true });
const out = join(here, `dist/modweeb-theme-v${version}.xml`);
writeFileSync(out, xml);

/* validate as XML (Blogger is strict) */
try {
  execFileSync('python3', ['-c', `import sys, xml.dom.minidom as m; m.parse(sys.argv[1])`, out], { stdio: 'pipe' });
} catch (e) {
  console.error(e.stderr?.toString() || e.message);
  process.exit(1);
}

/* preview CSS: substitute Blogger variable defaults */
const defaults = {
  keycolor: '#3b82f6',
  'accent.soft': '#eff6ff',
  'body.background': '#f9fafb',
  'card.background': '#ffffff',
  'card.alt': '#f6f6f6',
  'heading.color': '#111827',
  'body.textColor': '#1f2937',
  'muted.color': '#6b7280',
  'border.color': '#e5e7eb',
  'font.body': "normal normal 16px 'IBM Plex Sans Arabic', system-ui, sans-serif",
  'font.heading': "normal bold 16px 'IBM Plex Sans Arabic', system-ui, sans-serif",
  'content.width': '1180px',
  'radius.base': '14px',
  'header.height': '64px',
};
let previewCss = skin;
for (const [name, value] of Object.entries(defaults)) {
  previewCss = previewCss.split(`$(${name})`).join(value);
}
if (/\$\([a-z0-9.]+\)/i.test(previewCss)) {
  const left = previewCss.match(/\$\([a-z0-9.]+\)/gi);
  throw new Error('Unknown Blogger variables in CSS: ' + [...new Set(left)].join(', '));
}
mkdirSync(join(here, 'preview'), { recursive: true });
writeFileSync(join(here, 'preview/theme.css'), previewCss);

/* stats */
const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1) + ' KB';
console.log(`built ${out}`);
console.log(`  xml ${kb(xml)} · css ${kb(skin)} · js ${kb(js)}`);
