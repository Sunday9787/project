<template lang="pug">
view.page-view
  wd-form(:model="project" ref="formInst")
    wd-cell-group(border)
      wd-input(label="项目名称" v-model="project.name" :rules="[{required: true, message: '请输入'}]")
      wd-input(label="委托单位" v-model="project.client" :rules="[{required: true, message: '请输入'}]")
      wd-input(label="项目所在地" v-model="project.location" :rules="[{required: true, message: '请输入'}]")
      wd-cell(title="业务负责人" :value="userModule.nickname")
      wd-select-picker(
        :columns="surveyUsers"
        v-model="project.selectMembers"
        label="调查人员"
        type="checkbox"
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
const { project } = useProject(props)
const formInst = ref<FormInstance>()

const surveyUsers = computed(function () {
  return cacheModule.users.filter(item => item.id !== userModule.id)
})

onLoad(function () {
  const title = props.type === 'edit' ? '编辑项目' : '创建项目'
  uni.setNavigationBarTitle({ title })
})

async function submit() {
  if (!formInst.value) {
    throw new Error('formInst 不存在')
  }

  const result = await formInst.value.validate()
  if (result.valid) {
    project.value.save()
    uni.navigateBack()
  }
}
</script>
