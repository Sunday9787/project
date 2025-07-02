import { DashboardRound } from '@vicons/material'
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

export const systemRoute: RouteRecordRaw = {
  path: '/system',
  name: 'PageSystem',
  component: Layout,
  redirect: '/system/config',
  meta: { title: '系统配置', icon: DashboardRound, noShowingChildren: true },
  children: [
    {
      path: 'config',
      name: 'PageSystemConfig',
      meta: { activeMenu: '/', title: '系统配置' },
      component: () => import(/* webpackChunkName: "PageSystemConfig" */ '@/views/system/config.vue')
    }
  ]
}
