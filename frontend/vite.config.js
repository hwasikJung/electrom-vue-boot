import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      // sassVariables 옵션 제거
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
    renderer()
  ],

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
