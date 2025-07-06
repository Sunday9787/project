import { defineStore } from 'pinia'

import { OssSignature, UploadService } from '@/service/upload.service'
import { ResponseUserPlainDTO } from '@/service/user.entity'

const uploadService = new UploadService()

interface State {
  users: ResponseUserPlainDTO[]
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
    userMap: state => new Map<number, ResponseUserPlainDTO>(state.users.map(item => [item.id, item]))
  },
  actions: {
    async cache() {
      console.log('----缓存开始----')
      await Promise.all([this.cacheUsers(), this.cacheOssSignature()])
      console.log('----缓存完毕----')
    },
    async cacheUsers() {
      const response = await ResponseUserPlainDTO.cache()
      this.users = response
    },
    async cacheOssSignature() {
      const response = await uploadService.signature()
      this.oss = response
    }
  }
})
