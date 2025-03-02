declare module 'ali-oss' {
  interface BucketLocation {
    location: string
    res: Res
  }

  interface Res {
    status: number
    statusCode: number
    statusMessage: string
    headers: Headers
    size: number
    aborted: boolean
    rt: number
    keepAliveSocket: boolean
    data: Data
    requestUrls: string[]
    timing?: string
    remoteAddress: string
    remotePort: number
    socketHandledRequests: number
    socketHandledResponses: number
  }

  interface Data {
    type: string
    data: number[]
  }

  interface Headers {
    server: string
    date: string
    'content-type': string
    'content-length': string
    connection: string
    'x-oss-request-id': string
    'x-oss-server-time': string
  }
}

export {}
