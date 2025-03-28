import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectEntity } from 'src/project/project.entity'

import { SurveyDetailEntity } from './detail/detail.entity'
import { SurveyDetailModule } from './detail/detail.module'
import { SurveyDetailImgEntity } from './detail/img.entity'
import { SurveyController } from './survey.controller'
import { SurveyEntity } from './survey.entity'
import { SurveyService } from './survey.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyEntity, ProjectEntity, SurveyDetailEntity, SurveyDetailImgEntity]),
    SurveyDetailModule
  ],
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveyModule {}
