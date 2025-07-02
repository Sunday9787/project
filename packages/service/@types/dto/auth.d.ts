declare namespace Service {
  interface AuthLocalDTO {
    code: string
    phone: string
    password: string
  }

  interface ResponseUserLoginDTO extends ResponseBaseDTO {
    nickname: string
    phone: string
    access_token: string
    refresh_token: string
    avatar: string | null
    role: UserRole
  }
}
