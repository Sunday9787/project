import type { UserRole } from '@repo/service'

import { BaseEntity } from '@/class/base.entity'

export class UserEntity extends BaseEntity implements Service.ResponseUserDTO {
  phone: string
  nickname: string
  role: UserRole
  avatar: string | null
}
