import { BaseEntity } from 'src/common/base.entity'
import { SurveyEntity } from 'src/survey/survey.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm'

import { SurveyDetailImgEntity } from './img.entity'

@Entity('survey_detail')
export class SurveyDetailEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', comment: '房屋受损部位' })
  damaged_part: string

  @Column({ type: 'varchar', comment: '完损情况说明' })
  desc: string

  @OneToMany(() => SurveyDetailImgEntity, metadata => metadata.detail)
  img: SurveyDetailImgEntity[]

  @RelationId((entity: SurveyDetailEntity) => entity.survey)
  survey_id: number

  @ManyToOne(() => SurveyEntity, metadata => metadata.detail)
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity
}
