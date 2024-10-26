import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/manager-fe/', // github仓库名称
  server: {
    port: 8080
  },
  plugins: [vue()],
})
