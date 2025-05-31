import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res
} from '@nestjs/common'
import { Response } from 'express'
import { TenantId } from 'src/common/decorator/tenant'
import { User } from 'src/common/decorator/user'
import { Readable } from 'stream'

import { ProjectDTO, ProjectQueryDTO } from './project.dto'
import { ProjectService } from './project.service'

@Controller('project')
export class ProjectController {
  constructor(@Inject(ProjectService) private readonly service: ProjectService) {}

  @HttpCode(HttpStatus.OK)
  @Get('detail/:id')
  detail(@Param('id', ParseIntPipe) id: number, @TenantId() tenant_id: string) {
    return this.service.detail(id, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Put('save')
  save(@Body() data: ProjectDTO, @TenantId() tenant_id: string, @User() payload: JwtPayload) {
    const { members, ...base } = data
    return this.service.save(base, members, tenant_id, payload)
  }

  @HttpCode(HttpStatus.OK)
  @Delete('del/:id')
  del(@Param('id', ParseIntPipe) id: number, @TenantId() tenant_id: string) {
    return this.service.del(id, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Post('list')
  list(@Body() body: ProjectQueryDTO, @TenantId() tenant_id: string) {
    return this.service.all(body, tenant_id)
  }

  @Get('export/:id')
  async export(@Res() res: Response, @Param('id') id: number, @TenantId() tenant_id: string) {
    const [fileName, buffer] = await this.service.exportDoc(id, tenant_id)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Length', buffer.length.toString())
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName + '房屋查勘保全报告')}.docx"`
    )

    // **流式传输 buffer**
    Readable.from(buffer).pipe(res)
  }
}
