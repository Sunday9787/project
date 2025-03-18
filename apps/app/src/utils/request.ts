import axios, { type AxiosRequestConfig } from 'axios'
import qs from 'qs'

import { useUserModule } from '@/store/user'

enum QyHttpStatus {
  USER_NOT_FOUND = 1000,
  USER_PASSWORD_WRONG = 1001,
  USER_TOKEN_INVALID = 1002,
  USER_REFRESH_TOKEN_INVALID = 1003,
  USER_EXISTED = 1004,
  TENANT_ID_NOT_FOUND = 1005,
  BAD_REQUEST = 0,
  OK_REQUEST = 200
}

export function baseURL(url: string = '') {
  return 'http://localhost:3000' + url
}

const AxiosInstance = axios.create({
  timeout: 5000,
  baseURL: baseURL(),
  headers: {
    'Content-type': 'application/json'
  },
  withCredentials: true,
  adapter(config) {
    return new Promise(function (resolve, reject) {
      let url = config.url || ''

      if (config.params) {
        const queryString = qs.stringify(config.params, { arrayFormat: 'repeat' })
        url += (url.includes('?') ? '&' : '?') + queryString
      }

      uni.request({
        header: config.headers.toJSON(),
        method: config.method as UniNamespace.RequestOptions['method'],
        data: config.data,
        url: `${config.baseURL}${url}`,
        success(result) {
          resolve({
            data: result.data,
            status: result.statusCode,
            statusText: 'ok',
            headers: result.header,
            config
          })
        },
        fail(result) {
          reject(result)
        }
      })
    })
  }
})

AxiosInstance.interceptors.request.use(function (config) {
  const userModule = useUserModule()

  if (userModule.access_token) {
    config.headers.setAuthorization(`Bearer ${userModule.access_token}`)
    config.headers.set('Tenant_Id', userModule.tenant_id)
  }

  return config
})

AxiosInstance.interceptors.response.use(function (response) {
  const userModule = useUserModule()
  if (response.data.code !== QyHttpStatus.OK_REQUEST) {
    console.error(response.data)

    if (response.data.code === QyHttpStatus.TENANT_ID_NOT_FOUND) {
      uni.showToast({ icon: 'error', title: '租户不存在' })
      console.error('租户不存在')
      setTimeout(function () {
        uni.redirectTo({ url: '/pages/auth/auth' })
      }, 0)
      return Promise.reject(response)
    }

    // ! REFRESH__TOKEN 失效退出登录
    if (
      response.data.code === QyHttpStatus.USER_REFRESH_TOKEN_INVALID ||
      response.data.code === QyHttpStatus.USER_TOKEN_INVALID
    ) {
      uni.showToast({ icon: 'error', title: 'token失效 请重新登录' })
      console.error('token失效 请重新登录')
      userModule.$reset()
      window.setTimeout(function () {
        uni.redirectTo({ url: '/pages/auth/auth' })
      }, 0)
      return Promise.reject(response)
    }

    return Promise.reject(response)
  }

  return response
})

export function request<R = null>(config: AxiosRequestConfig) {
  return AxiosInstance.request<AppResponse.Body<R>>(config).then(response => response.data)
}

request.put = function <R = null>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return AxiosInstance.put<AppResponse.Body<R>>(url, data, config).then(response => response.data.data)
}

request.post = function <R = null>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return AxiosInstance.post<AppResponse.Body<R>>(url, data, config).then(response => response.data.data)
}

request.delete = function <R = null>(url: string) {
  return AxiosInstance.delete<AppResponse.Body<R>>(url).then(response => response.data.data)
}

request.get = function <R = null>(url: string, config?: AxiosRequestConfig) {
  return AxiosInstance.get<AppResponse.Body<R>>(url, config).then(response => response.data.data)
}
