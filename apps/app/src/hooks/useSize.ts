/**
 * 获取设备尺寸信息
 */
export function useSize() {
  const systemInfo = ref<UniApp.GetSystemInfoResult>()!
  const screenWidth = computed(() => systemInfo.value?.screenWidth || 0)
  const screenHeight = computed(() => systemInfo.value?.screenHeight || 0)
  const drp = computed(() => systemInfo.value?.devicePixelRatio || 1)

  const toPx = function (value: number) {
    return drp.value * value
  }

  onReady(function () {
    systemInfo.value = uni.getSystemInfoSync()
  })

  return {
    toPx,
    drp,
    screenWidth,
    screenHeight
  }
}
