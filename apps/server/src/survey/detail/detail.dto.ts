import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, ResponseBaseDTO } from 'src/common/base.dto'

export class ResponseSurveyDetailImgDTO extends ResponseBaseDTO {
  survey_detail_id: number
  url: string
}

export class ResponseSurveyDetailDTO extends ResponseBaseDTO {
  damaged_part: string
  desc: string
  @Type(() => ResponseSurveyDetailImgDTO)
  img: ResponseSurveyDetailImgDTO[]
}

class SurveyDetailImgDTO extends BaseDTO {
  @IsInt()
  survey_detail_id: number

  @IsString()
  @IsNotEmpty()
  url: string
}

export class SurveyDetailDTO extends BaseDTO {
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
