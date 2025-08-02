/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    AScrollView: typeof import('@/components/a-scroll-view/a-scroll-view.vue').default
    LayoutTabbar: typeof import('@/layout/layout-tabbar/layout-tabbar.vue').default
    ACard: typeof import('@/components/a-card/a-card.vue').default
  }
}

export {}
