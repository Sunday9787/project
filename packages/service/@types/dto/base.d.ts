declare namespace Service {
  interface ResponseBaseDTO {
    id: number
    /** 租户id */
    tenant_id: string
    create_at: number
    update_at: number
  }
}
