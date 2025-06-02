interface Env {
  ENV: string
  BUILD: string
  PLATFORM: string
  VERSION: string
}

declare const env: Env

interface Window {
  $message: import('naive-ui').MessageApi
}

declare module 'vue-pug-plugin'
