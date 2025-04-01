import { AbstractService } from '@/class/abstract.service'
import { request } from '@/utils/request'

import type { AuthEntityJSON } from './auth.entity'
import type { AuthLoginEntityResult } from './user.entity'

export class AuthService extends AbstractService {
  readonly baseURL = '/auth'

  logIn(data: AuthEntityJSON) {
    return request.post<AuthLoginEntityResult>(this.baseURL + '/login', data)
  }

  logOut() {
    return request.post(this.baseURL + '/logout')
  }
}
