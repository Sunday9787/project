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
      this.access_token = response.access_token
      this.refresh_token = response.refresh_token
      this.phone = response.phone
      this.nickname = response.nickname
      this.avatar = response.avatar
    },
    async logOut() {
      await AuthEntity.logOut()
      this.$reset()
    }
  },
  persist: true
})
