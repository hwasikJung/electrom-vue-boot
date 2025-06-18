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
      ),
      plugins: ['Dialog', 'Notify'] // Dialog 플러그인 추가
    }),
    electron([
      {
        // 메인 프로세스 설정
        entry: 'electron/index.js',
        vite: {
          build: {
            rollupOptions: {
              external: ['pg', 'sequelize', 'pg-hstore']
            }
          }
        }
      },
      {
        // Preload 스크립트 설정
        entry: 'electron/preload.js',
        onstart: () => {
          // preload 스크립트가 빌드될 때 알림
          console.log('[vite:electron] Preload script built');
        },
        vite: {
          build: {
            sourcemap: 'inline',
            outDir: 'dist-electron'
          }
        }
      }
    ]),
    // Vue Composition API 함수들 자동 임포트
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'quasar'],
      dts: true,
      eslintrc: {
        enabled: true,
        filepath: '.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    // Vue 컴포넌트들 자동 임포트
    Components({
      resolvers: [QuasarResolver()],
      dirs: [
        'src/components',
        'src/layout/components',
        'src/shared/components',
        'src/modules/**/components',
        'src/modules/**/views'
      ],
      dts: true
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
