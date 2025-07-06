import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { PrjHttpException, PrjHttpStatus } from 'src/common/exception/http.exception'
import { SurveyEntity } from 'src/survey/survey.entity'
import { TenantService } from 'src/tenant/tenant.service'
import { EntityManager, Repository } from 'typeorm'

import { ResponseSurveyItemDTO, SurveyItemDTO } from './item.dto'
import { SurveyItemEntity } from './item.entity'

@Injectable()
export class SurveyItemService {
  constructor(
    @InjectRepository(SurveyEntity) private readonly surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(SurveyItemEntity) private readonly repository: Repository<SurveyItemEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly tenantService: TenantService
  ) {}

  async save(data: SurveyItemDTO, tenant_id: string) {
    const survey = await this.surveyRepository.findOneBy({ id: data.survey_id, tenant_id })
    if (!survey) {
      throw new PrjHttpException('未找到该调查信息', PrjHttpStatus.BAD_REQUEST)
    }

    await this.entityManager.transaction(async manager => {
      const detail = this.repository.create({ ...data, survey, tenant_id })
      await manager.save(SurveyItemEntity, detail)
    })
  }

  async detail(id: number, tenant_id: string) {
    const response = await this.repository.findOneBy({ id, tenant_id })
    return plainToInstance(ResponseSurveyItemDTO, response, { strategy: 'excludeAll' })
  }

  async del(id: number, tenant_id: string) {
    await this.repository.delete({ id, tenant_id })
  }

  async all(survey_id: number, tenant_id: string) {
    console.log('tenantContextService', this.tenantService.getTenantId())
    const response = await this.repository.find({
      where: {
        survey: { id: survey_id },
        tenant_id
      }
    })

    return plainToInstance(ResponseSurveyItemDTO, response, { strategy: 'excludeAll' })
  }
}
