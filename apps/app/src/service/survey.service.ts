import type { BaseEntity } from '@/class/abstract.entity'
import { AbstractService } from '@/class/abstract.service'
import { request } from '@/utils/request'

import type {
  SurveyDetailEntity,
  SurveyDetailEntityJSON,
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
    return request.get<SurveyEntity>(this.baseURL + `/detail/${id}`)
  }

  save(data: SurveyEntityJSON) {
    return request.put<number>(this.baseURL + '/save', data)
  }
}

export class SurveyDetailService extends AbstractService {
  baseURL = '/survey/detail'

  list(survey_id: number) {
    return request.get<SurveyDetailEntity[]>(this.baseURL + '/list', { params: { survey_id } })
  }

  save(data: SurveyDetailEntityJSON) {
    return request.put(this.baseURL + '/save', data)
  }
}
