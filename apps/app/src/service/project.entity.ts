import { AbstractEntity, ProjectStatus } from '@repo/service'
import { Expose, Type } from 'class-transformer'
import { type TextType } from 'wot-design-uni/components/wd-text/types'

import { BaseEntity } from '@/class/base.entity'

import { ProjectService } from './project.service'
import { ResponseUserPlainDTO } from './user.entity'

type StatusMap = { text: string; type: TextType }

export class ProjectItemQueryEntity {
  @Expose() client: string
  @Expose() name: string
  @Expose() keyword: string
}

export class ProjectItemEntity extends BaseEntity {
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

  @Expose() name: string

  @Expose() client: string

  @Expose() owner_id: number

  @Type(() => ResponseUserPlainDTO)
  owner: ResponseUserPlainDTO = new ResponseUserPlainDTO()

  @Expose() location: string

  status: ProjectStatus = ProjectStatus.start
  get statusMap() {
    return ProjectItemEntity.statusMap.get(this.status)!
  }
}

export class ProjectEntity extends ProjectItemEntity {
  static detail(id: number) {
    return AbstractEntity.wrapper(ProjectEntity, ProjectEntity.server.detail(id))
  }

  constructor(id: string) {
    super()
    this.id = Number(id)
  }

  @Expose()
  @Type(() => ResponseUserPlainDTO)
  members: ResponseUserPlainDTO[] = []

  detail() {
    return ProjectEntity.detail(this.id)
  }

  save() {
    return ProjectEntity.server.save(this.toJSON())
  }
}
