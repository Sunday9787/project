import { defineStore } from 'pinia'

import { OssSignature, UploadService } from '@/service/upload.service'
import { UserEntity } from '@/service/user.entity'

const uploadService = new UploadService()

interface State {
  users: UserEntity[]
  oss: OssSignature | null
}

export const useCacheModule = defineStore('cache', {
  state() {
    return {
      users: [],
      oss: null
    } as State
  },
  getters: {
    userMap: state => new Map<number, UserEntity>(state.users.map(item => [item.id, item]))
  },
  actions: {
    async cache() {
      console.log('----缓存开始----')
      await Promise.all([this.cacheUsers(), this.cacheOssSignature()])
      console.log('----缓存完毕----')
    },
    async cacheUsers() {
      const response = await UserEntity.cache()
      this.users = response
    },
    async cacheOssSignature() {
      const response = await uploadService.signature()
      this.oss = response
    }
  }
})
