import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const stylesDir = fileURLToPath(new URL('./src/styles', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // src/styles 를 로드 경로로 등록해 `@use 'core'` 형태로 참조 가능
        loadPaths: [stylesDir],
        // 모든 SCSS 파일 상단에 디자인 토큰을 자동 주입한다.
        // 따라서 컴포넌트 SCSS에서 variables/mixins 를 다시 @use 하면
        // 네임스페이스 충돌이 발생하므로 주의할 것.
        additionalData: `@use 'core' as *;\n`,
      },
    },
  },
})
