import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { TenantEntity } from './tenant.entity'

export class BaseEntity extends TenantEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  create_at: Date

  @UpdateDateColumn()
  update_at: Date
}
