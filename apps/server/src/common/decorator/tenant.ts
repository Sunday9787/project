import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { type Request } from 'express'

export const TenantId = createParamDecorator(function (param: string | undefined, ctx: ExecutionContext) {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.tenant_id
})
