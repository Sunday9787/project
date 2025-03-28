import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SurveyEntity } from 'src/survey/survey.entity'

import { SurveyDetailController } from './detail.controller'
import { SurveyDetailEntity } from './detail.entity'
import { DetailService } from './detail.service'
import { SurveyDetailImgEntity } from './img.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SurveyDetailEntity, SurveyDetailImgEntity, SurveyEntity])],
  providers: [DetailService],
  controllers: [SurveyDetailController]
})
export class SurveyDetailModule {}
