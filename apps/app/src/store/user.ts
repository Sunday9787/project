import { defineStore } from 'pinia'

import { AuthEntity, AuthLoginEntityResult } from '@/service/auth.entity'

export const useUserModule = defineStore('userModule', {
  state() {
    return AuthEntity.toJSON(new AuthLoginEntityResult())
  },
  actions: {
    async logIn(auth: AuthEntity) {
      const response = await AuthEntity.logIn(auth.toJSON())

      this.id = response.id
      this.tenant_id = response.tenant_id
      this.access_token = response.access_token
      this.refresh_token = response.refresh_token
      this.phone = response.phone
      this.nickname = response.nickname
      this.avatar = response.avatar
      this.role = response.role
    },
    async logOut() {
      await AuthEntity.logOut()
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
      },
    }
  }
})
