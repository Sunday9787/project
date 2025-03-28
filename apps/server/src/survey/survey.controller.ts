import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common'
import { TenantId } from 'src/common/decorator/tenant'

import { SurveyDTO, SurveyQueryDTO } from './survey.dto'
import { SurveyService } from './survey.service'

@Controller('survey')
export class SurveyController {
  constructor(@Inject(SurveyService) private readonly service: SurveyService) {}

  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get('detail')
  data(@Query('id', ParseIntPipe) id: number, @TenantId() tenant_id: string) {
    return this.service.detail(id, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Put('save')
  save(@Body() body: SurveyDTO, @TenantId() tenant_id: string) {
    return this.service.save(body, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Post('list')
  list(@Body() body: SurveyQueryDTO, @TenantId() tenant_id: string) {
    return this.service.all(body, tenant_id)
  }
}
