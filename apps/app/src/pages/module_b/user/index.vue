<template lang="pug">
view.page-view.page-view--safe
  view.user-head
    wd-img(:src="userModule.avatar" custom-class="user-avatar")
    view.user-title
      text {{ userModule.nickname }}
    view.user-subtitle
      text {{ userModule.phone }}

  view.user-content
    //- 用户导航
    view.user-nav-container
      a-card(custom-class="user-grid")
        view.user-grid-item
          view.user-grid-item-media
            image.user-grid-item-icon(src="@/icon/order.svg")
          text.user-grid-item-text 我的订单

        view.user-grid-item
          view.user-grid-item-media
            image.user-grid-item-icon(src="@/icon/position.svg")
          text.user-grid-item-text 收货地址

        view.user-grid-item
          view.user-grid-item-media
            image.user-grid-item-icon(src="@/icon/love.svg")
          text.user-grid-item-text 我的收藏

        view.user-grid-item
          view.user-grid-item-media
            image.user-grid-item-icon(src="@/icon/ring.svg")
          text.user-grid-item-text 消息中心

    //- 用户菜单
    view.user-menu-container
      view.user-cell
        view.user-cell-label
          image.user-cell-label-icon(src="@/icon/config.svg")
        text 账户设置
        view.flex-1
        image.user-cell-icon(src="@/icon/arrow-right.svg")

      view.user-cell
        view.user-cell-label
          image.user-cell-label-icon(src="@/icon/contact.svg")
        text 客服帮助
        view.flex-1
        image.user-cell-icon(src="@/icon/arrow-right.svg")

      view.user-cell
        view.user-cell-label
          image.user-cell-label-icon(src="@/icon/safe.svg")
        text 隐私设置
        view.flex-1
        image.user-cell-icon(src="@/icon/arrow-right.svg")

  layout-tabbar(:current="1")
</template>

<script setup lang="ts">
import { useUserModule } from '@/store/user'

const userModule = useUserModule()
</script>

<style lang="scss">
.user-head {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: linear-gradient(180deg, #4f46e5 0%, #6366f1 100%), #00000000;
}

.user-avatar {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.user-title {
  margin-top: 12px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #ffffff;
  letter-spacing: 0px;
}

.user-subtitle {
  margin-top: 4px;
  font-size: 14px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0px;
}

.user-content {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 24px 16px;
}

.user-nav-container {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 24px;
}

.user-grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  align-items: center;
  justify-content: center;
}

.user-grid-item-text {
  font-size: 14px;
  font-weight: regular;
  line-height: 20px;
  color: #374151;
  letter-spacing: 0px;
}

.user-grid-item-media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  overflow: hidden;
  background: #4f46e519;
  border-radius: 12px;
}

.user-grid-item-icon {
  width: 20px;
  height: 20px;
}

.user-menu-container {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 3.2vw;
  box-shadow: 0px 1px 0.53333vw 0px rgba(0, 0, 0, 0.0470588235);
}

.user-cell {
  display: flex;
  align-items: center;
  padding: 16px;

  & + & {
    border-top: 1px solid #f3f4f6;
  }
}

.user-cell-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 12px;
}

.user-cell-label-icon {
  width: 28px;
  height: 28px;
}

.user-cell-icon {
  width: 12px;
  height: 12px;
}
</style>
