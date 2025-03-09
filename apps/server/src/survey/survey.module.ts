import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectEntity } from 'src/project/project.entity'

import { SurveyController } from './survey.controller'
import { SurveyDetailEntity } from './survey.detail.entity'
import { SurveyEntity } from './survey.entity'
import { SurveyDetailImgEntity } from './survey.img.entity'
import { SurveyService } from './survey.service'

@Module({
  imports: [TypeOrmModule.forFeature([SurveyEntity, ProjectEntity, SurveyDetailEntity, SurveyDetailImgEntity])],
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveyModule {}
