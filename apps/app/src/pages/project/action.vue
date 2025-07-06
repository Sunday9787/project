<template lang="pug">
view.page-view
  wd-form(:model="project" ref="formInst")
    wd-cell-group(border)
      wd-input(label="项目名称" prop="name" v-model="project.name" :rules="[{ required: true, message: '请输入项目名称' }]")
      wd-input(label="委托单位" prop="client" v-model="project.client" :rules="[{ required: true, message: '请输入委托单位' }]")
      wd-input(label="项目所在地" prop="location" v-model="project.location" :rules="[{ required: true, message: '请输入项目所在地' }]")
      wd-cell(title="业务负责人" :value="project.owner.nickname")
      wd-select-picker(
        :columns="surveyUsers"
        v-model="members"
        label="调查人员"
        type="checkbox"
        prop="members"
        label-key="nickname"
        value-key="id"
        filterable)

  view.flex-1

  view.view-container
    wd-button(type="primary" block @click="submit()") 提交
</template>

<script lang="ts" setup>
import type { FormInstance } from 'wot-design-uni/components/wd-form/types'

import { useCacheModule } from '@/store/cache'
import { useUserModule } from '@/store/user'

import { useProject } from './hooks'

interface Props {
  id: string
  type: Utils.ActionType
}

const props = defineProps<Props>()
const userModule = useUserModule()
const cacheModule = useCacheModule()
const { project, members } = useProject(props)
const formInst = ref<FormInstance>()

const surveyUsers = computed(function () {
  return cacheModule.users.filter(item => item.id !== userModule.id)
})

onLoad(function () {
  const title = props.type === 'edit' ? '编辑项目' : '创建项目'
  uni.setNavigationBarTitle({ title })
  uni.removeStorageSync('project:action:refresh')
})

async function submit() {
  if (!formInst.value) {
    throw new Error('formInst 不存在')
  }

  const result = await formInst.value.validate()
  if (result.valid) {
    await project.value.save()
    uni.setStorageSync('project:action:refresh', 'need')
    uni.navigateBack()
  }
}
</script>
