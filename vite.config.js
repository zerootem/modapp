import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

function fingerprintAssets() {
  const publicDir = resolve(process.cwd(), 'public')
  const digest = (file) => createHash('sha256').update(readFileSync(join(publicDir, file))).digest('hex').slice(0, 12)
  const thumbnailHash = createHash('sha256').update(readFileSync(join(publicDir, 'tools/thumbnail-generator.html'))).update(readFileSync(join(publicDir, 'tools/thumbnail-ai.js'))).digest('hex').slice(0, 12)
  return {
    name: 'modapp-content-fingerprints',
    config() { return { define: { __APP_BUILD_ID__: JSON.stringify(thumbnailHash) } } },
    writeBundle(options) {
      const out = options.dir || resolve(process.cwd(), 'dist')
      const file = join(out, 'tools/thumbnail-generator.html')
      if (!existsSync(file)) return
      let html = readFileSync(file, 'utf8')
      const aiHash = digest('tools/thumbnail-ai.js')
      html = html.replace(/(src=["']\.\/thumbnail-ai\.js)(?:\?[^"']*)?(["'])/, `$1?v=${aiHash}$2`)
      writeFileSync(file, html)
    }
  }
}

function buildVersion() {
  const buildId = Date.now().toString(36)
  return {
    name: 'modapp-build-version',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          .replace(/(<script[^>]+src="\/modapp\/assets\/app\.js)(")/, `$1?v=${buildId}$2`)
          .replace(/(<link[^>]+href="\/modapp\/assets\/app\.css)(")/, `$1?v=${buildId}$2`)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), fingerprintAssets(), buildVersion()],
  base: '/modapp/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: (info) => (info.name && info.name.endsWith('.css') ? 'assets/app.css' : 'assets/[name]-[hash][extname]'),
      },
    },
  },
})
