// import { Expose } from 'class-transformer'
import { Transform } from 'class-transformer'
import { IsInt } from 'class-validator'

export class BaseDTO {
  @IsInt()
  id: number
}

export class BaseResponseDTO {
  tenant_id: string
  id: number

  @Transform(val => new Date(val.value).getTime())
  create_at: number

  @Transform(val => new Date(val.value).getTime())
  update_at: number
}
