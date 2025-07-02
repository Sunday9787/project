import { AbstractService } from '@repo/service'

import { request } from '@/utils/request'

import type { ProjectEntity } from './project.entity'

export class ProjectService extends AbstractService {
  readonly baseURL = '/project'

  select(data: AppRequest.List & Service.ProjectItemQueryDTO) {
    return request.post<AppResponse.List<ProjectEntity>>(this.baseURL + '/list', data)
  }

  detail(id: number) {
    return request.get<ProjectEntity>(this.baseURL + `/detail/${id}`)
  }

  save(data: ProjectEntity) {
    return request.put(this.baseURL + '/save', data)
  }

  del(id: number) {
    return request.delete(this.baseURL + `/del/${id}`)
  }
}
