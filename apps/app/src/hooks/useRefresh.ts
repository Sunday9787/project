type CallBack = () => void

export function useRefresh(key = 'refresh', callback: CallBack) {
  const value = uni.getStorageSync<'need' | 'no'>(key)

  onShow(function () {
    if (value === 'need') callback()
  })
}
