import { Controller, Get, HttpCode, HttpStatus, Inject, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { Public } from 'src/common/decorator/public'

import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
  constructor(@Inject(UploadService) private readonly service: UploadService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signature')
  signature() {
    return this.service.signature()
  }

  @HttpCode(HttpStatus.OK)
  @Get('result')
  result(@Req() req: Request) {
    console.log(req)
    return this.service.result()
  }
}
