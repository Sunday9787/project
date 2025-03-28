import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import { SurveyEntity } from 'src/survey/survey.entity'
import { EntityManager, Repository } from 'typeorm'

import { ResponseSurveyDetailDTO, SurveyDetailDTO } from './detail.dto'
import { SurveyDetailEntity } from './detail.entity'
import { SurveyDetailImgEntity } from './img.entity'

@Injectable()
export class DetailService {
  constructor(
    @InjectRepository(SurveyEntity) private readonly surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(SurveyDetailImgEntity) private readonly surveyImgRepository: Repository<SurveyDetailImgEntity>,
    @InjectRepository(SurveyDetailEntity) private readonly repository: Repository<SurveyDetailEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager
  ) {}

  async save(data: SurveyDetailDTO, tenant_id: string) {
    const survey = await this.surveyRepository.findOneBy({ id: data.survey_id, tenant_id })
    if (!survey) {
      throw new QyHttpException('未找到该调查信息', QyHttpStatus.BAD_REQUEST)
    }

    await this.entityManager.transaction(async manager => {
      const detail = this.repository.create({ ...data, survey, tenant_id })
      await manager.save(SurveyDetailEntity, detail)

      const images = data.img.map(item => this.surveyImgRepository.create({ ...item, tenant_id, detail }))
      await manager.save(SurveyDetailImgEntity, images)
    })
  }

  async del(id: number, tenant_id: string) {
    await this.repository.delete({ id, tenant_id })
  }

  async all(survey_id: number, tenant_id: string) {
    const response = await this.repository.find({
      where: {
        survey: { id: survey_id },
        tenant_id
      },
      relations: { img: true }
    })

    return plainToInstance(ResponseSurveyDetailDTO, response)
  }
}
