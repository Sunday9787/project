import { AsyncLocalStorage } from 'node:async_hooks'

import { Injectable } from '@nestjs/common'

interface TenantContext {
  tenantId: string
}

@Injectable()
export class TenantService {
  private readonly als = new AsyncLocalStorage<TenantContext>()

  run(tenantId: string, callback: () => void) {
    this.als.run({ tenantId }, callback)
  }

  getTenantId() {
    const store = this.als.getStore()!
    return store.tenantId
  }
}
