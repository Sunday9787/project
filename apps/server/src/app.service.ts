import { Inject, Injectable, OnModuleInit } from '@nestjs/common'

import { RedisService } from './redis/redis.service'
import { createTenantKey } from './tools'

@Injectable()
export class AppService implements OnModuleInit {
  private readonly tenant = ['2d0cf355-6d47-4dfb-8381-92b2617820f6']
  constructor(@Inject(RedisService) private readonly redisService: RedisService) {}

  onModuleInit() {
    // 初始化租户信息
    for (const value of this.tenant) {
      const key = createTenantKey(value)
      this.redisService.cacheManager.set(key, value)
    }
  }
}
