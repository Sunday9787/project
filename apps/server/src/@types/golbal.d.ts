import type { ResponseUserDTO } from 'src/user/user.dto'

declare module 'http' {
  interface IncomingHttpHeaders {
    tenant_id?: string
  }
}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development'
    }
  }

  declare namespace Express {
    interface Request {
      tenant_id: string
    }

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
