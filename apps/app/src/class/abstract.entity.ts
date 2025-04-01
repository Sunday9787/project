import { type ClassConstructor, Expose, instanceToPlain, plainToInstance, Transform } from 'class-transformer'
import type { UploadBuildFormDataOption } from 'wot-design-uni/components/wd-upload/types'

import { OSSFormData, type UploadService } from '@/service/upload.service'
import { useCacheModule } from '@/store/cache'
import { formatDate } from '@/utils'

type ObjectKey<T> = Exclude<keyof T, 'id'>
type EntityMethodKey = ObjectKey<AbstractEntityMethod>
type AbstractEntityMethodKey = ObjectKey<AbstractEntity>
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

export class BaseEntity {
  @Expose() id = 0
}

export abstract class AbstractEntity extends BaseEntity {
  public static toJSON<T extends object>(context: T) {
    return instanceToPlain(context, { excludeExtraneousValues: true }) as EntityJSON<T>
  }

  public static async wrapperList<T>(context: ClassConstructor<T>, Result: Promise<AppResponse.List<T>>) {
    const response = await Result
    response.list = plainToInstance(context, response.list, { exposeDefaultValues: true })
    return response
  }

  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T>): Promise<T>
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T[]>): Promise<T[]>
  public static async wrapper<T>(context: ClassConstructor<T>, Result: Promise<T | T[]>): Promise<T | T[]> {
    const response = await Result

    if (Array.isArray(response)) {
      return response.map(item => plainToInstance(context, item, { exposeDefaultValues: true }))
    }

    return plainToInstance(context, response, { exposeDefaultValues: true })
  }

  @Transform(val => formatDate(val.value))
  readonly create_at: Date

  @Transform(val => formatDate(val.value))
  readonly update_at: Date

  public async doBuildFormData(option: UploadBuildFormDataOption, uploadService: UploadService) {
    const cacheModule = useCacheModule()
    const config = new OSSFormData()

    if (!cacheModule.oss) {
      await cacheModule.cacheOssSignature()
    }

    config.policy = cacheModule.oss!.policy
    config.OSSAccessKeyId = cacheModule.oss!.accessid
    config.signature = cacheModule.oss!.signature
    config.key = uploadService.generateFileName(cacheModule.oss!, option.file)

    option.resolve(config)
  }

  public toJSON() {
    return AbstractEntity.toJSON(this)
  }
}
