<template>
  <view class="project-card" @click="toDetail()">
    <view class="project-card__status">
      <text class="project-card--time">{{ item.create_at }}</text>
      <view class="flex-1" />
      <wd-text size="28rpx" :type="item.statusMap.type" :text="item.statusMap.text" />
    </view>

    <h1 class="project-card__title line-1">
      <text>{{ item.name }}</text>
    </h1>
    <p class="project-card__line line-1">
      <text>委托单位：</text>
      <text>{{ item.client }}</text>
    </p>
    <p class="project-card__line line-1">
      <text>项目地址：</text>
      <text>{{ item.location }}</text>
    </p>
    <p class="project-card__footer">
      <text>负责人：</text>
      <wd-tag type="primary" round>{{ item.owner.nickname }}</wd-tag>
    </p>
  </view>
</template>

<script lang="ts" setup>
import type { ProjectItemEntity } from '@/service/project.entity'

defineOptions({ name: 'project-card' })

interface Props {
  item: ProjectItemEntity
}

const { item } = defineProps<Props>()

function toDetail() {
  uni.navigateTo({ url: `/pages/project/detail?id=${item.id}` })
}
</script>

<style lang="scss">
.project-card {
  position: relative;
  padding: 20rpx;
  // margin-top: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;

  &--time {
    font-size: 24rpx;
    color: #757575;
  }

  &__title {
    font-size: 40rpx;
  }

  &__line {
    font-size: 28rpx;
  }

  &__status {
    display: flex;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 20rpx;
  }
}
</style>
