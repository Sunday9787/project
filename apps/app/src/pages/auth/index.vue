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
          :rules="[{ required: true, message: '请填写密码' }]")

      wd-cell-group(custom-class="mt-40")
        wd-input(
          v-model="form.code"
          prop="code"
          clearable
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请填写验证码' }]")
          template(#suffix)
            wd-img(:src="code" width="100" height="34" @click="resetCode()")

      wd-cell-group(custom-class="mt-40")
        wd-button(block size="large" @click="handleSubmit()") 登录

  wd-toast
</template>

<script setup lang="ts">
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'

import { AuthEntity } from '@/service/auth.entity'
import { useCacheModule } from '@/store/cache'
import { useUserModule } from '@/store/user'

import { useAuthCode } from './hooks'

const userModule = useUserModule()
const cacheModule = useCacheModule()

const form = reactive(new AuthEntity())
const { code, resetCode } = useAuthCode()

const formRef = ref<FormInstance>()

async function handleSubmit() {
  if (!formRef.value) {
    throw new Error('Form 实例未找到')
  }

  const result = await formRef.value.validate()

  if (result.valid) {
    await userModule.logIn(form)
    await cacheModule.cache()
    uni.navigateTo({ url: '/pages/home/index' })
  }
}
</script>

<style lang="scss">
.auth-container {
  padding: 60rpx;
}

.auth-welcome {
  font-size: 80rpx;
}

.auth-form {
  margin-top: 120rpx;
}
</style>
