declare namespace AppResponse {
  interface Body<T> {
    code: number
    message: string
    data: Data<T>
  }

  type Data<T> = T extends Blob ? { blob: Blob; filename: string } : T

  interface List<T> {
    total: number
    page: number
    size: number
    list: T[]
  }
}
