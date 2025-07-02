<template lang="pug">
.sidebar-logo-container
  transition(name="sidebarLogoFade")
    router-link.sidebar-logo-link(to='/' v-if="collapse" key="collapse")
      h1 Project
    router-link.sidebar-logo-link(to='/' key="expand" v-else)
      img.sidebar-logo(:src="logo")

</template>

<script lang="ts" setup>
interface Props {
  collapse: boolean
  theme: 'light' | 'dark'
}

const props = defineProps<Props>()
const logo = computed(function () {
  return props.theme === 'light' ? '//dummyimage.com/240x60' : '//dummyimage.com/240x60'
})
</script>

<style lang="less">
.sidebar-logo {
  aspect-ratio: 4 / 1;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  overflow: hidden;
  line-height: 60px;
  text-align: center;
  background-color: var(--color-logo-background);

  & .sidebar-logo-link {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 18px;
    font-weight: bold;
    color: #fff;

    & .sidebar-logo {
      display: inline-block;
      width: 70%;
      padding: 0 15px;
    }
  }

  &.collapse {
    .sidebar-logo {
      padding: 0 10px;
      margin-right: 0;
    }
  }
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
