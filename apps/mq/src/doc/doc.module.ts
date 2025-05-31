import { Module } from '@nestjs/common'

import { DocConsumerController } from './doc.controller'
import { DocConsumerService } from './doc.service'

@Module({
  controllers: [DocConsumerController],
  providers: [DocConsumerService]
})
export class DocConsumerModule {}
