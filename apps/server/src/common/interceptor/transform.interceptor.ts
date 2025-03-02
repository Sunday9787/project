import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { QyHttpStatus } from '../exception/http.exception'

type Response<T> = { data: T | null; code: QyHttpStatus; message: string }

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data: data || null,
          code: QyHttpStatus.OK_REQUEST,
          message: 'success'
        }
      })
    )
  }
}
