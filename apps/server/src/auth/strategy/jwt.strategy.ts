import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'

import { AuthService } from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) readonly config: ConfigService<Config>,
    @Inject(AuthService) readonly auth: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: config.get('JWT_SECRET')!
    })
  }

  async validate(req: Request, payload: JwtPayload) {
    Logger.log('开始使用:JwtStrategy')
    Logger.verbose(`${payload.nickname} - ${payload.phone}`, '手机号')
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    const hasToken = await this.auth.hasToken(token)

    if (!hasToken) {
      throw new QyHttpException('token 失效', QyHttpStatus.USER_TOKEN_INVALID)
    }

    return hasToken && payload
  }
}
