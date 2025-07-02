import { AbstractEntity } from '@repo/service'
import { Transform } from 'class-transformer'

import { formatDate } from '@/utils'

export class BaseEntity extends AbstractEntity implements Service.ResponseBaseDTO {
  id: number
  tenant_id: string
  @Transform(val => formatDate(val.value))
  create_at: number
  @Transform(val => formatDate(val.value))
  update_at: number
  constructor(id = 0) {
    super()
    this.id = id
  }
}
