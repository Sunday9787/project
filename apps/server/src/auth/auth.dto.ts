import { IsOptional, IsString } from 'class-validator'

export class AuthLocalDTO {
  @IsOptional()
  @IsString()
  code: string

  @IsString()
  phone: string

  @IsString()
  password: string
}
