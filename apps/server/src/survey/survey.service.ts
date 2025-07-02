import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { PrjHttpException, PrjHttpStatus } from 'src/common/exception/http.exception'
import { PrjQuery } from 'src/common/query'
import { ProjectEntity } from 'src/project/project.entity'
import { Between, Like, Repository } from 'typeorm'

import { ResponseSurveyDTO, SurveyDTO, SurveyQueryDTO } from './survey.dto'
import { SurveyEntity } from './survey.entity'

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyEntity)
    private readonly surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) {}

  async detail(id: number, tenant_id: string) {
    const data = await this.surveyRepository.findOne({
      where: { id, tenant_id }
    })

    return plainToInstance(ResponseSurveyDTO, data)
  }

  async save(data: SurveyDTO, tenant_id: string) {
    const project = await this.projectRepository.findOneBy({ id: data.project_id, tenant_id })

    if (!project) {
      throw new PrjHttpException('该租户下项目未找到', PrjHttpStatus.BAD_REQUEST)
    }

    const entity = this.surveyRepository.create(data)
    entity.tenant_id = tenant_id
    entity.project = project

    const result = await this.surveyRepository.save(entity)

    return result.id
  }

  all(query: SurveyQueryDTO, tenant_id: string) {
    const prjQuery = new PrjQuery(query, function (entity: SurveyEntity) {
      return plainToInstance(ResponseSurveyDTO, entity)
    })

    return this.surveyRepository
      .findAndCount({
        where: query.keyword
          ? [
              { tenant_id, owner: Like(`%${query.keyword}%`) },
              { tenant_id, id_card: Like(`%${query.keyword}%`) }
            ]
          : {
              tenant_id,
              owner: query.owner ? Like(`%${query.owner}%`) : void 0,
              id_card: query.id_card ? Like(`%${query.id_card}`) : void 0,
              create_at:
                query.create_at_start && query.create_at_end
                  ? Between(new Date(query.create_at_start), new Date(query.create_at_end))
                  : void 0
            },
        order: query.order_by,
        ...prjQuery.option
      })
      .then(function (result) {
        return prjQuery.data(result)
      })
  }
}
