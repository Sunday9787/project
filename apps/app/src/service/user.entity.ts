import { Expose } from 'class-transformer'

import { AbstractEntity } from '@/class/abstract.entity'

import { UserService } from './user.service'

export enum UserRole {
  /** 组织负责人 */
  admin = 0,
  /** 项目负责人 */
  owner = 1,
  /** 勘查员 */
  surveyor = 2
}

export class UserEntity extends AbstractEntity {
  public static service = new UserService()

  public static cache() {
    return AbstractEntity.wrapper(UserEntity, UserEntity.service.cache())
  }

  @Expose() phone: string
  @Expose() nickname: string
  @Expose() avatar: string
  @Expose() tenant_id: string
  @Expose() role: UserRole

  get isOwner() {
    return this.role === UserRole.owner
  }

  get isAdmin() {
    return this.role === UserRole.admin
  }

  get isSurveyor() {
    return this.role === UserRole.surveyor
  }
}

export class AuthLoginEntityResult extends UserEntity {
  @Expose() access_token: string
  @Expose() refresh_token: string
}
