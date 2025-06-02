import 'reflect-metadata'
import 'virtual:svg-icons-register'
import './router/permissions'
import './styles/index.less'

import log from '@sunday9787/log'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(store)
app.use(router)

log(env.ENV, 'env')
log(env.BUILD, 'build')
log(env.PLATFORM, 'platform')
log(env.VERSION, 'version')

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.mount('#app')
