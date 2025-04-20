/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_BASE_API: string
    readonly VITE_APP_RESOURCE_DOMAIN: string
    readonly VITE_APP_ENV: 'development' | 'production'
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
