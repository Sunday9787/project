<template lang="pug">
app-card(flex1)
  n-space.size-full(vertical justify="center" align="center")
    n-spin(size="large")
    | 加载中...
</template>

<script setup lang="ts">
defineOptions({ name: 'app-loading' })
</script>
