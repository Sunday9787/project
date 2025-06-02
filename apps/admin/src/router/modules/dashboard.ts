import { DashboardRound } from '@vicons/material'
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

export const dashboardRoute: RouteRecordRaw = {
  path: '/dashboard',
  name: 'PageDashboard',
  component: Layout,
  redirect: '/dashboard/workplace',
  meta: { title: '工作台', icon: DashboardRound, noShowingChildren: true },
  children: [
    {
      path: 'workplace',
      name: 'PageDashboardWorkplace',
      meta: { activeMenu: '/', title: 'Workplace' },
      component: () => import(/* webpackChunkName: "workplace" */ '@/views/dashboard/workplace/index.vue')
    }
  ]
}
