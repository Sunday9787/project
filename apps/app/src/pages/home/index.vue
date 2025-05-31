<template lang="pug">
view.page-view
  wd-search(
    v-model.trim="form.keyword"
    placeholder="项目名称、委托单位"
    placeholder-left
    hide-cancel
    :maxlength="10"
    @search="onRefresh()")

  wd-gap

  view.view-container
    text
      | 共&nbsp;
      wd-text(:text="data.total" type="primary")
      | &nbsp;条数据

  wd-gap

  scroll-view.scroll-view.view-container(
    scroll-y
    scroll-anchoring
    refresher-enabled
    :refresher-threshold="100"
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresh"
    @scrolltolower="onLoadMore")
    view.scroll-view-loading(v-if="data.loading")
      wd-loading
    wd-status-tip(image="search" tip="当前搜索无结果" v-else-if="!data.list.length")

    template(v-for="item of data.list" :key="item.id")
      wd-gap v-if="data.list.at(0) !== item"
      project-card(:item="item")

    view.loading-text
      text(v-if="data.loading") 正在加载...
      text(v-if="isFinish") 没有更多数据了~
wd-fab(position="right-bottom" direction="top" type="primary")
  wd-button(type="primary" round @click="createProject()" custom-class="custom-button")
    wd-icon(name="evaluation" size="44rpx")
</template>

<script lang="ts" setup>
import { RequestList, ResponsePage } from '@/class/page'
import { ProjectItemEntity } from '@/service/project.entity'

import ProjectCard from './components/project-card.vue'

/**
 * 当前下拉刷新状态
 */
const isTriggered = ref(false)
const isFinish = ref(false)
const page = reactive(new RequestList())
const form = reactive(ProjectItemEntity.form())
const data = reactive(new ResponsePage<ProjectItemEntity>())

onLoad(onRefresh)
onShow(function () {
  const value = uni.getStorageSync<'need' | void>('project:action:refresh')
  if (value === 'need') {
    onRefresh()
  }
})

function onRefresh() {
  isTriggered.value = true
  page.current = 1
  search()
}

function onLoadMore() {
  if (page.current * page.size > data.total) {
    isFinish.value = true
    console.log('已经到底了')
    return
  }

  page.current += 1
  search(true)
}

async function search(bottom = false) {
  data.loading = true

  try {
    const response = await ProjectItemEntity.select({ ...page, ...form })
    data.list = bottom ? data.list.concat(response.list) : response.list
    data.total = response.total
  } finally {
    data.loading = false
    isTriggered.value = false
  }
}

function createProject() {
  uni.navigateTo({ url: '/pages/project/action?type=add' })
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
