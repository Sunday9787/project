import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { DocConsumerService } from './doc.service'
import type { RenderProjectDocDTO } from './dto'

@Controller()
export class DocConsumerController {
  constructor(private readonly docService: DocConsumerService) {}

  @MessagePattern('export')
  exportDoc(@Payload() data: RenderProjectDocDTO) {
    return this.docService.render(data)
  }
}
