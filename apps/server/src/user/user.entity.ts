import { BaseEntity } from 'src/common/base.entity'
import { Column, Entity, Index } from 'typeorm'

import { UserRole } from './user.enum'

@Entity('user')
export class UserEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', comment: '手机号' })
  phone: string

  @Index()
  @Column({ type: 'varchar', comment: '用户名' })
  nickname: string

  @Column({ type: 'varchar', comment: '密码' })
  password: string

  @Column({ type: 'varchar', default: null })
  avatar: string | null

  @Index()
  @Column({ type: 'integer', comment: '用户类型: 组织负责人 = 0, 项目负责人 = 1, 勘查员 = 2' })
  role: UserRole
}
