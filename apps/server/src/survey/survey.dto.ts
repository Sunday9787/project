import { Expose, Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator'
import dayjs from 'dayjs'
import { BaseDTO, QueryBaseOrderDTO, QueryOrderByType, ResponseBaseDTO } from 'src/common/base.dto'
import { ListQueryDTO } from 'src/common/query'
import { IsChineseIDCard } from 'src/common/validate/id.card'

import { DocSurveyItemDTO } from './item/item.dto'
import { SurveyEntity } from './survey.entity'
import {
  SurveyPurposeHouse,
  surveyPurposeHouseMap,
  SurveyStatus,
  surveyStatusMap,
  SurveyStructure,
  surveyStructureMap
} from './survey.enum'

export class ResponseSurveyDTO extends ResponseBaseDTO {
  @Expose() owner: string

  @Expose() id_card: string

  @Expose() distance: number

  @Expose() location: string

  @Expose() structure_type: SurveyStructure

  @Expose() number_of_floors: number

  @Expose() purpose_house: SurveyPurposeHouse

  @Expose()
  @Transform(val => (val.value ? new Date(val.value).getTime() : val.value))
  building_construction_date: number | null

  @Expose() building_area: number

  @Expose()
  @Transform(val => (val.value ? new Date(val.value).getTime() : val.value))
  preservation_date: number | null

  @Expose() building_img: string

  @Expose() property_certificate_img: string | null

  @Expose() property_plan_img: string | null

  @Expose() owner_signature_img: string

  @Expose() status: SurveyStatus

  @Expose() project_id: number
}

export class DocSurveyDTO {
  id: number

  owner: string

  id_card: string

  distance: number

  location: string

  number_of_floors: number

  status: SurveyStatus
  get status_name() {
    return surveyStatusMap.get(this.status)
  }

  structure_type: SurveyStructure
  get structure_type_name() {
    return surveyStructureMap.get(this.structure_type)
  }

  purpose_house: SurveyPurposeHouse
  get purpose_house_name() {
    return surveyPurposeHouseMap.get(this.purpose_house)
  }

  building_area: number

  @Transform(val => dayjs(val.value).format('YYYY年MM月DD日'))
  building_construction_date: Date

  @Transform(val => (val.value ? dayjs(val.value).format('YYYY年MM月DD日') : val.value))
  preservation_date: Date

  @Transform(val => dayjs(val.value).format('YYYY.MM.DD'))
  create_at: Date

  building_img: string

  owner_signature_img: string

  @Type(() => DocSurveyItemDTO)
  item: DocSurveyItemDTO[]
}

export class SurveyDTO extends BaseDTO {
  @IsInt({ message: '项目id不得为空' })
  project_id: number

  @IsString()
  @IsNotEmpty({ message: '房主姓名不得为空' })
  owner: string

  @IsString()
  @IsNotEmpty({ message: '身份证号码不得为空' })
  @IsChineseIDCard()
  id_card: string

  @IsNumber()
  distance: number

  @IsInt({ message: '房屋层数不得为空' })
  number_of_floors: number

  @IsNotEmpty({ message: '房屋坐落位置不得为空' })
  location: string

  @IsEnum(SurveyStructure, { message: '结构类型只能是 0 1 2' })
  structure_type: SurveyStructure

  @Transform(val => new Date(val.value))
  @IsDate({ message: '日期不合法' })
  building_construction_date: Date

  @IsInt()
  @Min(1, { message: '建筑面积不得小于1' })
  @IsNotEmpty({ message: '建筑面积不得为空' })
  building_area: number

  @IsString()
  @IsNotEmpty({ message: '房屋主图不得为空' })
  building_img: string

  @IsString()
  @IsNotEmpty({ message: '客户签字不得为空' })
  owner_signature_img: string

  @IsOptional()
  @IsString()
  property_certificate_img?: string

  @IsOptional()
  @IsString()
  property_plan_img?: string
}

class SurveyOrderByDTO extends QueryBaseOrderDTO implements QueryOrderByType<SurveyEntity> {}

export class SurveyQueryDTO extends ListQueryDTO {
  @IsOptional()
  @IsString()
  id_card?: string

  @IsOptional()
  @IsEnum(SurveyStructure)
  structure_type?: SurveyStructure

  @IsOptional()
  @IsString()
  owner?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => SurveyOrderByDTO)
  order_by?: SurveyOrderByDTO
}
