declare global {
  declare namespace Page {
    type TimeField<Str extends string> = Str extends `${infer K}Date` ? K : unknown
    type TimeFieldValueStart<Str extends string> = `${TimeField<Str>}_start`
    type TimeFieldValueEnd<Str extends string> = `${TimeField<Str>}_end`
    type TimeFieldMap<T> = { [K in T]: [TimeFieldValueStart<T>, TimeFieldValueEnd<T>] }
    type TimeMap = null | [number, number]
    type TimeMapField<Str extends string | unknown> = Str extends `${infer K}Date` ? `${K}Date` : string

    interface Options<P extends AppRequest.List, K = unknown, R = unknown> {
      wait?: number
      request(param: P): Promise<AppResponse.List<R>>
      /** @default true */
      immediate?: boolean
      route?: boolean
      /** 查询忽略字段 */
      ignoreField?: string[]
      /** 时间范围字段映射 */
      timeFieldMap?: TimeFieldMap<K>
      form: Record<string, unknown>
    }

    type SearchFields = Record<string, unknown>

    interface Table<T> {
      loading: boolean
      data: T[]
    }

    interface Pagination {
      layout: string
      total: number
      current: number
      limit: number
    }
  }

  declare namespace Utils {
    type ActionType = 'edit' | 'add' | 'detail'

    interface ActionProps {
      id: number
      type: ActionType
    }

    type StatusType = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning'
  }
}

export {}
