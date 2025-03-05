import { Expose } from 'class-transformer'
import { IsInt } from 'class-validator'

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
