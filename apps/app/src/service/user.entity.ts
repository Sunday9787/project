import { AbstractEntity } from '@repo/service'

import { BaseEntity } from '@/class/base.entity'
import { useUserModule } from '@/store/user'

import { UserService } from './user.service'

export class ResponseUserPlainDTO extends BaseEntity implements Service.ResponseUserPlainDTO {
  public static service = new UserService()

  public static cache() {
    return AbstractEntity.wrapper(ResponseUserPlainDTO, ResponseUserPlainDTO.service.cache())
  }

  constructor() {
    const useModule = useUserModule()
    super(useModule.id)
    this.tenant_id = useModule.tenant_id
    this.role = useModule.role
    this.avatar = useModule.avatar
    this.nickname = useModule.nickname
  }

  role: Service.UserRole
  avatar: string | null
  nickname: string
}
