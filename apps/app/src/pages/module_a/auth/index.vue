<template lang="pug">
section.auth-container
  view.auth-welcome
    p
      text 你好,
    p
      text 欢迎登录

  view.auth-form
    wd-form(ref="formRef" :model="form")
      wd-cell-group
        wd-input(
          v-model="form.phone"
          prop="phone"
          clearable
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请填写用户名' }]")

      wd-cell-group(custom-class="mt-40")
        wd-input(
          v-model="form.password"
          prop="password"
          show-password
          clearable
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          @confirm="handleSubmit")

      wd-cell-group(custom-class="mt-40")
        wd-button(block size="large" @click="handleSubmit()") 登录

  wd-toast
</template>

<script setup lang="ts">
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'

import { AuthLocalEntity } from '@/service/auth.entity'
import { useCacheModule } from '@/store/cache'
import { useUserModule } from '@/store/user'

const userModule = useUserModule()
const cacheModule = useCacheModule()

const form = shallowReactive(new AuthLocalEntity())

const formRef = shallowRef<FormInstance>()

async function handleSubmit() {
  if (!formRef.value) {
    throw new Error('Form 实例未找到')
  }

  const result = await formRef.value.validate()

  if (result.valid) {
    await userModule.logIn(form)
    await cacheModule.cache()
    uni.navigateTo({ url: '/pages/module_a/home/index' })
  }
}
</script>

<style lang="scss">
.auth-container {
  padding-top: calc(30px + env(safe-area-inset-top));
  padding-right: 30px;
  padding-bottom: calc(30px + env(safe-area-inset-bottom));
  padding-left: 30px;
}

.auth-welcome {
  font-size: 40px;
}

.auth-form {
  margin-top: 60px;
}
</style>
