import { AbstractEntity } from '@repo/service'
import { Expose, Transform } from 'class-transformer'
import type { UploadBuildFormDataOption } from 'wot-design-uni/components/wd-upload/types'

import { OSSFormData, UploadService } from '@/service/upload.service'
import { useCacheModule } from '@/store/cache'
import { formatDate } from '@/utils'

export class BaseEntity extends AbstractEntity implements Service.ResponseBaseDTO {
  @Expose()
  id: number
  tenant_id: string
  @Transform(val => formatDate(val.value))
  create_at: number
  @Transform(val => formatDate(val.value))
  update_at: number
  constructor(id = 0) {
    super()
    this.id = id
  }

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
}
