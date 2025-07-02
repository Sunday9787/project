import type { ResponseUserDTO } from 'src/user/user.dto'

declare global {
  type Platform = 'wechat' | 'android' | 'ios' | 'web' | void
}

declare module 'http' {
  interface IncomingHttpHeaders {
    'tenant-id'?: string
    'x-platform'?: string
  }
}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
    }
  }

  declare namespace Express {
    interface User extends ResponseUserDTO {
      iat: number
      exp: number
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    code: string
    uuid: `${string}-${string}-${string}-${string}`
  }
}

export {}
