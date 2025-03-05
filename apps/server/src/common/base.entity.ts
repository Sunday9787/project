import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { TenantEntity } from './tenant.entity'

export class BaseEntity extends TenantEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date
}
