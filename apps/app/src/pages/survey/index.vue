<template lang="pug">
view.page-view.scroll-y
  a-title(title="勘察")

  scroll-view.scroll-view.view-container
    template(v-for="item of data.list" :key="item.id")
      navigator(:url="`/pages/survey/item?id=${item.id}&type=edit&survey_id=${item.survey_id}`")
        wd-cell(title="受损部位" :value="item.damaged_part")

    view.loading-text
      text(v-if="loading") 正在加载
      text(v-if="!loading && !data.list") 没有更多数据了~

  view.view-container
    navigator(:url="`/pages/survey/item?survey_id=${id}&type=add`")
      wd-button(type="primary" block) 新增勘察
</template>

<script lang="ts" setup>
import { useSurveyList } from './hooks'

interface Props {
  id: string
  type: Utils.ActionType
}

const props = defineProps<Props>()
const { data, loading, refresh } = useSurveyList(props)

onShow(function () {
  const value = uni.getStorageSync<'need' | void>('survey:item:refresh')

  if (value === 'need') {
    refresh()
  }
})
</script>
