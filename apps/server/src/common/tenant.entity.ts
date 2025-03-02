import { Column, Index } from 'typeorm'

export class TenantEntity {
  @Index()
  @Column({ type: 'varchar', comment: '租户' })
  tenant_id: string
}
