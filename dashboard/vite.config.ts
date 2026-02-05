import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    // هذا السطر ضروري جداً لفتح المنفذ خارج الحاوية
    host: true, 
    allowedHosts: [
      'athar-dash.alihadi.click'
    ],
    proxy: {
      '/api': {
        // بما أنك في Docker، يفضل استخدام اسم الخدمة 'backend' 
        // لكن سأتركها localhost إذا كنت تديرها يدوياً
        target: 'http://athar-backend:3000', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})