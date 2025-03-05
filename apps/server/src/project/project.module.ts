import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from 'src/user/user.module'

import { ProjectController } from './project.controller'
import { ProjectEntity } from './project.entity'
import { ProjectService } from './project.service'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
