<template lang="pug">
view.page-view
  view.scroll-view
    wd-form(:model="form" ref="formRef")
      wd-cell-group(border)
        wd-input(
          label="受损部位"
          label-width="250rpx"
          prop="damaged_part"
          v-model="form.damaged_part"
          :rules="[{ required: true, message: '请输入受损部位' }]")

        wd-cell(title-width="250rpx" title="受损部位勘察图" prop="img" :rules="[{ required: true, message: '请上传受损部位勘察图' }]")
          wd-button(size="small" type="info" @click="chooseImage") 选择图片
          wd-upload(
            ref="uploaderRef"
            :file-list="form.images"
            :build-form-data="(option) => form.buildFormData(option)"
            :action="host"
            :limit="1"
            disabled
            image-mode="aspectFill"
            @success="uploadFileSuccess")

        wd-textarea(
          label="完损情况描述"
          label-width="250rpx"
          prop="desc"
          v-model="form.desc"
          :rules="[{ required: true, message: '请输入完损情况描述' }]")

        wd-textarea(
          label="备注"
          label-width="250rpx"
          prop="remark"
          v-model="form.remark")

  view.view-container
    wd-button(type="primary" block @click="submit()") {{ buttonText }}

canvas(canvas-id="canvas" id="canvas" hidpi :style="canvasStyle")
</template>

<script lang="ts" setup>
import type { StyleValue } from 'vue'
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import type { UploadInstance, UploadSuccessEvent } from 'wot-design-uni/components/wd-upload/types'

import { useWatermarkImage } from '@/hooks/useWatermarkImage'
import type { SurveyItemEntity } from '@/service/survey.entity'
import type { OSSFormData } from '@/service/upload.service'
import { useCacheModule } from '@/store/cache'

import { type Props, useSurveyItem } from './hooks'

const props = defineProps<Props>()
const cacheModule = useCacheModule()
const host = computed(function () {
  if (!cacheModule.oss) {
    return ''
  }

  return 'https:' + cacheModule.oss.host
})

const form = useSurveyItem(props)
const formRef = shallowRef<FormInstance>()
const uploaderRef = shallowRef<UploadInstance>()
const watermarkImage = useWatermarkImage('canvas')
const canvasStyle = computed<StyleValue>(function () {
  return {
    zIndex: '-1',
    position: 'fixed',
    top: '-999px',
    left: '-999px',
    height: watermarkImage.canvasHeight.value + 'px',
    width: watermarkImage.canvasWidth.value + 'px'
  }
})
const buttonText = computed(function () {
  return props.type === 'add' ? '提交&继续新增勘察' : '保存&继续新增勘察'
})

onLoad(function () {
  const title = props.type === 'edit' ? '编辑调查项' : '创建调查项'
  uni.setNavigationBarTitle({ title })
  uni.removeStorageSync('survey:item:refresh')
})

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera'],
    async success(result) {
      const tempFilePath = result.tempFilePaths.at(0)
      if (!tempFilePath) {
        throw new Error('未获取到图片')
      }

      const image = await uni.getImageInfo({ src: tempFilePath })

      // 先压缩图片
      const compressImage = await uni.compressImage({
        src: image.path,
        quality: 0.7,
        width: image.width + 'px',
        height: image.height + 'px',
        compressedWidth: image.width * 0.7,
        compressedHeight: image.height * 0.7
      })

      const owner = uni.getStorageSync<string>('owner')
      const location = uni.getStorageSync<string>('location')

      // 添加水印
      const img = await watermarkImage.create(compressImage.tempFilePath, { owner, location })
      form.value.images = [{ uid: Date.now(), url: img.tempFilePath, status: 'pending' }]

      nextTick(function () {
        if (!uploaderRef.value) {
          throw new Error('未找到上传控件实例')
        }

        uploaderRef.value.submit()
      })
    }
  })
}

function uploadFileSuccess(value: UploadSuccessEvent) {
  const formData = value.formData as OSSFormData
  const ossUrl = [host.value, formData.key].join('/')

  form.value.img = ossUrl
}

function reset(instance: SurveyItemEntity) {
  instance.survey_id = Number(props.survey_id)
  instance.images.splice(0)
  instance.img = ''
  instance.id = 0
  instance.remark = ''
  instance.desc = ''
  instance.damaged_part = ''
  uni.setNavigationBarTitle({ title: '创建调查项' })
}

async function submit() {
  if (!formRef.value) {
    throw new Error('未找到form实例')
  }

  const result = await formRef.value.validate()

  if (result.valid) {
    await form.value.save()
    formRef.value.reset()
    reset(form.value)

    uni.setStorageSync('survey:item:refresh', 'need')
  }
}
</script>
