import { UserRole } from '@repo/service'
import { instanceToPlain } from 'class-transformer'
import { defineStore } from 'pinia'

import { AuthLocalEntity, LoginResultEntity } from '@/service/auth.entity'

export const useUserModule = defineStore('userModule', {
  state() {
    return instanceToPlain(new LoginResultEntity(), { strategy: 'exposeAll' }) as LoginResultEntity
  },
  getters: {
    isSurveyor: state => state.role === UserRole.surveyor
  },
  actions: {
    async logIn(auth: AuthLocalEntity) {
      const response = await AuthLocalEntity.logIn(LoginResultEntity.toJSON(auth))

      this.id = response.id
      this.tenant_id = response.tenant_id
      this.access_token = response.access_token
      this.refresh_token = response.refresh_token
      this.phone = response.phone
      this.nickname = response.nickname
      this.avatar = response.avatar
      this.role = response.role
      this.expires_in = response.expires_in
    },
    async logOut() {
      await AuthLocalEntity.logOut()
      this.$reset()
    }
  },
  persist: {
    storage: {
      getItem(key) {
        return uni.getStorageSync(key)
      },
      setItem(key, value) {
        uni.setStorageSync(key, value)
      }
    }
  }
})
