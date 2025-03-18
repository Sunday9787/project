import { Expose, Type } from 'class-transformer'

import { AbstractEntity, EntityJSON } from '@/class/abstractEntity'

import { UserEntity } from './auth.entity'
import { ProjectService } from './project.service'
import { SurveyEntity } from './survey.entity'

export enum ProjectStatus {
  /** 未保全 */
  start = -1,
  /** 保全中 */
  pending = 0,
  /** 保全完成 */
  complete = 1
}

type StatusMap = { text: string; type: Utils.StatusType }

export class ProjectItemQueryEntity {
  client: string
  name: string
  keyword: string
}

export type ProjectItemEntityJSON = EntityJSON<ProjectItemEntity>

export class ProjectItemEntity extends AbstractEntity {
  static statusMap = new Map<ProjectStatus, StatusMap>([
    [ProjectStatus.complete, { text: '保全完成', type: 'success' }],
    [ProjectStatus.pending, { text: '保全中', type: 'default' }],
    [ProjectStatus.start, { text: '未保全', type: 'warning' }]
  ])

  static server = new ProjectService()

  static select(data: ProjectItemQueryEntity & AppRequest.List) {
    return AbstractEntity.wrapperList(ProjectItemEntity, ProjectItemEntity.server.select(data))
  }

  static form() {
    return new ProjectItemQueryEntity()
  }

  @Expose() tenant_id: string
  @Expose() name: string
  @Expose() client: string
  @Expose() owner_id: number
  @Expose() location: string

  @Expose()
  status: ProjectStatus = ProjectStatus.start
  get statusMap() {
    return ProjectItemEntity.statusMap.get(this.status)!
  }

  @Expose()
  @Type(() => UserEntity)
  owner: UserEntity = new UserEntity()
}

export type ProjectEntityJSON = EntityJSON<ProjectEntity>

export class ProjectEntity extends ProjectItemEntity {
  constructor(id = 0) {
    super()
    this.id = id
  }

  @Expose()
  @Type(() => SurveyEntity)
  survey: SurveyEntity[] = []
  @Expose()
  @Type(() => UserEntity)
  members: UserEntity[] = []

  get investigatorUsers() {
    if (!this.members.length) {
      return '暂无调查员'
    }

    return this.members.map(item => item.nickname).join(',')
  }

  detail() {
    return AbstractEntity.wrapper(ProjectEntity, ProjectEntity.server.detail(this.id))
  }
}
