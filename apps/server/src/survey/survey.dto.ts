import { Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator'
import { BaseDTO, QueryBaseOrderDTO, QueryOrderByType, ResponseBaseDTO } from 'src/common/base.dto'
import { ListQueryDTO } from 'src/common/query'
import { IsChineseIDCard } from 'src/common/validate/id.card'

import { SurveyEntity } from './survey.entity'
import { SurveyStatus, SurveyStructure } from './survey.enum'

export class ResponseSurveyDTO extends ResponseBaseDTO {
  owner: string

  id_card: string

  distance: number

  location: string

  number_of_floors: number

  status: SurveyStatus

  structure_type: SurveyStructure

  building_area: number

  @Transform(val => new Date(val.value).getTime())
  building_construction_date: Date

  @Transform(val => new Date(val.value).getTime())
  preservation_date: Date

  building_img: string

  owner_signature_img: string
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
