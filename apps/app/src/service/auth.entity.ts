import { Expose } from 'class-transformer'

import { BaseEntity } from '@/class/base.entity'

import { AuthService } from './auth.service'

export class AuthLocalEntity {
  static service = new AuthService()

  @Expose() phone: string
  @Expose() password: string
  @Expose() code: string

  static logIn(data: AuthLocalEntity) {
    return AuthLocalEntity.service.logIn(data)
  }

  static logOut() {
    return AuthLocalEntity.service.logOut()
  }
}

export class LoginResultEntity extends BaseEntity implements Service.ResponseUserLoginDTO {
  nickname: string
  phone: string
  access_token: string
  refresh_token: string
  avatar: string | null
  expires_in: number
  role: Service.UserRole
}
