import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { MailDTO } from './mail.dto'
import { MailService } from './mail.service'

@Controller()
export class MailController {
  constructor(private readonly service: MailService) {}

  @EventPattern('email:send')
  send(@Payload() data: MailDTO) {
    this.service.sendMail(data)
  }
}
