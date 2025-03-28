import { Expose, Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'
import { BaseDTO, QueryBaseOrderDTO, QueryOrderByType, ResponseBaseDTO } from 'src/common/base.dto'
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

export class ResponseUserDTO extends ResponseBaseDTO {
  @Expose()
  phone: string

  @Expose()
  nickname: string

  @Expose()
  role: UserRole

  @Expose()
  avatar: string | null
}

export class ResponseUserLoginDTO extends ResponseBaseDTO {
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
    instance.create_at = data.create_at.getTime()
    instance.update_at = data.update_at.getTime()

    return instance
  }
}

export class UserForgetDTO extends BaseDTO {
  @IsString()
  password: string
}

class UserQueryOrderBy extends QueryBaseOrderDTO implements QueryOrderByType<UserEntity> {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  nickname?: 'asc' | 'desc'
}

export class UserQueryDTO extends ListQueryDTO {
  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  nickname?: string

  @IsOptional()
  @IsInt()
  role?: UserRole

  @IsOptional()
  @ValidateNested()
  @Type(() => UserQueryOrderBy)
  order_by?: UserQueryOrderBy
}
