import { Expose } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { BaseDTO, BaseResponseDTO } from 'src/common/base.dto'
import { ListQueryDTO } from 'src/common/query'

import { UserEntity } from './user.entity'
import { UserRole } from './user.enum'

export class UserDTO extends BaseDTO {
  @IsString()
  phone: string

  @IsString()
  nickname: string

  @IsInt()
  role: UserRole

  @IsOptional()
  @IsString()
  avatar: string | null
}

export class ResponseUserDTO extends BaseResponseDTO {
  @Expose()
  phone: string

  @Expose()
  nickname: string

  @Expose()
  role: UserRole

  @Expose()
  avatar: string | null
}

export class ResponseUserLoginDTO extends BaseResponseDTO {
  @Expose() nickname: string
  @Expose() phone: string
  @Expose() access_token: string
  @Expose() refresh_token: string
  @Expose() avatar: string | null
  @Expose() role: UserRole

  static fromPlain(data: UserEntity) {
    const instance = new ResponseUserLoginDTO()
    instance.id = data.id
    instance.tenant_id = data.tenant_id
    instance.phone = data.phone
    instance.nickname = data.nickname
    instance.avatar = data.avatar
    instance.role = data.role
    instance.create_at = data.create_at
    instance.update_at = data.update_at

    return instance
  }
}

export class UserForgetDTO extends BaseDTO {
  @IsString()
  password: string
}

export class UserQueryDTO extends ListQueryDTO<UserQueryDTO> {
  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  nickname?: string

  @IsOptional()
  @IsInt()
  role?: UserRole
}
