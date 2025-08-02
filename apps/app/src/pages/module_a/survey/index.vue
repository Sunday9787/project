<template lang="pug">
view.page-view.scroll-y
  a-title(title="勘察")

  scroll-view.scroll-view.view-container
    template(v-for="item of data" :key="item.id")
      wd-cell(title="受损部位" :value="item.damaged_part" @click="toDetail(item)")

    view.loading-text
      text(v-if="loading") 正在加载
      text(v-if="!loading && !data.length") 没有更多数据了~

  view.view-container
    wd-button(type="primary" block @click="create()") 新增勘察
</template>

<script lang="ts" setup>
import { SurveyItemEntity } from '@/service/survey.entity'

import { type Props, useSurveyList } from './hooks'

const props = defineProps<Props>()
const { data, loading, refresh } = useSurveyList(props)

onShow(function () {
  const value = uni.getStorageSync<'need' | void>('survey:item:refresh')

  if (value === 'need') {
    refresh()
  }
})

function create() {
  const param = new URLSearchParams({
    survey_id: props.id,
    type: 'add'
  })

  uni.navigateTo({
    url: '/pages/module_a/survey/item' + param.toString()
  })
}

function toDetail(item: SurveyItemEntity) {
  const param = new URLSearchParams({
    id: String(item.id),
    type: 'add',
    survey_id: String(item.survey_id)
  })

  uni.navigateTo({
    url: '/pages/module_a/survey/item?' + param.toString()
  })
}
</script>
