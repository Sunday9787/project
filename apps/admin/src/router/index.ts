import { createRouter, createWebHistory } from 'vue-router'

import ErrorView from '@/views/error/index.vue'

import { dashboardRoute } from './modules/dashboard'
import { projectRoute } from './modules/projectModule'
import { systemRoute } from './modules/system'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'PageWorkplace', meta: { hidden: true }, redirect: '/dashboard/workplace' },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/workbench',
      component: () => import('@/views/workbench/index.vue')
    },
    dashboardRoute,
    projectRoute,
    systemRoute,
    { path: '/403', name: 'Page403', meta: { hidden: true }, props: { status: 403 }, component: ErrorView },
    { path: '/404', name: 'Page404', meta: { hidden: true }, props: { status: 404 }, component: ErrorView },
    { path: '/:catchAll(.*)', redirect: '/404', meta: { hidden: true } }
  ]
})

export default router
