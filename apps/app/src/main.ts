import 'reflect-metadata'

// #ifdef H5
import VConsole from 'vconsole'
// #endif
import { createSSRApp } from 'vue'

import App from './App.vue'
import store from './store'

// #ifdef H5
if (import.meta.env.DEV) {
  new VConsole()
}
// #endif

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)

  return {
    app
  }
}
