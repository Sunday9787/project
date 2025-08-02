<template lang="pug">
view.page-view.page-view--safe(style="height: 100vh")
  wd-tabs(sticky v-model="tab" auto-line-width swipeable animated id="tabs")
    wd-tab(name="project" title="项目信息")
      wd-cell-group(border)
        view.view-container
          wd-cell(title-width="160rpx" title="项目名称" :value="project.name")
          wd-cell(title-width="160rpx" title="委托单位" :value="project.client")
          wd-cell(title-width="160rpx" title="项目所在地" :value="project.location")
          wd-cell(title-width="160rpx" title="业务负责人" :value="project.owner.nickname")
          wd-cell(title-width="160rpx" title="进度状态")
            wd-text(size="28rpx" :type="project.statusMap.type" :text="project.statusMap.text")
          wd-select-picker(
            v-model="members"
            :columns="surveyUsers"
            readonly
            placeholder="暂无调查人员"
            label="调查人员"
            type="checkbox"
            label-key="nickname"
            value-key="id")
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
          @search="search()"
          id="wd-search"
          custom-style="width: 100vw")

        wd-gap

        view.view-container
          text
            | 共&nbsp;
            wd-text(:text="pagination.total" type="primary")
            | &nbsp;条数据

        wd-gap

        a-scroll-view.scroll-view.view-container()
          template(v-for="item of table.data" :key="item.id")
            wd-gap(v-if="table.data.at(0) !== item")
            owner-item(:item="item")

wd-fab(position="right-bottom" direction="top" type="primary")
  wd-button(type="primary" round @click="createSurvey()" custom-class="custom-button")
    wd-icon(name="spool" size="44rpx")
</template>

<script lang="ts" setup>
import { usePage } from '@/hooks/usePage'
import { SurveyEntity } from '@/service/survey.entity'
import { useCacheModule } from '@/store/cache'
import { useUserModule } from '@/store/user'

import OwnerItem from './components/owner-item.vue'
import { type Props, useProject } from './hooks'

const props = withDefaults(defineProps<Props>(), { type: 'detail' })
const userModule = useUserModule()
const cacheModule = useCacheModule()
const tab = ref(0)
const { project, refresh, members } = useProject(props)

const surveyUsers = computed(function () {
  return cacheModule.users.filter(item => item.id !== userModule.id)
})

const form = reactive(SurveyEntity.form())

const { search, table, pagination, onRefresh } = usePage({
  form,
  request: SurveyEntity.select
})
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

function createSurvey() {
  const param = new URLSearchParams({
    project_id: props.id,
    type: 'add'
  })

  uni.navigateTo({ url: '/pages/module_a/survey/action?' + param.toString() })
}

function editProject() {
  const param = new URLSearchParams({
    project_id: props.id,
    type: 'edit'
  })

  uni.navigateTo({ url: '/pages/module_a/project/action?' + param.toString() })
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
