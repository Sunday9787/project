import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SurveyEntity } from 'src/survey/survey.entity'

import { SurveyDetailController } from './item.controller'
import { SurveyItemEntity } from './item.entity'
import { SurveyItemService } from './item.service'

@Module({
  imports: [TypeOrmModule.forFeature([SurveyItemEntity, SurveyEntity])],
  providers: [SurveyItemService],
  controllers: [SurveyDetailController]
})
export class SurveyItemModule {}
