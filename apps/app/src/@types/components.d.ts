export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    ATitle: typeof import('@/components/a-input/a-input.vue').default
    AButtonGroup: typeof import('@/components/a-button-group/a-button-group.vue').default
  }
}
