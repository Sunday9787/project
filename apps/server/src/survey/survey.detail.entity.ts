import { BaseEntity } from 'src/common/base.entity'
import { Column, Entity, Index, OneToMany } from 'typeorm'

import { SurveyDetailImgEntity } from './survey.img.entity'

@Entity('survey_detail')
export class SurveyDetailEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', comment: '房屋受损部位' })
  damaged_part: string

  @Column({ type: 'varchar', comment: '完损情况说明' })
  desc: string

  @OneToMany(() => SurveyDetailImgEntity, metadata => metadata.detail)
  img: SurveyDetailImgEntity[]
}
