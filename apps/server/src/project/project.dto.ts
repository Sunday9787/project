import { Expose, Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, BaseResponseDTO } from 'src/common/base.dto'
import { ListQueryDTO, QueryOrderByDTO } from 'src/common/query'

import { ProjectEntity } from './project.entity'

export class ProjectDTO extends BaseDTO {
  @IsString()
  name: string

  @IsString()
  client: string

  @IsInt()
  owner_id: number

  @IsString()
  location: string
}

class ProjectOrderBy implements QueryOrderByDTO<Pick<ProjectEntity, 'create_at' | 'update_at'>> {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  update_at?: 'asc' | 'desc'

  @IsOptional()
  @IsIn(['asc', 'desc'])
  create_at?: 'asc' | 'desc'
}

export class ProjectQueryDTO extends ListQueryDTO {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  client: string

  @IsOptional()
  @IsInt()
  owner_id: number

  @IsOptional()
  @IsString()
  location: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectOrderBy)
  order_by?: ProjectOrderBy
}

export class ResponseProjectDTO extends BaseResponseDTO {
  @Expose()
  name: string

  @Expose()
  client: string

  @Expose()
  owner_id: number

  @Expose()
  location: string
}
