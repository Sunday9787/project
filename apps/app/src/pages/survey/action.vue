<template lang="pug">
view.page-view.scroll-y
  a-title(title="入户勘察")

  wd-form(:model="form" ref="fromInst")
    wd-cell-group(border)
      wd-input(
        label="房主"
        prop="owner"
        v-model.trim="form.owner"
        placeholder="请输入房主姓名"
        clearable
        :rules="[{ required: true, message: '请输入房主姓名' }]")
      wd-input(
        label="身份证号"
        prop="id_card"
        v-model.trim="form.id_card"
        placeholder="请输入房主身份证号"
        clearable
        :rules="[{ required: true, message: '请输入房主身份证号' }]")
      wd-input(
        label="房屋坐落"
        prop="location"
        v-model.trim="form.location"
        placeholder="请输入房屋坐落位置"
        clearable
        :rules="[{ required: true, message: '请输入房屋坐落位置' }]")
      wd-cell(title="爆破距离(米)" prop="distance" :rules="[{ required: true, message: '请输入爆破距离' }]")
        wd-input-number(v-model="form.distance" input-width="50px" :min="1")
      wd-picker(
        label="房屋结构类型"
        v-model="form.structure_type"
        prop="structure_type"
        :columns="SurveyEntity.structureTypeOptions"
        :rules="[{ required: true, message: '请选择房屋结构类型' }]")
        wd-cell(title="房屋层数" prop="number_of_floors")
          wd-input-number(v-model="form.number_of_floors" input-width="50px" :min="1")
      wd-picker(
        label="房屋用途"
        v-model="form.purpose_house"
        prop="purpose_house"
        :columns="SurveyEntity.purposeHouseOptions"
        :rules="[{ required: true, message: '请选择房屋用途' }]")
      wd-calendar(
        :min-date="minDate"
        :max-date="Date.now()"
        :displayFormat="displayFormat"
        v-model="form.building_construction_date"
        prop="building_construction_date"
        type="month"
        label="房屋建成年份")
      wd-cell(title="建筑面积(平方米)" prop="building_area")
        wd-input-number(v-model="form.building_area" input-width="50px" :min="1")
      wd-cell(title-width="200rpx" title="房屋主图" prop="building_img" :rules="[{ required: true, message: '请上传房屋主图' }]")
        wd-button(size="small" type="info" @click="chooseImage(ChooseImageType.building)") 选择图片
        wd-upload(
          ref="buildingImgUploader"
          :file-list="form.buildingImg"
          :build-form-data="(option) => form.buildFormData(option)"
          :action="host"
          :limit="1"
          disabled
          image-mode="aspectFill"
          @success="(value) => uploadFileSuccess(ChooseImageType.building, value)")

      wd-cell(title-width="200rpx" title="客户签名" prop="owner_signature_img" :rules="[{ required: true, message: '请上传房屋主图' }]")
        wd-button(size="small" type="info" @click="chooseImage(ChooseImageType.owner_signature)") 选择图片
        wd-upload(
          ref="ownerSignatureImgUploader"
          :file-list="form.ownerSignatureImg"
          :build-form-data="(option) => form.buildFormData(option)"
          :action="host"
          :limit="1"
          disabled
          image-mode="aspectFill"
          @success="(value) => uploadFileSuccess(ChooseImageType.owner_signature, value)")

      wd-cell(title-width="200rpx" title="房产证图" prop="property_certificate_img")
        wd-button(size="small" type="info" @click="chooseImage(ChooseImageType.property_certificate)") 选择图片
        wd-upload(
          ref="propertyCertificateUploader"
          :file-list="form.propertyCertificateImg"
          :build-form-data="(option) => form.buildFormData(option)"
          :action="host"
          :limit="1"
          disabled
          image-mode="aspectFill"
          @success="(value) => uploadFileSuccess(ChooseImageType.property_certificate, value)")

      wd-cell(title-width="200rpx" title="平面图" prop="property_plan_img")
        wd-button(size="small" type="info" @click="chooseImage(ChooseImageType.property_plan)") 选择图片
        wd-upload(
          ref="propertyPlanUploader"
          :file-list="form.propertyPlanImg"
          :build-form-data="(option) => form.buildFormData(option)"
          :action="host"
          :limit="1"
          disabled
          image-mode="aspectFill"
          @success="(value) => uploadFileSuccess(ChooseImageType.property_plan, value)")

  view.page-footer
    wd-button(type="success" size="small" block @click="submit()") 确认勘察

canvas(canvas-id="canvas" id="canvas" hidpi :style="canvasStyle")
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { StyleValue } from 'vue'
import type { CalendarType } from 'wot-design-uni/components/wd-calendar-view/types'
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'
import type { UploadSuccessEvent } from 'wot-design-uni/components/wd-upload/types'

import { SurveyEntity } from '@/service/survey.entity'
import { OSSFormData } from '@/service/upload.service'
import { useCacheModule } from '@/store/cache'

import { ChooseImageType, useSurvey, useUpload, useWatermarkImage } from './hooks'

interface Props {
  id: string
  type: Utils.ActionType
}

const cacheModule = useCacheModule()
const host = computed(function () {
  if (!cacheModule.oss) {
    return ''
  }

  return 'https:' + cacheModule.oss.host
})
const minDate = dayjs().subtract(70, 'year').valueOf()
const props = defineProps<Props>()
const fromInst = ref<FormInstance>()
const form = useSurvey(props)

const {
  buildingImgUploader,
  ownerSignatureImgUploader,
  propertyPlanUploader,
  propertyCertificateUploader,
  currentUpload
} = useUpload()
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

function displayFormat(value: number | number[], type: CalendarType) {
  console.log(type)
  if (Array.isArray(value)) {
    return `${dayjs(value[0]).format('YYYY-MM')} - ${dayjs(value[1]).format('YYYY-MM')}`
  }

  return dayjs(value).format('YYYY年/MM月')
}

function uploadFileSuccess(action: ChooseImageType, value: UploadSuccessEvent) {
  const formData = value.formData as OSSFormData
  const ossUrl = [host.value, formData.key].join('/')
  const upload = currentUpload(action)

  form.value[upload.field] = ossUrl
}

function chooseImage(action: ChooseImageType) {
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

      // 添加水印
      const img = await watermarkImage.create(compressImage.tempFilePath, form.value)
      const uploadInst = currentUpload(action)
      form.value[uploadInst.img] = [{ uid: Date.now(), url: img.tempFilePath, status: 'pending' }]

      nextTick(function () {
        if (!uploadInst.uploader.value) {
          throw new Error('uploadInst 实例不存在')
        }

        uploadInst.uploader.value.submit()
      })
    },
    fail() {
      console.error('选择图片失败')
    }
  })
}

function init() {
  if (form.value.building_img) {
  }
}

async function submit() {
  if (!fromInst.value) {
    throw new Error('未找到from实例')
  }

  const result = await fromInst.value.validate()
  if (result.valid) {
    // 将图片挂载到实体
    const id = await form.value.save()
    uni.navigateTo({ url: `/pages/survey/index?id=${id}&type=add` })
  }
}

onReady(init)
</script>

<style lang="scss">
.survey-image {
  width: 500rpx;
  height: 375rpx;
  aspect-ratio: 4 / 3;
}
</style>
