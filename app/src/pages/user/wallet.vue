<script setup lang="ts">
import { ref } from 'vue'
import { useRequest } from 'vue-request'

import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import UserInfo from '@/pages/user/components/UserInfo/index.vue'
import { useUserStore } from '@/stores/user'
import { requestSubscribeMessage } from '@/utils/common'

const userCO = uniCloud.importObject('user')
const paymentCO = uniCloud.importObject('payment')

const props = defineProps<{
  mobile?: string
}>()

const { data: userInfo, runAsync: getUserInfo } = useRequest(
  async () => {
    return await (userCO.getUserInfo(props) as Promise<Dict>)
  },
  {
    ready: ref(!!props.mobile),
    onError: () => {
      uni.navigateBack()
    },
  },
)

const user = useUserStore()

const list = ref<Dict[]>([])
const current = ref(0)

const onCustomRecharge = () => {
  uni.showModal({
    title: '充值金额',
    editable: true,
    success: (e1) => {
      if (e1.cancel) return
      uni.showModal({
        title: '赠送金额',
        editable: true,
        success: (e2) => {
          if (e2.cancel) return
          const amount = +(e1.content || 0) * 100
          const give = +(e2.content || 0) * 100
          void recharge({
            amount,
            give,
          })
        },
      })
    },
  })
}
const recharge = async (custom?: Dict) => {
  await requestSubscribeMessage()
  let noNeedPay = false
  if (user.userInfo?.admin) {
    noNeedPay = await new Promise((resolve) => {
      uni.showModal({
        title: '检测到您是超级管理员,是否需要支付?',
        confirmText: '不要支付',
        cancelText: '需要支付',
        success: (res) => {
          resolve(res.confirm)
        },
      })
    })
  }
  const update = () => {
    if (userInfo.value?._id) {
      void getUserInfo()
    } else {
      void user.getUserInfo()
    }
  }
  const res = await paymentCO.recharge(custom ?? list.value[current.value], userInfo.value?._id, noNeedPay)
  if (res == null) {
    uni.showToast({
      title: '充值成功',
    })
    update()
    return
  }
  uni.requestPayment({
    provider: 'wxpay',
    ...res,
    success: () => {
      uni.showToast({
        title: '充值成功',
      })
      setTimeout(() => {
        update()
      }, 1000)
    },
  })
}
</script>

<template>
  <PageContainer background="#f7f8fc">
    <template #top>
      <NavBar title="余额充值" back />
    </template>
    <UserInfo v-if="userInfo" :userInfo="userInfo" />
    <view v-else class="balance">
      <view class="title">钱包余额(元)</view>
      <view class="amount">
        {{ ((user.userInfo?.balance ?? 0) / 100).toFixed(2) }}
      </view>
    </view>
    <view class="recharge">
      <view class="title">选择充值金额</view>
      <unicloud-db v-slot:default="{ data }" collection="card" @load="list = $event">
        <view class="list">
          <view
            v-for="(item, index) in data"
            :key="item"
            :class="['item', { active: index === current }]"
            @click="current = index"
          >
            <view class="top">{{ item.amount / 100 }}元</view>
            <view class="bot" v-if="item.give">赠{{ item.give / 100 }}元</view>
          </view>
          <view v-if="user.userInfo?.admin" class="item" @click="onCustomRecharge">自定义</view>
        </view>
      </unicloud-db>
      <view class="btn" @click="recharge()">立即充值</view>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.balance {
  width: 700rpx;
  height: 180rpx;
  justify-content: center;
  padding: 40rpx;
  border-radius: 20rpx;
  margin: 20rpx auto 0;
  background: #fff;

  .title {
    color: #666;
    font-size: 12px;
  }

  .amount {
    margin-top: 30rpx;
    color: $color;
    font-size: 16px;
    font-weight: 700;
  }
}

.recharge {
  width: 700rpx;
  flex: 1;
  padding: 30rpx;
  border-radius: 20rpx;
  margin: 20rpx auto;
  background: #fff;

  .title {
    color: #999;
    font-size: 12px;
  }

  .list {
    flex-flow: row wrap;
    justify-content: space-between;
    margin-top: 30rpx;

    .item {
      width: 305rpx;
      height: 140rpx;
      align-items: center;
      justify-content: center;
      border: 1px solid #e0e0e0;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
      background: #fff;
      transition: all 0.28s;

      .top {
        color: #000;
        font-size: 16px;
      }

      .bot {
        margin-top: 10rpx;
        color: #666;
        font-size: 12px;
      }

      &.active {
        border-color: $color;
        background: rgba($color: $color, $alpha: 10%);
      }
    }
  }

  .btn {
    width: 650rpx;
    height: 88rpx;
    align-items: center;
    justify-content: center;
    border-radius: 50rpx;
    margin-top: 50rpx;
    background: $color;
    color: #fff;
  }
}
</style>
