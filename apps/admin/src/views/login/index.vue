<template lang="pug">
.flex.h-full
  n-flex.flex-1(justify="center" align="center" vertical)
    img(src="/image/login-box-bg.svg" class="w-[350px] aspect-square")
    p.text-3xl 欢迎使用本系统
    p.mt-4 开箱即用的中后台管理系统

  .login-container.flex-1
    h1.login-title 登录

    n-form.login-form(ref="formRef" label-placement="left" :model="form" :rules="formRule" :label-width="80" @keyup.enter="login()")
      n-form-item(label="手机号" path="phone" :theme-overrides="formItemTheme")
        n-input(v-model:value="form.phone" placeholder="请输入邮箱")

      n-form-item(label="密码" path="password" :theme-overrides="formItemTheme")
        n-input(type="password" v-model:value="form.password" placeholder="请输入密码")

      n-form-item(label="验证码" path="code" :theme-overrides="formItemTheme")
        n-input-group
          n-input.flex-1(v-model:value="form.code" placeholder="请输入验证码")
          n-image(
            :src="code"
            :preview-disabled="true"
            object-fit="cover"
            style="width: 100px;"
            @click="resetCode()")

      n-form-item
        .flex.flex-1
          n-button(type="primary" block @click="login()") 登录
</template>

<script lang="ts" setup>
import { type FormInst, type FormItemProps, useMessage } from 'naive-ui'

import { AuthEntity } from '@/service/auth.entity'
import { useUserModule } from '@/store/modules/user'

import { useAuthCode } from './hooks/useAuthCode'

interface Props {
  redirect?: string
}

defineOptions({ name: 'PageLogin' })
const props = defineProps<Props>()
const message = useMessage()

const { code, resetCode } = useAuthCode()
const router = useRouter()
const userModule = useUserModule()
const formRef = shallowRef<FormInst>()
const form = shallowReactive(new AuthEntity())

const formRule: FormRule<Service.AuthLocalDTO> = {
  phone: { required: true, message: '请输入邮箱' },
  code: { required: true, message: '请输入验证码' },
  password: { required: true, message: '请输入密码' }
}

const formItemTheme: NonNullable<FormItemProps['themeOverrides']> = { labelTextColor: '#fff' }

async function login() {
  await formRef.value?.validate()
  try {
    await userModule.logIn(form)
  } catch {
    resetCode()
    form.code = ''
    return
  }

  if (props.redirect) {
    router.replace(props.redirect)
    return
  }

  router.replace('/dashboard')
}

onMounted(function () {
  window.$message = message
})
</script>

<style lang="less">
.login-container {
  @apply flex;
  @apply min-h-full;
  @apply flex-col;
  @apply px-6;
  @apply py-10;
  @apply lg:px-8;
  @apply bg-slate-800;
}

.login-title {
  margin-top: 16vh;

  @apply text-white;
  @apply text-center;
  @apply text-2xl;
  @apply font-bold;
  @apply leading-9;
  @apply tracking-tight;
}

.login-form {
  @apply mt-10;
  @apply sm:mx-auto;
  @apply sm:w-full;
  @apply sm:max-w-sm;
}
</style>
