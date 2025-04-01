import { Expose } from 'class-transformer'

import { AbstractEntity, type EntityJSON } from '@/class/abstract.entity'

import { AuthService } from './auth.service'

export type AuthEntityJSON = EntityJSON<AuthEntity>

export class AuthEntity extends AbstractEntity {
  static service = new AuthService()

  @Expose() phone: string
  @Expose() password: string
  @Expose() code: string

  static logIn(data: AuthEntityJSON) {
    return AuthEntity.service.logIn(data)
  }

  static logOut() {
    return AuthEntity.service.logOut()
  }
}
