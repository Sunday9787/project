import type { ResponseUserDTO } from 'src/user/user.dto'

declare global {
  interface Config {
    DATA_BASE_HOST: string
    DATA_BASE_PORT: number
    DATA_BASE_USERNAME: string
    DATA_BASE_PASSWORD: string
    DATA_BASE_DATABASE: string

    REDIS_HOST: string
    REDIS_PORT: number
    REDIS_DB: number
    REDIS_EXPIRES_IN: number

    JWT_SECRET: string
    JWT_EXPIRES_IN: string
    JWT_REFRESH_EXPIRES_IN: string

    EMAIL_HOST: string
    EMAIL_PORT: number
    EMAIL_TO_ACCOUNT: string
    EMAIL_FROM_ACCOUNT: string
    EMAIL_FROM_CODE: string

    OSS_ACCESS_KEY_ID: string
    OSS_ACCESS_KEY_SECRET: string
    OSS_BUCKET: string
    OSS_ACCESS_URL: string
    OSS_DIR: string

    SERVER_CORS: string
  }

  interface JwtPayload extends ResponseUserDTO {
    iat: number
    exp: number
  }
}
