import { Expose, Type } from 'class-transformer'
import type { UploadBuildFormDataOption } from 'wot-design-uni/components/wd-upload/types'
import type { UploadFile } from 'wot-design-uni/components/wd-upload/types'

import { AbstractEntity, type EntityJSON } from '@/class/abstract.entity'

import { SurveyItemService, SurveyService } from './survey.service'
import { UploadService } from './upload.service'

type StatusMap = { text: string; type: Utils.StatusType }

/**
 * 房屋结构
 */
enum StructureType {
  /** 现浇框架结构 */
  castInPlaceFrameStructure = 0,
  /** 钢混结构 */
  steelConcreteStructure = 1,
  /** 砖混结构 */
  brickConcreteStructure = 2
}

/**
 * 保全状态
 */
export enum SurveyStatus {
  /** 未保全 */
  start = -1,
  /** 保全中 */
  pending = 0,
  /** 保全完成 */
  complete = 1
}

/**
 * 房屋用途
 */
export enum SurveyPurposeHouse {
  /** 仓房 */
  plant = 0,
  /** 仓库 */
  warehouse = 1,
  /** 商业用房 */
  business = 2,
  /** 服务业用房 */
  service = 3,
  /** 办公室 */
  office = 4,
  /** 住宅 */
  residence = 5,
  /** 教育用房 */
  school = 6,
  /** 文化用房 */
  culture = 7,
  /** 医疗用房 */
  hospital = 8,
  /** 科学实验研究用房 */
  science = 9,
  /** 其他 */
  other = 10
}

export class SurveyItemQueryEntity {
  keyword: string
}

export class SurveyItemEntity extends AbstractEntity {
  static readonly server = new SurveyService()

  static readonly statusMap = new Map<SurveyStatus, StatusMap>([
    [SurveyStatus.complete, { text: '保全完成', type: 'success' }],
    [SurveyStatus.pending, { text: '保全中', type: 'default' }],
    [SurveyStatus.start, { text: '未保全', type: 'warning' }]
  ])

  static form() {
    return new SurveyItemQueryEntity()
  }

  static select(data: SurveyItemQueryEntity & AppRequest.List) {
    return AbstractEntity.wrapperList(SurveyItemEntity, SurveyItemEntity.server.select(data))
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
  status: SurveyStatus
  get statusMap() {
    return SurveyEntity.statusMap.get(this.status)!
  }
}

export type SurveyEntityJSON = EntityJSON<SurveyEntity>

const uploadService = new UploadService()
/**
 * SurveyDTO
 */
export class SurveyEntity extends SurveyItemEntity {
  static readonly statusMap = new Map<SurveyStatus, StatusMap>([
    [SurveyStatus.complete, { text: '保全完成', type: 'success' }],
    [SurveyStatus.pending, { text: '保全中', type: 'default' }],
    [SurveyStatus.start, { text: '未保全', type: 'warning' }]
  ])

  static readonly structureTypeMap = new Map<StructureType, { label: string; value: StructureType }>([
    [
      StructureType.castInPlaceFrameStructure,
      { label: '现浇框架结构', value: StructureType.castInPlaceFrameStructure }
    ],
    [StructureType.steelConcreteStructure, { label: '钢混结构', value: StructureType.steelConcreteStructure }],
    [StructureType.brickConcreteStructure, { label: '砖混结构', value: StructureType.brickConcreteStructure }]
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

  constructor(id: number) {
    super()
    this.id = id
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
  @Expose() purpose_house: SurveyPurposeHouse
  /**
   * 结构类型
   */
  @Expose() structure_type: StructureType

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

export type SurveyDetailItemEntityJSON = EntityJSON<SurveyDetailItemEntity>

export class SurveyDetailItemEntity extends AbstractEntity {
  private static service = new SurveyItemService()

  public static list(survey_id: number) {
    return AbstractEntity.wrapper(SurveyDetailItemEntity, SurveyDetailItemEntity.service.list(survey_id))
  }

  public static detail(id: number) {
    return AbstractEntity.wrapper(SurveyDetailItemEntity, SurveyDetailItemEntity.service.detail(id))
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
    return SurveyDetailItemEntity.service.save(this.toJSON())
  }
}

export type SurveyDetailItemListJSON = EntityJSON<SurveyDetailItemListEntity>

export class SurveyDetailItemListEntity extends AbstractEntity {
  private static service = new SurveyItemService()
  public static data(id: number) {
    return AbstractEntity.wrapper(SurveyDetailItemEntity, SurveyDetailItemListEntity.service.list(id))
  }

  @Expose()
  @Type(() => SurveyDetailItemEntity)
  list: SurveyDetailItemEntity[] = []
  constructor(id: number) {
    super()
    this.id = id
  }

  public data() {
    return SurveyDetailItemListEntity.data(this.id)
  }
}
