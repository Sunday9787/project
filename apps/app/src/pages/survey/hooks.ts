import { AMapWX } from '@repo/amap/wx'
import dayjs from 'dayjs'
import type { ShallowRef } from 'vue'
import type { UploadInstance } from 'wot-design-uni/components/wd-upload/types'

import { useSize } from '@/hooks/useSize'
import { SurveyEntity } from '@/service/survey.entity'

const weekDayMap = ['日', '一', '二', '三', '四', '五', '六'] as const

export function useSurvey(props: Utils.ActionProps): Ref<SurveyEntity> {
  const form = ref(new SurveyEntity(props.id))

  if (props.type !== 'add') {
    form.value.data().then(function (response) {
      form.value = response
    })
  }

  return form
}

function useScale() {
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

/**
 * 根据图片生成水印图片
 * @param id canvas-id
 */
export function useWatermarkImage(id: string) {
  const ctx = ref<UniApp.CanvasContext>()
  const week = ref<string>()
  const date = ref<string>()
  const address = ref<string>()

  const scale = useScale()
  const canvasWidth = ref(0)
  const canvasHeight = ref(0)
  // #ifdef MP-WEIXIN
  const amap = shallowRef(new AMapWX({ key: 'e36b65b7e1705b409dc4ef5f720e82e7' }))
  // #endif

  const imageSize = async function (filePath: string) {
    const result = await uni.getImageInfo({ src: filePath })
    return {
      width: result.width,
      height: result.height
    }
  }

  const create = async function (filePath: string, data: SurveyEntity) {
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
    ctx.value.save()
    ctx.value.draw()

    return uni.canvasToTempFilePath({ canvasId: id, quality: 1 })
  }

  onReady(async function () {
    ctx.value = uni.createCanvasContext(id)
    // #ifdef MP-WEIXIN
    const { longitude, latitude } = await uni.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      geocode: true
    })

    amap.value.getRegeo({
      location: `${longitude},${latitude}`,
      success(result) {
        if (!result.length) {
          throw new Error('未获取到地址信息')
        }

        const value = result.at(0)!
        address.value = value.name
      }
    })
    // #endif
  })

  return {
    canvasHeight,
    canvasWidth,
    create
  }
}

interface UploadInst {
  uploader: ShallowRef<UploadInstance | undefined>
  img: 'buildingImg' | 'propertyCertificateImg' | 'ownerSignatureImg' | 'propertyPlanImg'
  field: 'building_img' | 'property_certificate_img' | 'owner_signature_img' | 'property_plan_img'
}

export enum ChooseImageType {
  building,
  property_certificate,
  property_plan,
  owner_signature
}

export function useUpload() {
  const ownerSignatureImgUploader = shallowRef<UploadInstance>()
  const buildingImgUploader = shallowRef<UploadInstance>()
  const propertyPlanUploader = shallowRef<UploadInstance>()
  const propertyCertificateUploader = shallowRef<UploadInstance>()

  const currentUpload = function (type: ChooseImageType): UploadInst {
    switch (type) {
      case ChooseImageType.building:
        return {
          uploader: buildingImgUploader,
          img: 'buildingImg',
          field: 'building_img'
        }
      case ChooseImageType.property_certificate:
        return {
          uploader: propertyCertificateUploader,
          img: 'buildingImg',
          field: 'property_certificate_img'
        }
      case ChooseImageType.property_plan:
        return {
          uploader: propertyPlanUploader,
          img: 'buildingImg',
          field: 'building_img'
        }
      case ChooseImageType.owner_signature:
        return {
          uploader: ownerSignatureImgUploader,
          img: 'ownerSignatureImg',
          field: 'owner_signature_img'
        }
    }
  }

  return {
    currentUpload,
    buildingImgUploader,
    propertyPlanUploader,
    ownerSignatureImgUploader,
    propertyCertificateUploader
  }
}
