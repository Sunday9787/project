import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import type { Request, Response } from 'express'

import { QyHttpException, QyHttpStatus } from '../exception/http.exception'

interface ResponseError {
  data: null
  timeStamp: string
  message: string
  code: QyHttpStatus
  url: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: QyHttpException | UnauthorizedException | NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    Logger.log(exception.message, '错误提示')
    Logger.log(request.url, 'Request Url')
    Logger.log(request.body, 'Request Body')
    Logger.log(request.query, 'Request Query')
    Logger.log(request.params, 'Request Param')
    Logger.error(exception.stack, 'Exception')

    const result: ResponseError = (function () {
      if (exception instanceof QyHttpException) {
        return {
          data: null,
          timeStamp: new Date().toISOString(),
          message: exception.message,
          code: exception.code,
          url: request.originalUrl
        }
      }

      if (exception instanceof NotFoundException) {
        return {
          data: null,
          timeStamp: new Date().toISOString(),
          message: 'url 不存在',
          code: QyHttpStatus.SOURCE_NOT_FOUND,
          url: request.originalUrl
        }
      }

      if (exception instanceof UnauthorizedException) {
        return {
          data: null,
          timeStamp: new Date().toISOString(),
          message: 'token 失效',
          code: QyHttpStatus.USER_TOKEN_INVALID,
          url: request.originalUrl
        }
      }

      return {
        data: null,
        timeStamp: new Date().toISOString(),
        message: '服务器内部错误',
        code: QyHttpStatus.INTERNAL_SERVER_ERROR,
        url: request.originalUrl
      }
    })()

    // 设置返回的状态码、请求头、发送错误信息
    response.status(200).json(result)
  }
}
