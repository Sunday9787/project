import { type ClassConstructor, Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer'

import { formatDate } from '@/utils'

type ObjectKey<T> = keyof T extends `${infer U}` ? U : string
type EntityMethodKey = ObjectKey<AbstractEntityMethod>
type ExcludeEntityAttribute = EntityMethodKey
export type EntityQuery<T, Attr = unknown> = Omit<T, ExcludeEntityAttribute & Attr>
export type EntityJSON<T> = Omit<T, ExcludeEntityAttribute>

export interface AbstractEntityMethod {
  /** 添加/更新当前实例 */
  save?(): Promise<null>
  del?(): unknown
  /** 获取实例详情 */
  data?(): unknown
  process?(): unknown
  logIn?(): unknown
  logOut?(): unknown
  /** 复制 数据到 当前实例 */
  copy?(data: unknown): void
}

export abstract class AbstractEntity {
  public static toJSON<T extends object>(context: T) {
    return instanceToPlain(context, { excludeExtraneousValues: true }) as EntityJSON<T>
  }

  public static async wrapperList<T>(context: ClassConstructor<T>, Result: Promise<AppResponse.List<T>>) {
    const response = await Result
    response.list = plainToInstance(context, response.list)
    return response
  }

  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T>): Promise<T>
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T[]>): Promise<T[]>
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T | T[]>): Promise<T | T[]> {
    const response = await Result

    if (Array.isArray(response)) {
      return response.map(item => plainToInstance(context, item))
    }

    return plainToInstance(context, response, { exposeDefaultValues: true })
  }

  @Expose() id: number

  @Transform(val => formatDate(val.value))
  readonly create_at: Date

  @Transform(val => formatDate(val.value))
  readonly update_at: Date

  public toJSON() {
    return AbstractEntity.toJSON(this)
  }
}
