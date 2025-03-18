<template>
  <view class="page-view" style="height: 100vh">
    <wd-tabs sticky v-model="tab" auto-line-width swipeable animated id="tabs">
      <wd-tab name="project" title="项目信息">
        <wd-cell-group custom-class="view-container">
          <wd-cell title-width="160rpx" title="项目名称" :value="project.name" />
          <wd-cell border title-width="160rpx" title="委托单位" :value="project.client" />
          <wd-cell border title-width="160rpx" title="项目所在地" :value="project.location" />
          <wd-cell border title-width="160rpx" title="业务负责人" :value="project.owner.nickname" />
          <wd-cell border title-width="160rpx" title="进度状态">
            <wd-text size="28rpx" :type="project.statusMap.type" :text="project.statusMap.text" />
          </wd-cell>
          <wd-cell border title-width="160rpx" title="调查人员" :value="project.investigatorUsers" />
        </wd-cell-group>
      </wd-tab>

      <wd-tab name="survey" title="调查名单">
        <view class="page-view">
          <wd-search
            sticky
            v-model="form.keyword"
            placeholder="房主姓名/身份证号"
            placeholder-left
            hide-cancel
            :maxlength="10"
            @search="onRefresh()"
            id="wd-search" />

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
              <owner-item :item="item" />
            </template>

            <view class="loading-text">
              <text v-if="data.loading">正在加载...</text>
              <text v-if="isFinish">没有更多数据了~</text>
            </view>
          </scroll-view>
        </view>
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onReady } from '@dcloudio/uni-app'

import { RequestList, ResponsePage } from '@/class/page'
import { SurveyItemEntity } from '@/service/survey.entity'

import OwnerItem from './components/owner-item.vue'
import { useProject } from './hooks'

interface Props {
  id: number
}

const props = defineProps<Props>()
const tab = ref<number>(0)
const project = useProject({ type: 'detail', id: props.id })

/**
 * 当前下拉刷新状态
 */
const isTriggered = ref(false)
const isFinish = ref(false)
const form = reactive(SurveyItemEntity.form())
const page = reactive(new RequestList())
const data = reactive(new ResponsePage<SurveyItemEntity>())
const instance = getCurrentInstance()!

onLoad(onRefresh)
onReady(function () {
  const query = uni.createSelectorQuery().in(instance.proxy)
  const elTab = query.select('#tabs >>> .wd-tabs__nav-item')
  const elSearch = query.select('#wd-search >>> .wd-search')
  elSearch
    .boundingClientRect(function (data) {
      console.log('elSearch', data)
    })
    .exec()

  elTab
    .boundingClientRect(function (data) {
      console.log('elTab', data)
    })
    .exec()
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
    const response = await SurveyItemEntity.select({ ...page, ...form })
    data.list = bottom ? data.list.concat(response.list) : response.list
    data.total = response.total
  } finally {
    data.loading = false
    isTriggered.value = false
  }
}
</script>
