import { AbstractService } from '@/class/abstract.service'
import { request } from '@/utils/request'

import { ResponseUserPlainDTO } from './user.entity'

export class UserService extends AbstractService {
  baseURL = '/user'

  cache() {
    return request.get<ResponseUserPlainDTO[]>(this.baseURL + '/cache')
  }
}
