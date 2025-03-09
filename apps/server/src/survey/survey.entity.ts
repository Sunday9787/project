import { BaseEntity } from 'src/common/base.entity'
import { ProjectEntity } from 'src/project/project.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, RelationId } from 'typeorm'

import { SurveyDetailEntity } from './survey.detail.entity'
import { SurveyPurposeHouse, SurveyStructure } from './survey.enum'

@Entity('survey')
export class SurveyEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', comment: '房主姓名' })
  owner: string

  @Index()
  @Column({ type: 'varchar', comment: '身份证号' })
  id_card: string

  @Column({ type: 'integer', comment: '爆破距离' })
  distance: number

  @Column({ type: 'varchar', comment: '房屋坐落' })
  location: string

  @Index()
  @Column({ type: 'integer', comment: '结构类型' })
  structure_type: SurveyStructure

  @Index()
  @Column({ type: 'integer', comment: '房屋用途' })
  purpose_house: SurveyPurposeHouse

  @Column({ type: 'timestamp', comment: '建成年份' })
  building_construction_date: Date

  @Column({ type: 'varchar', comment: '建筑面积' })
  building_area: string

  @Column({ type: 'timestamp', comment: '保全日期' })
  preservation_date: Date

  @Column({ type: 'varchar', comment: '房屋主图' })
  building_img: string

  @Column({ type: 'varchar', default: null, nullable: true, comment: '房产证图' })
  property_certificate_img: string | null

  @Column({ type: 'varchar', default: null, nullable: true, comment: '平面图' })
  property_plan_img: string | null

  @Column({ type: 'varchar', comment: '客户签字' })
  owner_signature_img: string

  @RelationId((entity: SurveyEntity) => entity.project)
  project_id: number

  @ManyToOne(() => ProjectEntity, metadata => metadata.survey)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity

  @RelationId((entity: SurveyEntity) => entity.detail)
  survey_detail_id: number

  @OneToOne(() => SurveyDetailEntity)
  @JoinColumn({ name: 'survey_detail_id' })
  detail: SurveyDetailEntity
}
