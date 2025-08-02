<template lang="pug">
scroll-view(
  scroll-y
  scroll-anchoring
  refresher-enabled
  :lower-threshold="100"
  :refresher-threshold="100"
  :refresher-triggered="isTriggered"
  @refresherrefresh="onRefresh"
  @scrolltolower="onLoadMore"
)
  view.scroll-view-loading(v-if="table.loading")
    wd-loading
  wd-status-tip(image="search" tip="当前搜索无结果" v-if="!table.data.length && table.loading")

  slot

  view.loading-text
    text(v-if="table.loading") 正在加载...
    text(v-if="isFinish") 没有更多数据了~
</template>

<script setup lang="ts">
import { type PageInst, PageInstKey } from '@/hooks/usePage'

defineOptions({ name: 'a-scroll-view' })

const { isTriggered, onRefresh, onLoadMore, isFinish, table } = inject<PageInst>(PageInstKey)!
</script>
