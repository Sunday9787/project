import { AbstractService } from '@repo/service'

import { request } from '@/utils/request'

export class AuthService extends AbstractService {
  readonly baseURL = '/auth'

  logIn(data: Service.AuthLocalDTO) {
    return request.post<Service.ResponseUserLoginDTO>(this.baseURL + '/login', data)
  }

  logOut() {
    return request.post(this.baseURL + '/logout')
  }
}
