<template>
  <view class="owner-item">
    <view class="owner-item__status">
      <text class="owner-item--time">{{ item.create_at }}</text>
      <view class="flex-1" />
      <wd-text size="28rpx" :type="item.statusMap.type" :text="item.statusMap.text" />
    </view>

    <h1 class="owner-item__line line-1">
      <text>房主姓名: {{ item.owner }}</text>
    </h1>

    <h1 class="owner-item__line line-1">
      <text>身份证号: {{ item.id_card }}</text>
    </h1>
  </view>
</template>

<script lang="ts" setup>
import { SurveyItemEntity } from '@/service/survey.entity'

interface Props {
  item: SurveyItemEntity
}

defineProps<Props>()
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
