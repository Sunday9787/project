import { BaseEntity } from 'src/common/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'

import { SurveyDetailEntity } from './detail.entity'

@Entity('survey_img')
export class SurveyDetailImgEntity extends BaseEntity {
  @Column({ type: 'varchar', comment: '受损处图片' })
  url: string

  @RelationId((entity: SurveyDetailImgEntity) => entity.detail)
  survey_detail_id: number

  @ManyToOne(() => SurveyDetailEntity, metadata => metadata.img)
  @JoinColumn({ name: 'survey_detail_id' })
  detail: SurveyDetailEntity
}
