import type { ShallowRef } from 'vue'
import type { UploadInstance } from 'wot-design-uni/components/wd-upload/types'

import { useLoading } from '@/hooks/useLoading'
import { SurveyEntity, SurveyItemEntity } from '@/service/survey.entity'

export function useSurvey(props: Utils.ActionProps): Ref<SurveyEntity> {
  const form = ref(new SurveyEntity(Number(props.id)))

  if (props.type !== 'add') {
    form.value.data().then(function (response) {
      form.value = response
      if (form.value.building_img) {
        form.value.buildingImg = [{ url: response.building_img, uid: Date.now() }]
      }

      if (form.value.owner_signature_img) {
        form.value.ownerSignatureImg = [{ url: response.owner_signature_img, uid: Date.now() + 1 }]
      }
    })
  }

  return form
}

export function useSurveyList(props: Utils.ActionProps) {
  const data = ref<SurveyItemEntity[]>([])

  const { loading, refresh } = useLoading(async function () {
    data.value = await SurveyItemEntity.list(Number(props.id))
  })

  return {
    data,
    loading,
    refresh
  }
}

export interface Props {
  id: string
  /** 勘察id */
  survey_id: string
  type: Utils.ActionType
}

export function useSurveyItem(props: Props) {
  const data = ref(new SurveyItemEntity(Number(props.survey_id)))

  if (props.type !== 'add') {
    SurveyItemEntity.detail(Number(props.id)).then(function (response) {
      data.value = response
      data.value.images = [{ uid: Date.now(), url: response.img }]
    })
  }

  return data
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
