import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import { RedisService } from 'src/redis/redis.service'
import { ResponseUserDTO, ResponseUserLoginDTO } from 'src/user/user.dto'
import type { UserEntity } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'

import type { AuthLocalDTO } from './auth.dto'

@Injectable()
export class AuthService {
  static generateTokenKey(value: string) {
    return 'token:' + value
  }

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(ConfigService) private readonly configService: ConfigService<Config>
  ) {}

  signToken(user: UserEntity, refresh?: boolean) {
    const dto = plainToInstance(ResponseUserDTO, user, { excludeExtraneousValues: true })
    const data = instanceToPlain(dto)

    // refresh-token 设置更长的过期时间
    if (refresh) {
      return this.jwtService.sign(data, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') })
    }

    return this.jwtService.sign(data)
  }

  delToken(usr: ResponseUserLoginDTO) {
    return this.redisService.cacheManager.del(AuthService.generateTokenKey(usr.access_token))
  }

  setToken(dto: ResponseUserLoginDTO) {
    const JWT_EXPIRES_IN = this.configService.get('JWT_EXPIRES_IN') as string
    const num = (function () {
      const value = JWT_EXPIRES_IN.match(/\d+/)
      return value ? Number(value[0]) : 2
    })()

    const type = (function () {
      const value = JWT_EXPIRES_IN.match(/[a-zA-Z]+/)
      return (value ? value[0] : 'h') as dayjs.ManipulateType
    })()

    return this.redisService.cacheManager.set(
      AuthService.generateTokenKey(dto.access_token),
      dto,
      dayjs().add(num, type).valueOf() - Date.now()
    )
  }

  async hasToken(token?: string | null) {
    if (!token) return false
    const value = await this.redisService.cacheManager.get<ResponseUserLoginDTO>(AuthService.generateTokenKey(token))
    return !!value
  }

  async login(user: UserEntity) {
    const dto = ResponseUserLoginDTO.fromPlain(user)

    dto.access_token = this.signToken(user)
    dto.refresh_token = this.signToken(user, true)

    await this.setToken(dto)

    return instanceToPlain(dto)
  }

  validateUser(body: AuthLocalDTO) {
    return this.userService.findByPhone(body.phone)
  }

  async logout(token: string) {
    const user = await this.redisService.cacheManager.get<ResponseUserLoginDTO>(AuthService.generateTokenKey(token))

    if (token && user) {
      console.log(user)
      Logger.log(user.phone, '退出登录手机号')
      Logger.log(user.nickname, '退出登录昵称')

      return await this.delToken(user)
    }

    Logger.warn('token user 异常登出')
  }

  async refreshToken(refreshToken: string) {
    try {
      // 验证 refresh_token
      const decoded: ResponseUserDTO = this.jwtService.verify(refreshToken)
      const user = await this.userService.findById(decoded.id)

      if (!user) {
        throw new QyHttpException('用户不存在', QyHttpStatus.USER_NOT_FOUND)
      }

      const response: Pick<ResponseUserLoginDTO, 'access_token'> = {
        access_token: this.signToken(user)
      }

      const dto = plainToInstance(ResponseUserLoginDTO, user, { excludeExtraneousValues: true })
      dto.refresh_token = refreshToken
      dto.access_token = response.access_token

      await this.setToken(dto)

      return response
    } catch (error) {
      throw new QyHttpException('refresh_token 已过期', QyHttpStatus.USER_REFRESH_TOKEN_INVALID)
    }
  }
}
