<script lang="ts" setup>
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

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
/* stylelint-disable-next-line scss/load-partial-extension */
@import './styles/index.scss';
</style>
