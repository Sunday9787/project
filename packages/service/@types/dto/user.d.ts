declare namespace Service {
  interface ResponseUserDTO extends ResponseUserPlainDTO {
    phone: number
  }

  interface ResponseUserPlainDTO extends ResponseBaseDTO {
    nickname: string
    role: UserRole
    avatar: string | null
  }
}
