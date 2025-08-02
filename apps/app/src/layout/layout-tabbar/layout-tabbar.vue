<template lang="pug">
  wd-tabbar(v-model="current" fixed safe-area-inset-bottom placeholder @change="tabChange")
    wd-tabbar-item(title="首页" icon="home" :name="Tab.home")
    wd-tabbar-item(title="我的" icon="user" :name="Tab.user")
</template>

<script setup lang="ts">
defineOptions({ name: 'layout-tabbar' })

interface Props {
  current?: number
}

enum Tab {
  home,
  user
}

const props = withDefaults(defineProps<Props>(), { current: 0 })
const current = ref(props.current)

function tabChange(val: { value: Tab }) {
  switch (val.value) {
    case Tab.home:
      uni.redirectTo({ url: '/pages/module_a/home/index' })
      break
    case Tab.user:
      uni.redirectTo({ url: '/pages/module_b/user/index' })
      break
  }
}
</script>
