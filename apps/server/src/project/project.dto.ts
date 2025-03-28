import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, QueryBaseOrderDTO, QueryOrderByType, ResponseBaseDTO } from 'src/common/base.dto'
import { ListQueryDTO } from 'src/common/query'
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

class ProjectOrderBy extends QueryBaseOrderDTO implements QueryOrderByType<ProjectEntity> {}

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

export class ResponseProjectDTO extends ResponseBaseDTO {
  name: string
  client: string
  owner_id: number
  location: string
  status: ProjectStatus
  @Type(() => ResponseUserDTO)
  owner: ResponseUserDTO
  @Type(() => ResponseUserDTO)
  members: ResponseUserDTO[]
}
