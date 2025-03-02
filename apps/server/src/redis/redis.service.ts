import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import type { RedisCache } from 'cache-manager-ioredis-yet'

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) public readonly cacheManager: RedisCache) {}
}
