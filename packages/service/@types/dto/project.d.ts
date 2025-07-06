declare namespace Service {
  enum ProjectStatus {
    /** 未保全 */
    start = -1,
    /** 保全中 */
    pending = 0,
    /** 保全完成 */
    complete = 1
  }

  interface ProjectItemQueryDTO {
    /** 客户名称 */
    client?: string
    /** 项目名称 */
    name?: string
    keyword?: string
  }

  interface ProjectDTO extends ResponseBaseDTO {
    /** 项目名 */
    name: string
    /** 客户名称 */
    client: string
    /** 项目负责人 */
    owner_id: number
    /** 项目位置 */
    location: string
    owner: ResponseUserPlainDTO
    /** 项目状态 */
    status: ProjectStatus
    status_name: string
    /** 项目调查成员 */
    members: ResponseUserPlainDTO[]
  }
}
