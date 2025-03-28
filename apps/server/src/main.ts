import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestApplication, NestFactory } from '@nestjs/core'
import session from 'express-session'

import { AppModule } from './app.module'
import { QyHttpException, QyHttpStatus } from './common/exception/http.exception'
import { HttpExceptionFilter } from './common/filters/http-filter'
import { NoCacheInterceptor } from './common/interceptor/nocache.interceptor'
import { TransformInterceptor } from './common/interceptor/transform.interceptor'
import { getIpAddress } from './tools/network'

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule)
  const config: ConfigService<Config> = app.get(ConfigService)
  const origin = config.get('SERVER_CORS') as string

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor(), new NoCacheInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors => {
        const errorMessages = errors.map(err => ({
          field: err.property,
          errors: Object.values(err.constraints || {})
        }))

        return new QyHttpException(
          errorMessages.map(item => `${item.field}: ${item.errors.join()}`).join(','),
          QyHttpStatus.BAD_REQUEST
        )
      }
    })
  )
  app.enableCors({
    origin: origin.split(','),
    credentials: true,
    maxAge: 24 * 60 * 60,
    exposedHeaders: ['Content-Disposition'],
    methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Content-Range',
      'Authorization',
      'Accept-Language',
      'Content-Language',
      'Tenant-Id',
      'Range',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Content-Disposition'
    ]
  })

  app.use(
    session({
      name: 'SESSION_ID',
      rolling: true,
      secret: 'ZF5BRFCaeFI',
      resave: false,
      cookie: { secure: false, httpOnly: false, maxAge: 2 * 60 * 60 * 1000 },
      saveUninitialized: false
    })
  )

  const ip = getIpAddress()

  await app.listen(3000, '0.0.0.0')
  console.log(`🚀 Server running at http://localhost:3000`)
  console.log(`🚀 Server running at http://${ip.v4}:3000`)
}

Logger.verbose(process.env.NODE_ENV, 'NODE_ENV')

bootstrap()
