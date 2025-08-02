<template lang="pug">
view.page-view
  wd-search(
    v-model.trim="form.keyword"
    placeholder="项目名称、委托单位"
    placeholder-left
    hide-cancel
    :maxlength="10"
    @search="search")

  wd-gap

  view.view-container
    text
      | 共&nbsp;
      wd-text(:text="pagination.total" type="primary")
      | &nbsp;条数据

  wd-gap

  .scroll-view.view-container
    a-scroll-view
      template(v-for="item of table.data" :key="item.id")
        wd-gap(v-if="table.data.at(0) !== item")
        project-card(:item="item")

  layout-tabbar

wd-fab(position="right-bottom" direction="top" type="primary")
  wd-button(type="primary" round @click="createProject()" custom-class="custom-button")
    wd-icon(name="evaluation" size="44rpx")
</template>

<script lang="ts" setup>
import { usePage } from '@/hooks/usePage'
import { useRefresh } from '@/hooks/useRefresh'
import { ProjectItemEntity } from '@/service/project.entity'

import ProjectCard from './components/project-card.vue'

const form = reactive(ProjectItemEntity.form())

const { table, onRefresh, search, pagination } = usePage({
  form,
  request: ProjectItemEntity.select
})

useRefresh('project:action:refresh', onRefresh)

function createProject() {
  uni.navigateTo({ url: '/pages/module_a/project/action?type=add' })
}
</script>

<style lang="scss">
:deep(.custom-button) {
  box-sizing: border-box;
  width: 32px !important;
  min-width: auto !important;
  height: 32px !important;
  margin: 8rpx;
  border-radius: 16px !important;
}
</style>
