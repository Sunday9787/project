import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DocConsumerModule } from './doc/doc.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env.production'],
      isGlobal: true
    }),
    MailModule,
    DocConsumerModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
