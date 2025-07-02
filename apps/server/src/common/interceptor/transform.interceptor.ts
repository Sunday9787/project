import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { PrjHttpStatus } from '../exception/http.exception'

type AppResponse<T> = { data: T | null; code: PrjHttpStatus; message: string }

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, AppResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<AppResponse<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data: data || null,
          code: PrjHttpStatus.OK_REQUEST,
          message: 'success'
        }
      })
    )
  }
}
