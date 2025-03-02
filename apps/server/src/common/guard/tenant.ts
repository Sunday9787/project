import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common'
import type { Request } from 'express'
import { RedisService } from 'src/redis/redis.service'
import { createTenantKey } from 'src/tools'

import { QyHttpException, QyHttpStatus } from '../exception/http.exception'

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(@Inject(RedisService) public readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const key = createTenantKey(request.tenant_id)
    const tenant = await this.redisService.cacheManager.get<string>(key)
    Logger.log(tenant, 'TenantID')

    if (!tenant) {
      throw new QyHttpException('租户不存在', QyHttpStatus.TENANT_ID_NOT_FOUND)
    }

    return !!tenant
  }
}
