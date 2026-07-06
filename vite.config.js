import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/modapp/',  // مهم جداً للنشر على GitHub Pages تحت مسار فرعي
})
