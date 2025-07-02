import { Expose } from 'class-transformer'

import { BaseEntity } from '@/class/base.entity.ts'

import { AuthService } from './auth.service.ts'

export class AuthEntity implements Service.AuthLocalDTO {
  private static service = new AuthService()
  public static logIn(data: AuthEntity) {
    return AuthEntity.service.logIn(data)
  }
  public static logOut() {
    return AuthEntity.service.logOut()
  }

  @Expose()
  code: string
  @Expose()
  phone: string
  @Expose()
  password: string
}

export class LoginEntityResultEntity extends BaseEntity implements Service.ResponseUserLoginDTO {
  nickname: string
  phone: string
  access_token: string
  refresh_token: string
  avatar: string | null
  role: Service.UserRole
}
