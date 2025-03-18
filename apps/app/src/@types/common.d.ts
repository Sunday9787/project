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

declare namespace AppRequest {
  interface List {
    current?: number
    size?: number
  }
}

declare namespace Utils {
  type ActionType = 'edit' | 'add' | 'detail'

  interface ActionProps {
    id: number
    type: ActionType
  }

  type StatusType = 'default' | 'primary' | 'success' | 'warning' | 'error'
}
