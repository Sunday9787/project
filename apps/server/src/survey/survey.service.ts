import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QyHttpException, QyHttpStatus } from 'src/common/exception/http.exception'
import { QiyueQuery } from 'src/common/query'
import { ProjectEntity } from 'src/project/project.entity'
import { Between, EntityManager, Like, Repository } from 'typeorm'

import { SurveyDetailEntity } from './survey.detail.entity'
import { ResponseSurveyDTO, SurveyDTO, SurveyQueryDTO } from './survey.dto'
import { SurveyEntity } from './survey.entity'
import { SurveyDetailImgEntity } from './survey.img.entity'

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyEntity)
    private readonly surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(SurveyDetailEntity)
    private readonly surveyDetailRepository: Repository<SurveyDetailEntity>,
    @InjectRepository(SurveyDetailImgEntity)
    private readonly surveyDetailImgRepository: Repository<SurveyDetailImgEntity>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async detail(id: number, tenant_id: string) {
    const data = await this.surveyRepository.findOne({
      where: { id, tenant_id },
      relations: {
        detail: {
          img: true
        }
      }
    })

    return plainToInstance(ResponseSurveyDTO, data)
  }

  async save(data: SurveyDTO, tenant_id: string) {
    const project = await this.projectRepository.findOneBy({ id: data.project_id, tenant_id })

    if (!project) {
      throw new QyHttpException('该租户下项目未找到', QyHttpStatus.BAD_REQUEST)
    }

    return this.manager.transaction(async transactionalEntityManager => {
      const surveyDetail = this.surveyDetailRepository.create(data.detail)
      surveyDetail.tenant_id = tenant_id

      const surveyDetailImg = this.surveyDetailImgRepository.create(data.detail.img)

      for (const item of surveyDetailImg) {
        item.tenant_id = tenant_id
        item.detail = surveyDetail
      }

      const survey = this.surveyRepository.create(data)
      survey.project = project
      survey.tenant_id = tenant_id
      survey.detail = surveyDetail

      await transactionalEntityManager.save(SurveyDetailEntity, surveyDetail)
      await transactionalEntityManager.save(SurveyDetailImgEntity, surveyDetailImg)
      await transactionalEntityManager.save(SurveyEntity, survey)
    })
  }

  all(query: SurveyQueryDTO, tenant_id: string) {
    const qianliQuery = new QiyueQuery(query, function (entity: SurveyEntity) {
      return plainToInstance(ResponseSurveyDTO, entity)
    })

    return this.surveyRepository
      .findAndCount({
        where: {
          tenant_id,
          owner: query.owner && Like(`%${query.owner}%`),
          id_card: query.id_card && Like(`%${query.id_card}`),
          create_at:
            query.create_at_start && query.create_at_end
              ? Between(new Date(query.create_at_start), new Date(query.create_at_end))
              : void 0
        },
        order: query.order_by,
        ...qianliQuery.option
      })
      .then(function (result) {
        return qianliQuery.data(result)
      })
  }
}
