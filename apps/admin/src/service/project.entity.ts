import { ProjectStatus } from '@repo/service'
import { Type } from 'class-transformer'

import { BaseEntity } from '@/class/base.entity'

import { ProjectService } from './project.service'

class ProjectItemQueryEntity implements Service.ProjectItemQueryDTO {
  /** 客户名称 */
  client?: string
  /** 项目名称 */
  name?: string
  keyword?: string
}

class ProjectUserEntity implements Service.ProjectUserDTO {
  id: number
  avatar: string | null
  nickname: string
}

export class ProjectEntity extends BaseEntity implements Service.ProjectDTO {
  public static service = new ProjectService()
  public static statusMap = new Map<ProjectStatus, { text: string; type: Utils.StatusType }>([
    [ProjectStatus.start, { text: '未保全', type: 'error' }],
    [ProjectStatus.pending, { text: '保全中', type: 'primary' }],
    [ProjectStatus.complete, { text: '已完成', type: 'success' }]
  ])
  public static select(data: Service.ProjectItemQueryDTO & AppRequest.List) {
    return BaseEntity.wrapperList(ProjectEntity, ProjectEntity.service.select(data))
  }
  public static form() {
    return new ProjectItemQueryEntity()
  }
  public del() {
    return ProjectEntity.service.del(this.id)
  }

  data() {
    return BaseEntity.wrapper(ProjectEntity, ProjectEntity.service.detail(this.id))
  }

  name: string
  client: string
  owner_id: number
  location: string
  status: Service.ProjectStatus
  status_name: string
  get owner_name() {
    return this.owner.nickname
  }
  @Type(() => ProjectUserEntity)
  owner: ProjectUserEntity
  @Type(() => ProjectUserEntity)
  members: ProjectUserEntity[] = []
}
