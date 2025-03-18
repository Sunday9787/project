import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, BaseResponseDTO } from 'src/common/base.dto'
import { BaseQueryOrderDTO, ListQueryDTO, QueryOrderByType } from 'src/common/query'
import { ResponseSurveyDTO } from 'src/survey/survey.dto'
import { ResponseUserDTO } from 'src/user/user.dto'

import { ProjectEntity } from './project.entity'
import { ProjectStatus } from './project.enum'

export class ProjectDTO extends BaseDTO {
  @IsString()
  name: string

  @IsString()
  client: string

  @IsInt()
  owner_id: number

  @IsString()
  location: string

  @IsEnum(ProjectStatus)
  status: ProjectStatus
}

class ProjectOrderBy extends BaseQueryOrderDTO implements QueryOrderByType<ProjectEntity> {}

export class ProjectQueryDTO extends ListQueryDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsString()
  client?: string

  @IsOptional()
  @IsInt()
  owner_id?: number

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectOrderBy)
  order_by?: ProjectOrderBy
}

export class ResponseProjectDTO extends BaseResponseDTO {
  name: string
  client: string
  owner_id: number
  location: string
  status: ProjectStatus
  @Type(() => ResponseSurveyDTO)
  survey: ResponseSurveyDTO[]
  @Type(() => ResponseUserDTO)
  owner: ResponseUserDTO
  @Type(() => ResponseUserDTO)
  members: ResponseUserDTO[]
}
