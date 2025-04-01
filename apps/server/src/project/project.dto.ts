import { Type } from 'class-transformer'
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, QueryBaseOrderDTO, QueryOrderByType, ResponseBaseDTO } from 'src/common/base.dto'
import { ListQueryDTO } from 'src/common/query'

import { ProjectEntity } from './project.entity'
import { ProjectStatus } from './project.enum'

export class ProjectBaseDTO extends BaseDTO {
  @IsString()
  name: string

  @IsString()
  client: string

  @IsString()
  location: string
}

export class ProjectDTO extends ProjectBaseDTO {
  @IsArray({ message: '必须是数组' })
  @ValidateNested({ each: true })
  @Type(() => BaseDTO)
  members: BaseDTO[]
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
  members: BaseDTO[]
}
