<script setup lang="ts">
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import AES from 'crypto-js/aes'
import utf8 from 'crypto-js/enc-utf8'
import { computed, ref, watch } from 'vue'

import MImage from '@/components/MImage/MImage.vue'
import MPopup from '@/components/MPopup/MPopup.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import TabBar from '@/components/TabBar/TabBar.vue'
import { useUserStore } from '@/stores/user'
import { jump } from '@/utils/base'
import { jumpCreateOrder, jumpUserRecharge, requestSubscribeMessage } from '@/utils/common'

const user = useUserStore()

let timer: any
const visible = ref(false)
const qrCodeRef = ref<any>()
const t = ref(Date.now())
const qrCodeText = computed(() => {
  const uid = user.userInfo?._id
  if (uid == null) return '-'
  return AES.encrypt(
    JSON.stringify({
      t: t.value,
      uid,
    }),
    'mycymycy',
  ).toString()
})
watch(visible, (v) => {
  if (v) {
    t.value = Date.now()
    timer = setInterval(() => {
      t.value = Date.now()
    }, 60000)
    setTimeout(() => {
      qrCodeRef.value?.make()
    }, 150)
  } else {
    clearInterval(timer)
  }
})
const scan = () => {
  uni.scanCode({
    success: ({ result }) => {
      const res = JSON.parse(AES.decrypt(result, 'mycymycy').toString(utf8))
      if (Date.now() - res.t > 60000) {
        return uni.showToast({
          icon: 'none',
          title: '二维码已失效',
        })
      }
      jump('pages/order/create', {
        uid: res.uid,
      })
    },
  })
}

const onClickUser = () => {
  if (user.userInfo == null) {
    jump('pages/user/login/loginByWx')
  } else {
    jump('pages/user/profile')
  }
}

const _requestSubscribeMessage = async () => {
  const { errMsg, ...tmps } = await requestSubscribeMessage()
  const acceptTmpLength = Object.values(tmps).filter((tmp) => tmp === 'accept').length
  let toast = '订阅失败'
  if (acceptTmpLength > 0) {
    toast = '订阅成功'
  }
  uni.showToast({
    title: toast,
    icon: 'none',
  })
}

const selectTimeVisible = ref(false)
const jumpOrdercalc = (e: any) => {
  jump('pages/order/calc', {
    startTime: new Date(`${e.startDate} 00:00:00`).getTime(),
    endTime: new Date(`${e.endDate} 23:59:59`).getTime(),
  })
}

onShow(() => {
  void user.getUserInfo()
})
onPullDownRefresh(async () => {
  await user.getUserInfo()
  uni.stopPullDownRefresh()
})
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="会员">
        <template #fixedBg>
          <view class="nav-bar-bg"></view>
        </template>
        <template #scrollBg>
          <view class="nav-bar-bg"></view>
        </template>
      </NavBar>
    </template>
    <view class="container">
      <view class="user">
        <view class="content">
          <view class="top" @click="onClickUser">
            <view class="avatar">
              <MImage :src="user.userInfo?.avatar || 'avatar.png'" />
            </view>
            <view class="info">
              <template v-if="user.userInfo">
                <view class="nickname">{{ user.userInfo.nickname || user.userInfo.mobile }}</view>
                <view class="mobile">{{ user.userInfo.mobile }}</view>
              </template>
              <view v-else class="name">点击登录漫岩茶业会员</view>
            </view>
            <!-- <view v-if="user.userInfo" class="code" @click.stop="visible = true">
              <MImage src="qrcode.svg" />
            </view> -->
          </view>
          <view class="bot">
            <view class="item" @click="jump(user.userInfo ? 'pages/user/wallet' : 'pages/user/login/loginByWx')">
              <view class="number">{{ (user.userInfo?.balance ?? 0) / 100 }}</view>
              <view class="text">钱包余额</view>
            </view>
            <view class="item" @click="user.userInfo ? (visible = true) : jump('pages/user/login/loginByWx')">
              <!-- <view class="number">{{ user.userInfo?.score ?? 0 }}</view>
              <view class="text">我的积分</view> -->
              <MImage src="qrcode.svg" width="80rpx" />
            </view>
          </view>
          <view class="logo">
            <!-- <MImage src="logo-black-transparent.png" width="100rpx" /> -->
            <view class="text">
              <template v-if="user.userInfo?.balance / 100 + user.userInfo?.score >= 100000">至尊卡</template>
              <template v-else-if="user.userInfo?.balance / 100 + user.userInfo?.score >= 50000">金卡</template>
              <template v-else>会员卡</template>
            </view>
          </view>
        </view>
        <view class="bg">
          <MImage v-if="user.userInfo?.balance / 100 + user.userInfo?.score >= 100000" src="vip3.jpg" />
          <MImage v-else-if="user.userInfo?.balance / 100 + user.userInfo?.score >= 50000" src="vip2.jpg" />
          <MImage v-else src="vip1.jpg" />
        </view>
      </view>
      <view v-if="user.userInfo" class="list">
        <view class="item" @click="jump('pages/user/wallet')">
          <view>余额充值</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view v-if="false" class="item" @click="_requestSubscribeMessage">
          <view>订阅通知</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
      </view>
      <view v-if="user.userInfo?.shop" class="list">
        <view class="item" @click="scan">
          <view>扫码核销</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view class="item" @click="jumpCreateOrder()">
          <view>会员核销</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view class="item" @click="jumpUserRecharge()">
          <view>会员充值</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view class="item" @click="jump('pages/recharge/index')">
          <view>充值记录</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view class="item" @click="jump('pages/user/customer')">
          <view>会员列表</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view v-if="user.userInfo.admin" class="item" @click="selectTimeVisible = true">
          <view>销售统计</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view class="item" @click="jump('pages/order/manage')">
          <view>我的订单</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view v-if="user.userInfo.admin" class="item" @click="jump('pages/order/manage?all')">
          <view>所有订单</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view v-if="user.userInfo.admin" class="item" @click="jump('pages/shop/manage')">
          <view>门店管理</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
        <view v-if="user.userInfo.admin" class="item" @click="jump('pages/product/manage')">
          <view>产品管理</view>
          <view><u-icon name="arrow-right" /></view>
        </view>
      </view>
    </view>
    <template #bot>
      <TabBar />
    </template>
  </PageContainer>
  <MPopup v-model="visible" mode="middle">
    <view v-if="visible" class="popup">
      <uqrcode ref="qrCodeRef" canvas-id="qrcode" :start="false" auto :value="qrCodeText" />
      <view class="tips">请在支付时出示二维码</view>
    </view>
  </MPopup>
  <u-calendar v-model="selectTimeVisible" mode="range" @change="jumpOrdercalc" />
</template>

<style scoped lang="scss">
.nav-bar-bg {
  height: 300rpx;
}

.container {
  padding-bottom: 20rpx;

  .user {
    position: relative;
    z-index: 0;
    overflow: hidden;
    width: 684rpx;
    border-radius: 10rpx;
    margin: 20rpx auto 0;
    box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 5%);

    .content {
      position: relative;
      z-index: 0;
      padding: 50rpx 0;
      backdrop-filter: blur(20px) brightness(1.2);
      color: #000;

      .top {
        flex-direction: row;
        align-items: center;
        padding: 0 40rpx;

        .avatar {
          overflow: hidden;
          width: 116rpx;
          height: 116rpx;
          border-radius: 50%;
        }

        .info {
          flex: 1;
          margin-left: 40rpx;

          .nickname {
            font-size: 16px;
            @include ellipsis(1);
          }

          .mobile {
            margin-top: 10rpx;
            font-size: 12px;
          }
        }

        .code {
          width: 80rpx;
          height: 80rpx;
        }
      }

      .bot {
        flex-direction: row;
        padding: 0 20rpx;
        margin-top: 40rpx;

        .item {
          flex: 1;
          align-items: center;

          .number {
            font-size: 16px;
            font-weight: 700;
          }

          .text {
            margin-top: 10rpx;
            font-size: 12px;
          }
        }
      }

      .logo {
        position: absolute;
        z-index: -1;
        top: 20rpx;
        right: 20rpx;
        align-items: center;

        .text {
          margin-top: 4rpx;
          font-size: 14px;
        }
      }
    }

    .bg {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .list {
    width: 684rpx;
    padding: 10rpx 0;
    border-radius: 10rpx;
    margin: 20rpx auto 0;
    background: #fff;
    box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 5%);

    .item {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx;
      color: #333;
      font-size: 12px;
    }
  }
}

.popup {
  width: 500rpx;
  align-items: center;
  padding: 50rpx 0;
  border-radius: 20rpx;
  background: #fff;

  .tips {
    margin-top: 20rpx;
    color: #333;
    font-size: 12px;
  }
}
</style>
