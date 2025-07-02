import { DashboardRound } from '@vicons/material'
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

export const projectRoute: RouteRecordRaw = {
  path: '/project',
  name: 'PageProject',
  component: Layout,
  redirect: '/project/list',
  meta: { title: '项目管理', icon: DashboardRound, noShowingChildren: true },
  children: [
    {
      path: 'list',
      name: 'PageProjectList',
      meta: { activeMenu: '/', title: '项目列表' },
      component: () => import('@/views/project/list/index.vue')
    },
    {
      path: 'detail/:id(\\d+)',
      name: 'RouteProjectDetail',
      meta: { title: '项目详情' },
      props: route => ({ id: Number(route.params.id) }),
      component: () => import('@/views/project/detail/index.vue')
    }
  ]
}
