import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { BaseDTO, ResponseBaseDTO } from 'src/common/base.dto'

export class ResponseSurveyItemDTO extends ResponseBaseDTO {
  damaged_part: string
  desc: string
  img: string
}

export class SurveyItemDTO extends BaseDTO {
  @IsInt()
  survey_id: number

  @IsString()
  @IsNotEmpty({ message: '损坏部分不得为空' })
  damaged_part: string

  @IsString()
  @IsNotEmpty({ message: '损坏描述不得为空' })
  desc: string

  @IsOptional()
  @IsString()
  remark: string

  @IsString()
  img: string
}
