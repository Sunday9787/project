<template lang="pug">
app-view
  app-card
    app-form-collapse
      n-form.app-form(:model="form" :show-feedback="false" label-placement="left" :label-width="80")
        n-form-item(label="客户名称" path="client")
          n-input(v-model:value="form.client" clearable)
        n-form-item(label="项目名称" path="name")
          n-input(v-model:value="form.name" clearable)
      template(#action)
        n-button(type="primary" @click="search()") 搜索
        n-button(attr-type="reset" @click="reset()") 重置

  app-data-view
    app-table-container
      template(#action)
        n-space(justify="end" :wrap-item="false")
          router-link(to="/project/action?type=add")
            n-button(type="primary") 添加项目

      n-data-table.h-full(
        flex-height
        remote
        :pagination="pagination"
        :data="table.data"
        :columns
        :loading="table.loading")
</template>

<script setup lang="ts">
import { usePage } from '@/hooks/usePage'
import { ProjectEntity } from '@/service/project.entity'

import { createTableColumns } from './table'

defineOptions({ name: 'PageProjectList' })

const form = reactive(ProjectEntity.form())
const { table, pagination, search, reset } = usePage({
  request: ProjectEntity.select,
  form,
  timeFieldMap: {
    createdDate: ['created_start', 'created_end']
  }
})

const message = useMessage()
const dialog = useDialog()
const columns = createTableColumns({
  del(row, rowIndex) {
    dialog.warning({
      title: '提示',
      transformOrigin: 'center',
      content: `确认删除【${row.name}】 产品？`,
      positiveText: '确认',
      negativeText: '取消',
      async onPositiveClick() {
        await row.del()
        table.data.splice(rowIndex, 1)
        message.success('删除成功')
      }
    })
  }
})
</script>
