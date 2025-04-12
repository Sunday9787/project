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
import { TenantId } from 'src/common/decorator/tenant'
import { User } from 'src/common/decorator/user'

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
}
