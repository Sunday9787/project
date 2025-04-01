import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guard/jwt.guard'
import { TenantGuard } from './common/guard/tenant'
import { ProjectModule } from './project/project.module'
import { RedisModule } from './redis/redis.module'
import { SurveyModule } from './survey/survey.module'
import { UploadModule } from './upload/upload.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env.production'],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService<Config>) {
        return {
          type: 'mysql',
          entityPrefix: 'project_',
          // 开发环境 同步修改
          synchronize: process.env.NODE_ENV ? process.env.NODE_ENV !== 'production' : true,
          autoLoadEntities: true,
          migrations: ['dist/migration/*.js'],
          host: configService.get('DATA_BASE_HOST'),
          port: configService.get('DATA_BASE_PORT'),
          username: configService.get('DATA_BASE_USERNAME'),
          password: configService.get('DATA_BASE_PASSWORD'),
          database: configService.get('DATA_BASE_DATABASE')
        }
      },
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    SurveyModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: TenantGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
