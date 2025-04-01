import type { UploadFileItem } from 'wot-design-uni/components/wd-upload/types'

import { request } from '@/utils/request'

export class OssSignature {
  expire: number
  policy: string
  signature: string
  accessid: string
  host: string
  callback: string
  dir: string
}

export class OSSFormData {
  key: string
  policy: string
  OSSAccessKeyId: string
  success_action_status = '200'
  signature: string
}

export class UploadService {
  baseURL = '/upload'

  public generateFileName<O extends { dir: string }>(oss: O, file: UploadFileItem) {
    let suffix = file.url.substring(file.url.lastIndexOf('/') + 1) // 从图片路径中截取图片名称
    // #ifdef H5
    // h5端url中不包含扩展名，可以拼接一下name
    suffix = suffix + file.name
    // #endif

    const filename = Date.now() + suffix
    return [oss.dir, filename].join('/')
  }

  /**
   * 获取签名
   */
  public signature() {
    return request.post<OssSignature>(this.baseURL + '/signature')
  }
}
