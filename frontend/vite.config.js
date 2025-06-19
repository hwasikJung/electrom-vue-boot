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
      plugins: ['Dialog', 'Notify']
    }),
    electron([
      {
        entry: 'electron/index.js',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: [
                'pg',
                'sequelize',
                'pg-hstore',
                'fs',
                'path',
                'child_process'
              ]
            }
          }
        }
      },
      {
        entry: 'electron/preload.js',
        onstart: () => {
          console.log('[vite:electron] Preload script built');
        },
        vite: {
          build: {
            outDir: 'dist-electron'
          }
        }
      }
    ]),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'quasar'],
      dts: true,
      eslintrc: {
        enabled: true,
        filepath: '.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
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
