import path from 'node:path'

import Uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import vuePugPlugin from 'vue-pug-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Uni({
      vueOptions: {
        template: {
          preprocessOptions: {
            plugins: [vuePugPlugin]
          }
        }
      }
    }),
    AutoImport({
      dts: './src/@types/auto-imports.d.ts',
      imports: ['vue', 'uni-app']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
