import { Expose } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'
import { BaseDTO, BaseResponseDTO } from 'src/common/base.dto'
import { ListQueryDTO } from 'src/common/query'

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
