import { Expose } from 'class-transformer'

import { AbstractEntity, type EntityJSON } from '@/class/abstract.entity.ts'

import { AuthService } from './auth.service.ts'

export type AuthLoginEntityJSON = EntityJSON<AuthEntity>

export class AuthLoginEntityResult {
  @Expose() id: number
  @Expose() phone: string
  @Expose() access_token: string
  @Expose() refresh_token: string
  @Expose() nickname: string
  @Expose() avatar: string
  @Expose() createAt: string
  @Expose() updateAt: string
}

export class AuthEntity extends AbstractEntity {
  private static service = new AuthService()

  public static logIn(data: AuthLoginEntityJSON) {
    return AuthEntity.service.logIn(data)
  }

  public static logOut() {
    return AuthEntity.service.logOut()
  }

  @Expose() phone: string
  @Expose() password: string
  @Expose() code: string
}
