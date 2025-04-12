import { type CallHandler, ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common'
import type { Request } from 'express'
import { Observable } from 'rxjs'
import { TenantService } from 'src/tenant/tenant.service'

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private readonly tenantContext: TenantService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>()
    const tenantId = req.tenant_id

    return new Observable(observer => {
      this.tenantContext.run(tenantId, () => {
        next.handle().subscribe({
          next: value => observer.next(value),
          error: err => observer.error(err),
          complete: () => observer.complete()
        })
      })
    })
  }
}
