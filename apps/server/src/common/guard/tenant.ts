import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { RedisService } from 'src/redis/redis.service'
import { createTenantKey } from 'src/tools'
import * as uuid from 'uuid'

import { IS_PUBLIC_KEY } from '../decorator/public'
import { PrjHttpException, PrjHttpStatus } from '../exception/http.exception'

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @Inject(RedisService) public readonly redisService: RedisService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const tenant_id = req.headers['tenant-id']

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    if (!tenant_id) {
      throw new PrjHttpException('租户不存在', PrjHttpStatus.TENANT_ID_NOT_FOUND)
    }

    if (!uuid.validate(tenant_id) || uuid.version(tenant_id) !== 4) {
      throw new PrjHttpException('租户ID不合法', PrjHttpStatus.BAD_REQUEST)
    }

    const key = createTenantKey(tenant_id)
    const tenant = await this.redisService.cacheManager.get<string>(key)

    if (!tenant) {
      await this.redisService.cacheManager.set(key, tenant_id)
    }

    Logger.log(key, 'TenantID')

    return !!tenant
  }
}
