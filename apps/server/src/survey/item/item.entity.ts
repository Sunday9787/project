import { BaseEntity } from 'src/common/base.entity'
import { SurveyEntity } from 'src/survey/survey.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm'

@Entity('survey_item')
export class SurveyItemEntity extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', comment: '房屋受损部位' })
  damaged_part: string

  @Column({ type: 'varchar', comment: '完损情况说明' })
  desc: string

  @Column({ type: 'varchar', comment: '受损图片' })
  img: string

  @Column({ type: 'varchar', comment: '备注' })
  remark: string

  @RelationId((entity: SurveyItemEntity) => entity.survey)
  survey_id: number

  @ManyToOne(() => SurveyEntity, metadata => metadata.item)
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity
}
