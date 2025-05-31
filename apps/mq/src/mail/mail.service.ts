import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Mail from 'nodemailer'

import { MailDTO } from './mail.dto'

@Injectable()
export class MailService {
  private readonly transporter: Mail.Transporter<Mail.SentMessageInfo>
  constructor(private readonly config: ConfigService<Config>) {
    this.transporter = Mail.createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: this.config.get('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.config.get('EMAIL_FROM_ACCOUNT'),
        pass: this.config.get('EMAIL_FROM_CODE')
      }
    })
  }

  sendMail(data: MailDTO) {
    this.transporter.sendMail({
      from: `祺跃科技【官网】 <${this.config.get('EMAIL_FROM_ACCOUNT')}>`,
      to: data.to,
      html: data.html,
      text: data.text,
      subject: data.subject
    })
  }
}
