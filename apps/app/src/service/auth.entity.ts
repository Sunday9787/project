import { Expose } from 'class-transformer'

import { AbstractEntity, EntityJSON } from '@/class/abstractEntity'

import { AuthService } from './auth.service'

export enum UserRole {
  /** 组织负责人 */
  admin = 0,
  /** 项目负责人 */
  owner = 1,
  /** 勘查员 */
  surveyor = 2
}

export class UserEntity extends AbstractEntity {
  @Expose() phone: string
  @Expose() nickname: string
  @Expose() avatar: string
  @Expose() tenant_id: string
  @Expose() role: UserRole
}

export class AuthLoginEntityResult extends UserEntity {
  @Expose() access_token: string
  @Expose() refresh_token: string
}

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
