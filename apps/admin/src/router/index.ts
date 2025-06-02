import { createRouter, createWebHistory } from 'vue-router'

import { dashboardRoute } from './modules/dashboard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    dashboardRoute
  ]
})

export default router
