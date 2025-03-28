import { Transform } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'

export type QueryOrderByType<T> = { [K in keyof T]?: 'asc' | 'desc' }

export class BaseDTO {
  @IsInt()
  id: number
}

export class ResponseBaseDTO {
  tenant_id: string
  id: number

  @Transform(val => new Date(val.value).getTime())
  create_at: number

  @Transform(val => new Date(val.value).getTime())
  update_at: number
}

export class QueryBaseOrderDTO implements QueryOrderByType<Record<'create_at' | 'update_at', unknown>> {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  update_at?: 'asc' | 'desc'

  @IsOptional()
  @IsIn(['asc', 'desc'])
  create_at?: 'asc' | 'desc'
}

export class QueryBaseDTO {
  @IsOptional()
  @IsInt()
  create_at_start?: number

  @IsOptional()
  @IsInt()
  create_at_end?: number

  @IsOptional()
  @IsString()
  keyword?: string
}
