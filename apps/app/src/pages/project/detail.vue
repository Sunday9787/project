<template lang="pug">
view.page-view(style="height: 100vh")
  wd-tabs(sticky v-model="tab" auto-line-width swipeable animated id="tabs")
    wd-tab(name="project" title="项目信息")
      wd-cell-group(border)
        view.view-container
          wd-cell(title-width="160rpx" title="项目名称" :value="project.name")
          wd-cell( title-width="160rpx" title="委托单位" :value="project.client")
          wd-cell( title-width="160rpx" title="项目所在地" :value="project.location")
          wd-cell( title-width="160rpx" title="业务负责人" :value="project.ownerName")
          wd-cell( title-width="160rpx" title="进度状")
            wd-text(size="28rpx" :type="project.statusMap.type" :text="project.statusMap.text")
          wd-select-picker(v-model="project.selectMembers" readonly :columns="surveyUsers" placeholder="暂无调查人员" label="调查人员" type="checkbox" label-key="nickname" value-key="id")
          wd-cell
            wd-button(type="primary" v-if="!userModule.isSurveyor" @click="editProject()") 编辑

    wd-tab(name="survey" title="调查名单")
      view.page-view(:style="pageViewStyle")
        wd-search(
          sticky
          v-model.trim="form.keyword"
          placeholder="房主姓名/身份证号"
          placeholder-left
          hide-cancel
          :maxlength="10"
          @search="onRefresh()"
          id="wd-search"
          custom-style="width: 100vw")

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
            wd-gap(v-if="data.list.at(0) !== item")
            owner-item(:item="item")

          view.loading-text
            text(v-if="data.loading") 正在加载...
            text(v-if="isFinish") 没有更多数据了~
</template>

<script lang="ts" setup>
import { RequestList, ResponsePage } from '@/class/page'
import { SurveyItemEntity } from '@/service/survey.entity'
import { useCacheModule } from '@/store/cache'
import { useUserModule } from '@/store/user'

import OwnerItem from './components/owner-item.vue'
import { useProject } from './hooks'

interface Props {
  id: string
}

const userModule = useUserModule()
const cacheModule = useCacheModule()
const props = defineProps<Props>()
const tab = ref<number>(0)
const { project, refresh } = useProject({ type: 'detail', id: props.id })

const surveyUsers = computed(function () {
  return cacheModule.users.filter(item => item.id !== userModule.id)
})

/**
 * 当前下拉刷新状态
 */
const isTriggered = ref(false)
const isFinish = ref(false)
const form = reactive(SurveyItemEntity.form())
const page = reactive(new RequestList())
const data = reactive(new ResponsePage<SurveyItemEntity>())
const instance = getCurrentInstance()!
const pageViewStyle = reactive({ height: '100%' })

onLoad(onRefresh)

onShow(function () {
  if (project.value.owner_id) {
    refresh()
  }
})

/**
 * FIXME: 解决调查名单 scroll-view 无法滚动
 */
onReady(function () {
  const query = uni.createSelectorQuery().in(instance.proxy)
  const elTab = query.select('#tabs >>> .wd-tabs__nav-item')

  elTab
    .boundingClientRect(function (data) {
      if (data instanceof Array) return
      pageViewStyle.height = `calc(100vh - ${data.height}px)`
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

function editProject() {
  uni.navigateTo({ url: `/pages/project/action?id=${props.id}&type=edit` })
}
</script>
