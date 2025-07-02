import { Injectable, Logger } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { Strategy } from 'passport-local'
import { PrjHttpException, PrjHttpStatus } from 'src/common/exception/http.exception'
import { md5 } from 'src/tools'

import { AuthLocalDTO } from '../auth.dto'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
      passReqToCallback: true
    })
  }

  async validate(req: Request, email: string, password: string) {
    Logger.log('开始使用 LocalStrategy')
    const dto = new AuthLocalDTO()
    dto.phone = email
    dto.password = password

    Logger.verbose('LocalStrategy 开始校验用户信息')
    const user = await this.authService.validateUser(dto)

    if (!user) {
      throw new PrjHttpException('用户不存在', PrjHttpStatus.USER_NOT_FOUND)
    }

    if (md5(password) !== user.password) {
      throw new PrjHttpException('用户密码错误', PrjHttpStatus.USER_PASSWORD_WRONG)
    }

    Logger.verbose('用户信息校验通过')

    return user
  }
}
