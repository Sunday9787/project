import path from 'node:path'

import Uni from '@dcloudio/vite-plugin-uni'
import pxToViewport from 'postcss-px-to-viewport-8-plugin'
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
  css: {
    postcss: {
      plugins: [
        pxToViewport({
          unitToConvert: 'px', // 需要转换的单位
          viewportWidth: 375, // 设计稿的视口宽度
          unitPrecision: 5, // 转换后的精度
          propList: ['*'], // 指定需要转换的属性，*代表全部属性
          viewportUnit: 'vw', // 指定需要转换成的视口单位
          fontViewportUnit: 'vw', // 字体使用的视口单位
          selectorBlackList: [], // 选择器黑名单，不需要转换的选择器
          minPixelValue: 1, // 小于或等于1px不转换
          mediaQuery: false, // 允许在媒体查询中转换px
          replace: true, // 是否直接更换属性值，而不添加备用属性
          exclude: /node_modules/ // 设置忽略文件，用正则表达式
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
