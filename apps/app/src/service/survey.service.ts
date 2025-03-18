import { AbstractService } from '@/class/abstractService'
import { request } from '@/utils/request'

import { SurveyItemEntity, SurveyItemQueryEntity } from './survey.entity'

export class SurveyService extends AbstractService {
  baseURL = '/survey'

  select(data: SurveyItemQueryEntity & AppRequest.List) {
    return request.post<AppResponse.List<SurveyItemEntity>>(this.baseURL + '/list', data)
  }
}
