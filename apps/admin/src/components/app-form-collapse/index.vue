<template lang="pug">
n-space.app-form-collapse(:style="collapseStyle" :wrap-item="false")
  .app-form-collapse__content
    slot

  .app-form-collapse__action
    n-space
      slot(name="action")

    transition(name="fade")
      n-el(v-show="showToggleCollapse")
        n-text(class="flex items-center gap-x-1" style="height: var(--height-medium)" tag="a" size="small" href="javascript:;" @click="toggleCollapse()")
          n-icon(size="20")
            KeyboardArrowUpFilled(v-if="open")
            KeyboardArrowDownFilled
          | {{ text }}
</template>

<script lang="ts" setup>
import { KeyboardArrowDownFilled, KeyboardArrowUpFilled } from '@vicons/material'
import { debounce } from 'lodash-es'

import { useSystemModule } from '@/store/modules/system'

defineOptions({ name: 'AppFormCollapse' })

function useFormCollapse(height: number) {
  const maxHeight = ref(height)
  const open = ref(false)
  const vm = getCurrentInstance()?.proxy
  const resizeHandle = debounce(function (e?: UIEvent) {
    setTimeout(function () {
      maxHeight.value = vm?.$el.scrollHeight
    }, 210)
    if (e) open.value = false
  })

  onMounted(resizeHandle)
  onBeforeUnmount(function () {
    window.removeEventListener('resize', resizeHandle)
  })

  window.addEventListener('resize', resizeHandle)

  return { maxHeight, open }
}

interface Props {
  visible?: boolean
  height?: number
}

const props = withDefaults(defineProps<Props>(), { height: 35, visible: false })
const { maxHeight, open } = useFormCollapse(props.height)
const systemModule = useSystemModule()

systemModule.$subscribe(function (mutation) {
  if (!Array.isArray(mutation.events)) {
    mutation.events.key === 'collapse'
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 300)
  }
})

const emit = defineEmits<{ change: [boolean] }>()

const text = computed(function () {
  return open.value ? '收起' : '展开'
})

const collapseStyle = computed(function () {
  return {
    height: open.value ? maxHeight.value + 'px' : props.height + 'px'
  }
})

const showToggleCollapse = computed(function () {
  return props.height < maxHeight.value
})

function toggleCollapse() {
  open.value = !open.value
  emit('change', open.value)
}

watch(
  () => props.visible,
  function (val) {
    if (maxHeight.value) return
    if (val) window.dispatchEvent(new Event('resize'))
  }
)
</script>

<style lang="less">
@width: 190px;

.app-form-collapse {
  position: relative;
  width: 100%;
  padding-right: @width;
  overflow: hidden;
  transition-duration: 0.2s;
}

.app-form-collapse__content {
  position: relative;
  width: 100%;
}

.app-form-collapse__action {
  position: absolute;
  right: 0;

  @apply flex;
  @apply items-start;

  column-gap: 5px;
  width: @width;
  height: 100%;
}
</style>
