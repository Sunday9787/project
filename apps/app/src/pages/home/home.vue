<template>
  <view class="page-view">
    <wd-search
      v-model="form.keyword"
      placeholder="项目名称、委托单位"
      placeholder-left
      hide-cancel
      :maxlength="10"
      @search="onRefresh()" />

    <wd-gap />

    <view class="view-container">
      <text>共 <wd-text :text="data.total" type="primary" /> 条数据</text>
    </view>

    <wd-gap />

    <scroll-view
      class="scroll-view view-container"
      scroll-y
      scroll-anchoring
      refresher-enabled
      :refresher-threshold="100"
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore">
      <view v-if="data.loading" class="scroll-view-loading">
        <wd-loading />
      </view>
      <wd-status-tip image="search" tip="当前搜索无结果" v-else-if="!data.list.length" />

      <template v-for="item of data.list" :key="item.id">
        <wd-gap v-if="data.list.at(0) !== item" />
        <project-card :item="item" />
      </template>

      <view class="loading-text">
        <text v-if="data.loading">正在加载...</text>
        <text v-if="isFinish">没有更多数据了~</text>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'

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
</script>
