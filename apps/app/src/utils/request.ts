import { needRefreshToken, PrjHttpStatus } from '@repo/service'
import axios, { type AxiosRequestConfig } from 'axios'
import qs from 'qs'

import { useUserModule } from '@/store/user'

import { getGlobalThis } from '.'

const globalThis = getGlobalThis()

export function baseURL(url: string = '') {
  return import.meta.env.VITE_APP_BASE_API + url
}

const refreshURL = new globalThis.URL(baseURL('/auth/refresh'))

function refreshToken(token: string) {
  return request<{ access_token: string; expires_in: number }>({
    method: 'post',
    baseURL: refreshURL.origin,
    url: refreshURL.pathname,
    params: { token }
  })
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

  config.headers.set('X-platform', 'wechat')
  if (userModule.access_token) {
    config.headers.setAuthorization(`Bearer ${userModule.access_token}`)
    config.headers.set('Tenant-Id', userModule.tenant_id)
  }

  return config
})

AxiosInstance.interceptors.response.use(async function (response) {
  const userModule = useUserModule()

  /**
   * 无感刷新 access_token
   */
  if (refreshURL.pathname !== response.config.url && userModule.expires_in && needRefreshToken(userModule.expires_in)) {
    const { data } = await refreshToken(userModule.refresh_token)
    userModule.access_token = data.access_token
    userModule.expires_in = data.expires_in
    // TODO: 重点！必须要重新将请求重新发出
    return AxiosInstance(response.config)
  }

  if (response.data.code !== PrjHttpStatus.OK_REQUEST) {
    console.error(response.data)

    if (response.data.code === PrjHttpStatus.USER_NOT_FOUND) {
      uni.showToast({
        icon: 'error',
        title: '用户不存在',
        duration: 1000
      })

      console.error('用户不存在')
      return Promise.reject(response)
    }

    if (response.data.code === PrjHttpStatus.TENANT_ID_NOT_FOUND) {
      uni.showToast({
        icon: 'error',
        title: '租户不存在',
        duration: 1000,
        success() {
          setTimeout(function () {
            uni.redirectTo({ url: '/pages/auth/index' })
          }, 1000)
        }
      })
      console.error('租户不存在')
      return Promise.reject(response)
    }

    // ! REFRESH__TOKEN 失效退出登录
    if (
      response.data.code === PrjHttpStatus.USER_REFRESH_TOKEN_INVALID ||
      response.data.code === PrjHttpStatus.USER_TOKEN_INVALID
    ) {
      uni.showToast({
        icon: 'error',
        title: 'token失效 请重新登录',
        success() {
          userModule.$reset()
          setTimeout(function () {
            uni.redirectTo({ url: '/pages/auth/index' })
          }, 1000)
        }
      })
      console.error('token失效 请重新登录')
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
