import { Injectable, type NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import * as uuid from 'uuid'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenant_id = req.headers['tenant-id']

    if (!tenant_id) {
      throw new QyHttpException('租户不存在', QyHttpStatus.TENANT_ID_NOT_FOUND)
    }

    if (!uuid.validate(tenant_id) || uuid.version(tenant_id) !== 4) {
      throw new QyHttpException('租户ID不合法', QyHttpStatus.BAD_REQUEST)
    }

    req.tenant_id = tenant_id

    next()
  }
}
