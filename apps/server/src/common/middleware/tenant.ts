import { Injectable, type NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { PrjHttpException, PrjHttpStatus } from 'src/common/exception/http.exception'
import * as uuid from 'uuid'

const WHITE_ROUTE_LIST = ['/auth/login', '/auth/code']

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenant_id = req.headers['tenant-id']

    if (WHITE_ROUTE_LIST.includes(req.baseUrl)) {
      next()
      return
    }

    if (!tenant_id) {
      throw new PrjHttpException('租户不存在', PrjHttpStatus.TENANT_ID_NOT_FOUND)
    }

    if (!uuid.validate(tenant_id) || uuid.version(tenant_id) !== 4) {
      throw new PrjHttpException('租户ID不合法', PrjHttpStatus.BAD_REQUEST)
    }

    // req.tenant_id = tenant_id

    next()
  }
}
