<template lang="pug">
view.project-card(@click="toDetail()")
  view.project-card__status
    text.project-card--time {{ item.create_at }}
    view.flex-1
    wd-text(size="28rpx" :type="item.statusMap.type" :text="item.statusMap.text")

  h1.project-card__title.line-1
    text {{ item.name }}
  p.project-card__line.line-1
    text 委托单位：
    text {{ item.client }}
  p.project-card__line.line-1
    text 项目地址：
    text {{ item.location }}
  p.project-card__footer
    text 负责人：
    wd-tag(type="primary" round) {{ item.ownerName }}
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
