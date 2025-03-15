<script setup lang="ts">
import MImage from '@/components/MImage/MImage.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import { useUserStore } from '@/stores/user'
import { jump } from '@/utils/base'

const user = useUserStore()
const loginByWx = async (e: Dict) => {
  const phoneCode = e.detail.code
  if (phoneCode == null) return
  await user.loginByWx({
    phoneCode,
  })
  jump('pages/user/index')
}
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar back />
    </template>
    <view class="container">
      <view class="header">欢迎使用漫岩茶业会员</view>
      <view class="logo">
        <MImage :style="{ height: '100%' }" src="logo.png" />
      </view>
      <view class="confirm">
        手机号快捷登录
        <button class="hidden" open-type="getPhoneNumber" @getphonenumber="loginByWx" />
      </view>
      <!-- <view class="tip">
        登录即同意
        <text class="highlight">用户协议</text>
        和
        <text class="highlight">隐私协议</text>
      </view> -->
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.container {
  .header {
    height: 160rpx;
    align-items: center;
    justify-content: center;
    background: #fff;
    box-shadow: 0 0 20rpx rgb(0 0 0 / 5%);
    color: #333;
    font-size: 24px;
    font-weight: 700;
  }

  .logo {
    overflow: hidden;
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    margin: 60rpx auto 0;
    box-shadow: 0 0 20rpx rgb(0 0 0 / 10%);
  }

  .confirm {
    position: relative;
    overflow: hidden;
    width: 454rpx;
    height: 100rpx;
    align-items: center;
    justify-content: center;
    border-radius: 54rpx;
    margin: 310rpx auto 0;
    background: #07c160;
    box-shadow: 0 0 12rpx 0 rgb(22 230 126 / 5%);
    color: #fff;
    font-size: 18px;
  }

  .tip {
    position: fixed;
    bottom: 96rpx;
    left: 0;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    color: #999;
    font-size: 12px;
  }
}
</style>
