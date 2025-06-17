import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { fileURLToPath } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { QuasarResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: fileURLToPath(
        new URL('src/assets/css/quasar-variables.scss', import.meta.url)
      )
    }),
    electron({
      entry: 'electron/index.js',
      // 중요: pg 모듈을 external로 설정
      external: ['pg', 'sequelize', 'pg-hstore'],
      // 추가 설정
      vite: {
        build: {
          rollupOptions: {
            external: ['pg', 'sequelize', 'pg-hstore']
          }
        }
      }
    }),
    // Vue Composition API 함수들 자동 임포트
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'quasar'],
      dts: true, // 타입 정의 파일 생성
      eslintrc: {
        enabled: true, // ESLint 설정 파일 생성
        filepath: '.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    // Vue 컴포넌트들 자동 임포트
    Components({
      resolvers: [
        QuasarResolver() // Quasar 컴포넌트 자동 임포트
      ],
      dirs: [
        'src/components', // 기본 컴포넌트 디렉터리
        'src/layout/components', // 레이아웃 컴포넌트
        'src/shared/components', // 공유 컴포넌트
        'src/modules/**/components', // 모듈별 컴포넌트
        'src/modules/**/views' // 모듈별 페이지 컴포넌트
      ],
      dts: true // 타입 정의 파일 생성
    }),

    renderer()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4242
  },
  build: {
    rollupOptions: {
      external: ['pg', 'pg-native']
    }
  },
  optimizeDeps: {
    exclude: ['pg', 'pg-native']
  }
});
