import { BaseEntity } from '@/class/base.entity'

export class ResponseUserPlainDTO extends BaseEntity implements Service.ResponseUserPlainDTO {
  role: Service.UserRole
  avatar: string | null
  nickname: string
}
