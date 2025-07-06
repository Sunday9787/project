import { AbstractService } from '@/class/abstract.service'
import { request } from '@/utils/request'

import type { SurveyEntity, SurveyItemEntity, SurveyItemQueryEntity } from './survey.entity'

export class SurveyService extends AbstractService {
  baseURL = '/survey'

  select(data: SurveyItemQueryEntity & AppRequest.List) {
    return request.post<AppResponse.List<SurveyEntity>>(this.baseURL + '/list', data)
  }

  detail(id: number) {
    return request.get<SurveyEntity>(this.baseURL + '/detail', { params: { id } })
  }

  save(data: SurveyEntity) {
    return request.put<number>(this.baseURL + '/save', data)
  }
}

export class SurveyItemService extends AbstractService {
  baseURL = '/survey/item'

  list(survey_id: number) {
    return request.get<SurveyItemEntity[]>(this.baseURL + '/list', { params: { survey_id } })
  }

  save(data: SurveyItemEntity) {
    return request.put(this.baseURL + '/save', data)
  }

  detail(id: number) {
    return request.get<SurveyItemEntity>(this.baseURL + '/detail', { params: { id } })
  }
}
