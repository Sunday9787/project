<template lang="pug">
view.a-title {{ title }}
</template>

<script lang="ts" setup>
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style lang="scss">
.a-title {
  padding: 15px 0;
  font-size: 24px;
  text-align: center;
  background-color: #fff;
}
</style>
