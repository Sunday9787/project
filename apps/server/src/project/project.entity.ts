import { BaseEntity } from 'src/common/base.entity'
import { SurveyEntity } from 'src/survey/survey.entity'
import { UserEntity } from 'src/user/user.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm'

import { ProjectStatus } from './project.enum'

@Entity('project')
export class ProjectEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', comment: '项目名称' })
  name: string

  @Index()
  @Column({ type: 'varchar', comment: '委托单位' })
  client: string

  /** 项目负责人 */
  @Index()
  @ManyToOne(() => UserEntity, metadata => metadata.project)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity

  @RelationId((project: ProjectEntity) => project.owner)
  owner_id: number

  @Column({ type: 'varchar', comment: '项目所在地' })
  location: string

  @Index()
  @Column({ type: 'integer', default: ProjectStatus.start, comment: '进度状态' })
  status: ProjectStatus

  @OneToMany(() => SurveyEntity, metadata => metadata.project)
  survey: SurveyEntity[]
}
