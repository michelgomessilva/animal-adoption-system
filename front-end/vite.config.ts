import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const envDir = fileURLToPath(new URL('.', import.meta.url))
const env = loadEnv(process.env.NODE_ENV ?? 'development', envDir, '')
const apiProxyTarget = env.API_PROXY_TARGET || 'http://localhost:5127'

// Controllers live under two prefixes (/api/animals and /auth/login).
// Forward both so the browser stays same-origin and the API never needs CORS.
const apiProxyOptions: ProxyOptions = {
  target: apiProxyTarget,
  changeOrigin: true,
  secure: false,
}

const apiProxy = {
  '/api': apiProxyOptions,
  '/auth': apiProxyOptions,
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
})
