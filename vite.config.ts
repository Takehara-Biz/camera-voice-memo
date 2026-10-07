import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages のサブパス配信でも動くよう相対パスにする
  base: './',
  plugins: [react()],
})
