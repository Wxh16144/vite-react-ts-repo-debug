import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import myCustomVitePlugin from './plugins/my-custom-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    myCustomVitePlugin(),
  ]
})
