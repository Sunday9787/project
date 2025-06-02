import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dayjs from 'dayjs'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vuePugPlugin from 'vue-pug-plugin'

import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig(function (env) {
  const data = loadEnv(env.mode, process.cwd())

  return {
    server: {
      host: data.VITE_APP_DOMAIN,
      port: 9787
    },
    define: {
      'env.ENV': JSON.stringify(env.mode),
      'env.BUILD': JSON.stringify(dayjs().format('YYYY-M-D HH:mm:ss')),
      'env.PLATFORM': JSON.stringify(os.platform()),
      'env.VERSION': JSON.stringify(pkg.version)
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    plugins: [
      vue({
        template: {
          preprocessOptions: {
            plugins: [vuePugPlugin]
          }
        }
      }),
      vueJsx(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data
        },
        entry: '/src/main.ts',
        template: 'index.html'
      }),
      AutoImport({
        dts: './src/@types/auto-imports.d.ts',
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        extensions: ['vue', 'tsx', 'jsx', 'ts'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/],
        dts: './src/@types/components.d.ts',
        exclude: ['./src/components/index.ts'],
        resolvers: [NaiveUiResolver()]
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.join(process.cwd(), 'src/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  }
})
