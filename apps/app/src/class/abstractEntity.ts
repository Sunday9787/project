import { formatDate } from "@/utils"
import { Transform, instanceToPlain } from "class-transformer"

type ObjectKey<T> = keyof T extends `${infer U}` ? U : string
type AbstractEntityMethodKey = ObjectKey<AbstractEntity>
type EntityMethodKey = ObjectKey<AbstractEntityMethod>
type ExcludeEntityAttribute = EntityMethodKey | AbstractEntityMethodKey
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

  @Transform(val => formatDate(val.value))
  readonly createAt: Date

  @Transform(val => formatDate(val.value))
  readonly updateAt: Date

  public toJSON() {
    return AbstractEntity.toJSON(this)
  }
}
