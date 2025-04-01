import { CacheInterceptor } from '@nestjs/cache-manager'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors
} from '@nestjs/common'
import { Public } from 'src/common/decorator/public'
import { TenantId } from 'src/common/decorator/tenant'

import { UserDTO, UserForgetDTO, UserQueryDTO } from './user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Put('save')
  save(@Body() body: UserDTO, @TenantId() tenant_id: string) {
    return this.userService.save(body, tenant_id)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('cache')
  cache() {
    return this.userService.cache()
  }

  @HttpCode(HttpStatus.OK)
  @Delete('del/:id')
  del(@Param('id', ParseIntPipe) id: number, @TenantId() tenant_id: string) {
    return this.userService.del(id, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @Post('forget')
  forget(@Body() body: UserForgetDTO, @TenantId() tenant_id: string) {
    return this.userService.forget(body, tenant_id)
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor)
  @Post('list')
  list(@Body() body: UserQueryDTO, @TenantId() tenant_id: string) {
    return this.userService.all(body, tenant_id)
  }
}
