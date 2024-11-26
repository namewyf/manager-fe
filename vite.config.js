import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/manager-fe/', // github仓库名称
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  //配置 Vite 项目中 SCSS 预处理器的 API 类型，指定使用现代编译器。这有助于确保 SCSS 文件在编译时使用最新的编译方式，提高兼容性和性能。
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/style/base.scss";`,
        api: "modern-compiler" // or 'modern'
      }
    }
  },
})
