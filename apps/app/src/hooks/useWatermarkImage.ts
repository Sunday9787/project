import dayjs from 'dayjs'

import { useScale } from './useScale'

export interface WatermarkImageData {
  location: string
  owner: string
}

const weekDayMap = ['日', '一', '二', '三', '四', '五', '六'] as const

/**
 * 根据图片生成水印图片
 * @param id canvas-id
 */
export function useWatermarkImage(id: string) {
  const ctx = ref<UniApp.CanvasContext>()
  const week = ref<string>()
  const date = ref<string>()

  const scale = useScale()
  const canvasWidth = ref(0)
  const canvasHeight = ref(0)

  const imageSize = async function (filePath: string) {
    const result = await uni.getImageInfo({ src: filePath })
    return {
      width: result.width,
      height: result.height
    }
  }

  const create = async function <T extends WatermarkImageData>(filePath: string, data: T) {
    if (!ctx.value) {
      throw new Error('canvas 实例不存在')
    }

    const size = await imageSize(filePath)
    scale.setBaseSize(size.width)
    // 更新画布尺寸
    canvasWidth.value = size.width
    canvasHeight.value = size.height

    // !更新画布尺寸后必须要 等待下一次事件循环
    await nextTick()

    const time = dayjs()
    week.value = weekDayMap.at(time.get('day'))!
    date.value = time.format('YYYY/MM/DD HH:mm:ss')

    ctx.value.fillStyle = '#ffffff'
    ctx.value.setFontSize(scale.toPx(14))
    ctx.value.setTextBaseline('bottom')

    console.log('绘制背景图片', filePath)
    // 绘制背景图片
    ctx.value.drawImage(filePath, 0, 0, canvasWidth.value, canvasHeight.value)
    // 绘制时间
    ctx.value.fillText('时间:' + date.value, scale.toPx(20), canvasHeight.value - scale.toPx(65))
    // 绘制户主
    ctx.value.fillText('户主:' + data.owner, scale.toPx(20), canvasHeight.value - scale.toPx(100))
    ctx.value.fillText('地点:' + data.location, scale.toPx(20), canvasHeight.value - scale.toPx(140))
    ctx.value.save()
    ctx.value.draw()

    return uni.canvasToTempFilePath({ canvasId: id, quality: 1 })
  }

  onReady(async function () {
    ctx.value = uni.createCanvasContext(id)
  })

  return {
    canvasHeight,
    canvasWidth,
    create
  }
}
