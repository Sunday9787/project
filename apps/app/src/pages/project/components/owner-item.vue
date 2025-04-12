<template lang="pug">
view.owner-item(@click="toDetail()")
  view.owner-item__status
    text.owner-item--time {{ item.create_at }}
    view.flex-1
    wd-text(size="28rpx" :type="item.statusMap.type" :text="item.statusMap.text")

  h1.owner-item__line.line-1
    text 房主姓名: {{ item.owner }}

  h1.owner-item__line.line-1
    text 身份证号: {{ item.id_card }}
</template>

<script lang="ts" setup>
import { SurveyItemEntity } from '@/service/survey.entity'

interface Props {
  item: SurveyItemEntity
}

const { item } = defineProps<Props>()

function toDetail() {
  uni.navigateTo({ url: `/pages/survey/action?id=${item.id}&type=edit` })
}
</script>

<style lang="scss">
.owner-item {
  position: relative;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  &__title {
    font-size: 40rpx;
  }

  &__status {
    display: flex;
  }

  &__line {
    font-size: 28rpx;
  }
}
</style>
