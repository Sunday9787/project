import { AbstractService } from '@/class/abstract.service'
import { request } from '@/utils/request'

import type { UserEntity } from './user.entity'

export class UserService extends AbstractService {
  baseURL = '/user'

  cache() {
    return request.get<UserEntity[]>(this.baseURL + '/cache')
  }
}
