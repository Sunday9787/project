import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectEntity } from 'src/project/project.entity'

import { SurveyItemEntity } from './item/item.entity'
import { SurveyItemModule } from './item/item.module'
import { SurveyController } from './survey.controller'
import { SurveyEntity } from './survey.entity'
import { SurveyService } from './survey.service'

@Module({
  imports: [TypeOrmModule.forFeature([SurveyEntity, ProjectEntity, SurveyItemEntity]), SurveyItemModule],
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveyModule {}
