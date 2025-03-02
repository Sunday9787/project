import { Expose } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'
import { FindOptionsOrder } from 'typeorm'

export class BaseDTO {
  @IsInt()
  id: number
}

export class BaseResponseDTO {
  @Expose() tenant_id: string
  @Expose() id: number
  @Expose() create_at: Date
  @Expose() update_at: Date
}

export class BaseQueryDTO<T> {
  @IsOptional()
  @IsInt()
  create_at: Date

  @IsOptional()
  @IsInt()
  update_at: Date

  @IsOptional()
  create_at_start: Date

  @IsOptional()
  create_at_end: Date

  @IsOptional()
  order_by?: FindOptionsOrder<T>
}
