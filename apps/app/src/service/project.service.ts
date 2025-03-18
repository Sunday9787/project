import { AbstractService } from '@/class/abstractService'
import { request } from '@/utils/request'

import { ProjectEntity, ProjectItemEntity, ProjectItemQueryEntity } from './project.entity'

export class ProjectService extends AbstractService {
  baseURL = '/project'

  select(data: AppRequest.List & ProjectItemQueryEntity) {
    return request.post<AppResponse.List<ProjectItemEntity>>(this.baseURL + '/list', data)
  }

  detail(id: number) {
    return request.get<ProjectEntity>(this.baseURL + `/detail/${id}`)
  }
}
