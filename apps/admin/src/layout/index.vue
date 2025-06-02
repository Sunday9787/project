<template lang="pug">
n-layout(has-sider style="height: inherit")
  LayoutSider

  n-layout
    LayoutHeader

    LayoutTagsView

    n-layout-content(:style="layoutStyle" contentClass="layout-content" :native-scrollbar="false")
      router-view(v-slot="{ Component, route }" )
        transition(name="fade-transform" mode="out-in")
          component(:is="Component" :key="route.path")

  UseDraggable.fixed.z-50(
    storage-key="vueuse-draggable"
    storage-type="session"
    :initial-value="draggableInitial")
    div(@dblclick="drawerShow = true")
      n-affix
        n-button(type="primary")
          n-icon(:size="25")
            DisplaySettingsFilled

  n-drawer(v-model:show="drawerShow")
    n-drawer-content(title="系统配置")
      n-space(justify="space-between" align="center")
        label 缓存
        //- n-button(size="small" type='info' :loading="cacheModule.loading" @click="refresh()") 刷新缓存
</template>

<script lang="ts" setup>
import { DisplaySettingsFilled } from '@vicons/material'
import { UseDraggable } from '@vueuse/components'
import type { CSSProperties } from 'vue'

import LayoutHeader from './layout-header.vue'
import LayoutSider from './layout-sider'
import LayoutTagsView from './layout-tags-view.vue'

defineOptions({ name: 'PageLayout' })

// const message = useMessage()
const drawerShow = ref(false)
const draggableInitial = computed(function () {
  return { x: window.innerWidth - 80, y: window.innerHeight / 2 }
})
const layoutStyle: CSSProperties = { height: 'calc(100% - 46px - 60px)' }

onMounted(function () {
  window.$message = useMessage()
})

// async function refresh() {
//   message.success('刷新成功')
// }
</script>

<style lang="less">
.layout-content {
  height: 100%;
  padding: 24px;
  background-color: var(--color-background);
}

.layout-affix {
  position: fixed;
  top: 50%;
  right: 20px;
  z-index: 99;
}
</style>
