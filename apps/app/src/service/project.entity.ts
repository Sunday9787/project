import { Expose, Type } from 'class-transformer'

import { AbstractEntity, BaseEntity, type EntityJSON } from '@/class/abstract.entity'
import { useCacheModule } from '@/store/cache'

import { ProjectService } from './project.service'

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
  get ownerName() {
    const cacheModule = useCacheModule()
    return cacheModule.userMap.get(this.owner_id)?.nickname || '-'
  }
  @Expose() location: string

  @Expose()
  status: ProjectStatus = ProjectStatus.start
  get statusMap() {
    return ProjectItemEntity.statusMap.get(this.status)!
  }
}

export type ProjectEntityJSON = EntityJSON<ProjectEntity>

export class ProjectEntity extends ProjectItemEntity {
  static detail(id: number) {
    return AbstractEntity.wrapper(ProjectEntity, ProjectEntity.server.detail(id))
  }

  constructor(id: string) {
    super()
    this.id = Number(id)
  }

  @Expose()
  @Type(() => BaseEntity)
  members: BaseEntity[] = []

  get selectMembers() {
    if (this.members.length) {
      return this.members.map(item => item.id)
    }
    return []
  }
  set selectMembers(val: number[]) {
    if (val.length) {
      this.members = val.map(id => ({ id }))
    } else {
      this.members = []
    }
  }

  detail() {
    return ProjectEntity.detail(this.id)
  }

  save() {
    return ProjectEntity.server.save(this.toJSON())
  }
}
