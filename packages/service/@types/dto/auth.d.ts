declare namespace Service {
  enum UserRole {
    /** 组织负责人 */
    admin = 0,
    /** 项目负责人 */
    owner = 1,
    /** 勘查员 */
    surveyor = 2
  }

  interface AuthLocalDTO {
    code: string
    phone: string
    password: string
  }

  interface ResponseUserLoginDTO extends ResponseBaseDTO, ResponseUserDTO {
    phone: string
    access_token: string
    refresh_token: string
    role: UserRole
    expires_in: number
  }
}
