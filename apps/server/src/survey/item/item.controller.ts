import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Put, Query } from '@nestjs/common'
import { TenantId } from 'src/common/decorator/tenant'

import { SurveyItemDTO } from './item.dto'
import { SurveyItemService } from './item.service'

@Controller('/survey/item')
export class SurveyDetailController {
  constructor(private readonly service: SurveyItemService) {}

  @HttpCode(HttpStatus.OK)
  @Get('detail')
  detail(@Query('id', ParseIntPipe) id: number, @TenantId() tenant_id: string) {
    return this.service.detail(id, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Delete('del/:id')
  del(@Param('id', ParseIntPipe) id: number, @TenantId() tenant_id: string) {
    return this.service.del(id, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Put('save')
  save(@Body() body: SurveyItemDTO, @TenantId() tenant_id: string) {
    return this.service.save(body, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Get('list')
  list(@Query('survey_id', ParseIntPipe) survey_id: number, @TenantId() tenant_id: string) {
    return this.service.all(survey_id, tenant_id)
  }
}
