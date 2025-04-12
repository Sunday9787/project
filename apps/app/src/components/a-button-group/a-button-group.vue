<template lang="pug">
view.a-button-group
  slot
</template>

<script lang="ts" setup>
defineOptions({
  name: 'a-button-group'
})
</script>

<style lang="scss">
.a-button-group {
  position: relative;
  display: flex;
  column-gap: 20rpx;
  justify-content: space-around;
}
</style>
