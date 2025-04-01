<script lang="ts" setup>
import { useCacheModule } from './store/cache'
import { useUserModule } from './store/user'

const cacheModule = useCacheModule()
const userModule = useUserModule()

onLaunch(function () {
  console.log('App Launch')
  if (userModule.access_token) {
    cacheModule.cache()
  }
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
