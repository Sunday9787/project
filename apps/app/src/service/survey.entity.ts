import { AbstractEntity, SurveyPurposeHouse, SurveyStatus, SurveyStructure } from '@repo/service'
import { Expose } from 'class-transformer'
import type { UploadBuildFormDataOption } from 'wot-design-uni/components/wd-upload/types'
import type { UploadFile } from 'wot-design-uni/components/wd-upload/types'

import { BaseEntity } from '@/class/base.entity'

import { SurveyItemService, SurveyService } from './survey.service'
import { UploadService } from './upload.service'

type StatusMap = { text: string; type: Utils.StatusType }

export class SurveyItemQueryEntity {
  keyword: string
}

const uploadService = new UploadService()

/**
 * SurveyDTO
 */
export class SurveyEntity extends BaseEntity implements Service.ResponseSurveyDTO {
  static readonly statusMap = new Map<SurveyStatus, StatusMap>([
    [SurveyStatus.complete, { text: '保全完成', type: 'success' }],
    [SurveyStatus.pending, { text: '保全中', type: 'default' }],
    [SurveyStatus.start, { text: '未保全', type: 'warning' }]
  ])

  static readonly structureTypeMap = new Map<SurveyStructure, { label: string; value: SurveyStructure }>([
    [
      SurveyStructure.castInPlaceFrameStructure,
      { label: '现浇框架结构', value: SurveyStructure.castInPlaceFrameStructure }
    ],
    [SurveyStructure.steelConcreteStructure, { label: '钢混结构', value: SurveyStructure.steelConcreteStructure }],
    [SurveyStructure.brickConcreteStructure, { label: '砖混结构', value: SurveyStructure.brickConcreteStructure }]
  ])

  static readonly purposeHouseMap = new Map<SurveyPurposeHouse, { label: string; value: SurveyPurposeHouse }>([
    [SurveyPurposeHouse.plant, { label: '仓房', value: SurveyPurposeHouse.plant }],
    [SurveyPurposeHouse.warehouse, { label: '仓库', value: SurveyPurposeHouse.warehouse }],
    [SurveyPurposeHouse.business, { label: '商业用房', value: SurveyPurposeHouse.business }],
    [SurveyPurposeHouse.service, { label: '服务业用房', value: SurveyPurposeHouse.service }],
    [SurveyPurposeHouse.office, { label: '办公室', value: SurveyPurposeHouse.office }],
    [SurveyPurposeHouse.residence, { label: '住宅', value: SurveyPurposeHouse.residence }],
    [SurveyPurposeHouse.school, { label: '教育用房', value: SurveyPurposeHouse.school }],
    [SurveyPurposeHouse.culture, { label: '文化用房', value: SurveyPurposeHouse.culture }],
    [SurveyPurposeHouse.hospital, { label: '医疗用房', value: SurveyPurposeHouse.hospital }],
    [SurveyPurposeHouse.science, { label: '科学实验研究用房', value: SurveyPurposeHouse.science }],
    [SurveyPurposeHouse.other, { label: '其他', value: SurveyPurposeHouse.other }]
  ])
  static readonly purposeHouseOptions = Array.from(SurveyEntity.purposeHouseMap.values())
  static readonly structureTypeOptions = Array.from(SurveyEntity.structureTypeMap.values())

  static detail(id: number) {
    return AbstractEntity.wrapper(SurveyEntity, SurveyEntity.server.detail(id))
  }

  static readonly server = new SurveyService()

  static form() {
    return new SurveyItemQueryEntity()
  }

  static select(data: SurveyItemQueryEntity & AppRequest.List) {
    return AbstractEntity.wrapperList(SurveyEntity, SurveyEntity.server.select(data))
  }

  /**
   * 身份证号
   */
  @Expose() id_card: string
  /**
   * 房主姓名
   */
  @Expose() owner: string
  /**
   * 勘察状态
   */
  status: Service.SurveyStatus
  get statusMap() {
    return SurveyEntity.statusMap.get(this.status)!
  }

  /**
   * 建筑面积
   */
  @Expose() building_area = 1
  /**
   * 建成年份
   */
  @Expose() building_construction_date = null
  /**
   * 房屋主图
   */
  @Expose() building_img: string
  buildingImg: UploadFile[] = []
  /**
   * 事故距离
   */
  @Expose() distance = 0
  /**
   * 房屋坐落
   */
  @Expose() location: string
  /**
   * 房屋层数
   */
  @Expose() number_of_floors = 1
  /**
   * 客户签字
   */
  @Expose() owner_signature_img: string
  ownerSignatureImg: UploadFile[] = []
  /**
   * 保全日期
   */
  preservation_date: number
  /**
   * 项目id
   */
  @Expose() project_id = 0
  /**
   * 房产证图
   */
  @Expose() property_certificate_img: string
  propertyCertificateImg: UploadFile[] = []
  /**
   * 平面图
   */
  @Expose() property_plan_img: string
  propertyPlanImg: UploadFile[] = []
  /**
   * 房屋用途
   */
  @Expose() purpose_house: Service.SurveyPurposeHouse
  /**
   * 结构类型
   */
  @Expose() structure_type: Service.SurveyStructure

  buildFormData(option: UploadBuildFormDataOption) {
    return this.doBuildFormData(option, uploadService)
  }

  data() {
    return SurveyEntity.detail(this.id)
  }

  save() {
    return SurveyEntity.server.save(this.toJSON())
  }
}

export class SurveyItemEntity extends BaseEntity implements Service.ResponseSurveyItemDTO {
  private static service = new SurveyItemService()

  public static list(survey_id: number) {
    return AbstractEntity.wrapper(SurveyItemEntity, SurveyItemEntity.service.list(survey_id))
  }

  public static detail(id: number) {
    return AbstractEntity.wrapper(SurveyItemEntity, SurveyItemEntity.service.detail(id))
  }

  constructor(survey_id = 0) {
    super()
    this.survey_id = survey_id
  }

  /**
   * 调查id
   */
  @Expose() survey_id: number
  /**
   * 房屋受损部位
   */
  @Expose() damaged_part: string
  /**
   * 完损情况说明
   */
  @Expose() desc: string
  /**
   * 备注
   */
  @Expose() remark: string
  /**
   * 受损图片
   */
  @Expose() img: string
  images: UploadFile[] = []

  buildFormData(option: UploadBuildFormDataOption) {
    return this.doBuildFormData(option, uploadService)
  }

  save() {
    return SurveyItemEntity.service.save(this.toJSON())
  }
}
