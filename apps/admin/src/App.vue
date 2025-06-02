<template lang="pug">
n-config-provider(
  :breakpoints="{ sm: 640, m: 768, lg: 1024, xl: 1280, xxl: 1536 }"
  :locale="zhCN"
  :theme="theme"
  :theme-overrides="themeOverride"
  style="height: inherit")
  n-dialog-provider
    n-message-provider
      RouterView
</template>

<script lang="ts" setup>
import { usePreferredColorScheme } from '@vueuse/core'
import { darkTheme, type GlobalThemeOverrides, lightTheme, zhCN } from 'naive-ui'

import { globalChannel } from '@/utils/constant'

import { type ThemeMode, useSystemModule } from './store/modules/system'
import { emitter } from './utils/eventBus'

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2F318B'
  },
  Typography: {
    headerMargin3: '16px 0',
    headerMargin4: '0'
  }
}

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2F318B'
  },
  Typography: {
    headerMargin3: '16px 0',
    headerMargin4: '0'
  }
}
const systemModule = useSystemModule()
const colorScheme = usePreferredColorScheme()

const themeOverride = computed(function () {
  return systemModule.theme.mode === 'light' ? lightThemeOverrides : darkThemeOverrides
})

const theme = computed(function () {
  if (systemModule.theme.mode === 'light') {
    return lightTheme
  }

  return darkTheme
})

watch(
  () => colorScheme.value,
  function (value) {
    if (colorScheme.value !== 'no-preference') {
      systemModule.CHANGE_THEME(value as ThemeMode)
    }
  }
)

emitter.on(globalChannel.systemThemeChange, function () {
  document.documentElement.setAttribute('data-theme', systemModule.theme.mode)
})
</script>
