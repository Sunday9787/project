import { AbstractService } from '@/class/abstract.service'
import { request } from '@/utils/request'

import type {
  SurveyDetailItemEntity,
  SurveyDetailItemEntityJSON,
  SurveyEntity,
  SurveyEntityJSON,
  SurveyItemEntity,
  SurveyItemQueryEntity
} from './survey.entity'

export class SurveyService extends AbstractService {
  baseURL = '/survey'

  select(data: SurveyItemQueryEntity & AppRequest.List) {
    return request.post<AppResponse.List<SurveyItemEntity>>(this.baseURL + '/list', data)
  }

  detail(id: number) {
    return request.get<SurveyEntity>(this.baseURL + '/detail', { params: { id } })
  }

  save(data: SurveyEntityJSON) {
    return request.put<number>(this.baseURL + '/save', data)
  }
}

export class SurveyItemService extends AbstractService {
  baseURL = '/survey/item'

  list(survey_id: number) {
    return request.get<SurveyDetailItemEntity[]>(this.baseURL + '/list', { params: { survey_id } })
  }

  save(data: SurveyDetailItemEntityJSON) {
    return request.put(this.baseURL + '/save', data)
  }

  detail(id: number) {
    return request.get<SurveyDetailItemEntity>(this.baseURL + '/detail', { params: { id } })
  }
}
