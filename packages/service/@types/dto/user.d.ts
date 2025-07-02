declare namespace Service {
  enum UserRole {
    /** 组织负责人 */
    admin = 0,
    /** 项目负责人 */
    owner = 1,
    /** 勘查员 */
    surveyor = 2
  }

  interface ResponseUserDTO extends ResponseBaseDTO {
    phone: string
    nickname: string
    role: UserRole
    avatar: string | null
  }
}
