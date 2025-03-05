import { IsString } from 'class-validator'

export class AuthLocalDTO {
  @IsString()
  code: string

  @IsString()
  phone: string

  @IsString()
  password: string
}
