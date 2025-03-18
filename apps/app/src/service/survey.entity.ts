import { Expose, Type } from 'class-transformer'

import { AbstractEntity } from '@/class/abstractEntity'

import { UserEntity } from './auth.entity'
import { SurveyService } from './survey.service'

type StatusMap = { text: string; type: Utils.StatusType }

enum StructureType {
  /** 现浇框架结构 */
  castInPlaceFrameStructure = 0,
  /** 钢混结构 */
  steelConcreteStructure = 1,
  /** 砖混结构 */
  brickConcreteStructure = 2
}

export enum SurveyStatus {
  /** 未保全 */
  start = -1,
  /** 保全中 */
  pending = 0,
  /** 保全完成 */
  complete = 1
}

export class SurveyItemQueryEntity {
  keyword: string
}

export class SurveyItemEntity extends AbstractEntity {
  static server = new SurveyService()
  static form() {
    return new SurveyItemQueryEntity()
  }

  static statusMap = new Map<SurveyStatus, StatusMap>([
    [SurveyStatus.complete, { text: '保全完成', type: 'success' }],
    [SurveyStatus.pending, { text: '保全中', type: 'default' }],
    [SurveyStatus.start, { text: '未保全', type: 'warning' }]
  ])

  static select(data: SurveyItemQueryEntity & AppRequest.List) {
    return AbstractEntity.wrapperList(SurveyItemEntity, SurveyItemEntity.server.select(data))
  }

  /**
   * ID 编号
   */
  @Expose() id_card: string
  @Expose() owner: string
  @Expose() status: SurveyStatus

  @Expose()
  @Type(() => UserEntity)
  investigator: UserEntity = new UserEntity()
  get statusMap() {
    return SurveyEntity.statusMap.get(this.status)!
  }
}

/**
 * SurveyDTO
 */
export class SurveyEntity extends SurveyItemEntity {
  static statusMap = new Map<SurveyStatus, StatusMap>([
    [SurveyStatus.complete, { text: '保全完成', type: 'success' }],
    [SurveyStatus.pending, { text: '保全中', type: 'default' }],
    [SurveyStatus.start, { text: '未保全', type: 'warning' }]
  ])

  @Expose() building_area: string
  @Expose() building_construction_date: number
  @Expose() building_img: string
  @Expose() detail: SurveyDetail
  /**
   * 事故距离
   */
  @Expose() distance: number
  @Expose() location: string
  @Expose() owner_signature_img: string
  @Expose() preservation_date: number
  @Expose() project_id: number
  @Expose() property_certificate_img: string
  @Expose() property_plan_img: string
  /**
   * 房屋用途
   */
  @Expose() purpose_house: number
  @Expose() structure_type: StructureType
}

export class SurveyDetail extends AbstractEntity {
  @Expose() damaged_part: string
  @Expose() desc: string
  /**
   * ID 编号
   */
  @Expose() img: SurveyDetailImgDTO[]
  survey_id: number
}

/**
 * SurveyDetailImgDTO
 */
export class SurveyDetailImgDTO extends AbstractEntity {
  /**
   * ID 编号
   */
  @Expose() survey_detail_id: number
  @Expose() url: string
}
