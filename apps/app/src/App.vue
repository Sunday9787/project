<script lang="ts" setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(function () {
  console.log('App Launch')
})

onShow(function () {
  console.log('App Show')
})

onHide(function () {
  console.log('App Hide')
})
</script>

<style lang="scss">
/*每个页面公共css */
</style>
