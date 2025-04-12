import { useSize } from '@/hooks/useSize'

export function useScale() {
  let baseSize = 0
  const { drp } = useSize()

  const toPx = function (value: number) {
    return Math.floor((baseSize / 750) * drp.value * value)
  }

  const setBaseSize = function (value: number) {
    baseSize = value
  }

  return {
    setBaseSize,
    toPx
  }
}
