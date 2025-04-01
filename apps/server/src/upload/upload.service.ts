import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Oss from 'ali-oss'
import dayjs from 'dayjs'

@Injectable()
export class UploadService {
  private readonly client = new Oss({
    accessKeyId: this.config.get('OSS_ACCESS_KEY_ID')!,
    accessKeySecret: this.config.get('OSS_ACCESS_KEY_SECRET')!,
    bucket: this.config.get('OSS_BUCKET')
  })

  constructor(@Inject(ConfigService) private readonly config: ConfigService<Config>) {}

  async result() {
    console.log(666)
  }

  private getHost(location: string) {
    if (process.env.NODE_ENV === 'production') {
      return `//${this.config.get('OSS_ACCESS_URL')}`
    }

    return `//${this.config.get('OSS_BUCKET')}.${location}.aliyuncs.com`
  }

  private getPolicy() {
    return {
      expiration: dayjs().add(1, 'hour').toISOString(), // 请求有效期
      conditions: [
        ['content-length-range', 0, 1048576000] // 设置上传文件的大小限制
        // { bucket: client.options.bucket } // 限制可上传的bucket
      ]
    }
  }

  async signature() {
    const policy = this.getPolicy()
    const response: Oss.BucketLocation = await this.client.getBucketLocation(this.config.get('OSS_BUCKET')!)
    // 签名
    const formData = await this.client.calculatePostSignature(policy)
    // bucket域名
    const host = this.getHost(response.location)

    //回调
    const callback = {
      callbackUrl: 'http://localhost:3100/upload/result',
      callbackBody:
        'filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}',
      callbackBodyType: 'application/x-www-form-urlencoded'
    }

    return {
      expire: dayjs().add(1, 'hour').unix(),
      policy: formData.policy,
      signature: formData.Signature,
      accessid: formData.OSSAccessKeyId,
      host,
      callback: Buffer.from(JSON.stringify(callback)).toString('base64'),
      dir: this.config.get('OSS_DIR')
    }
  }
}
