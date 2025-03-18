import { Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, BaseResponseDTO } from 'src/common/base.dto'
import { BaseQueryOrderDTO, ListQueryDTO, QueryOrderByType } from 'src/common/query'
import { IsChineseIDCard } from 'src/common/validate/id.card'

import { SurveyEntity } from './survey.entity'
import { SurveyStatus, SurveyStructure } from './survey.enum'

class ResponseSurveyDetailImgDTO extends BaseResponseDTO {
  survey_detail_id: number
}

class ResponseSurveyDetailDTO extends BaseResponseDTO {
  damaged_part: string
  desc: string
  @Type(() => ResponseSurveyDetailImgDTO)
  img: ResponseSurveyDetailImgDTO[]
}

export class ResponseSurveyDTO extends BaseResponseDTO {
  owner: string

  id_card: string

  distance: number

  location: string

  status: SurveyStatus

  structure_type: SurveyStructure

  @Transform(val => new Date(val.value).getTime())
  building_construction_date: Date

  building_area: string

  @Transform(val => new Date(val.value).getTime())
  preservation_date: Date

  building_img: string

  owner_signature_img: string

  @Type(() => ResponseSurveyDetailDTO)
  detail: ResponseSurveyDetailDTO
}

class SurveyDetailImgDTO {
  @IsInt()
  id: number

  @IsInt()
  survey_detail_id: number

  @IsString()
  @IsNotEmpty()
  url: string
}

class SurveyDetailDTO extends BaseDTO {
  @IsInt()
  survey_id: number

  @IsString()
  @IsNotEmpty({ message: '损坏部分不得为空' })
  damaged_part: string

  @IsString()
  @IsNotEmpty({ message: '损坏描述不得为空' })
  desc: string

  @ValidateNested()
  @Type(() => SurveyDetailImgDTO)
  img: SurveyDetailImgDTO[]
}

export class SurveyDTO extends BaseDTO {
  @IsInt()
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

  @IsNotEmpty({ message: '房屋坐落位置不得为空' })
  location: string

  @IsEnum(SurveyStructure, { message: '结构类型只能是 0 1 2' })
  structure_type: SurveyStructure

  @Transform(val => new Date(val.value))
  @IsDate({ message: '日期不合法' })
  building_construction_date: Date

  @IsString()
  @IsNotEmpty({ message: '建筑面积不得为空' })
  building_area: string

  @Transform(val => new Date(val.value))
  @IsDate({ message: '日期不合法' })
  preservation_date: Date

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

  @ValidateNested()
  @Type(() => SurveyDetailDTO)
  detail: SurveyDetailDTO
}

class SurveyOrderByDTO extends BaseQueryOrderDTO implements QueryOrderByType<SurveyEntity> {}

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
