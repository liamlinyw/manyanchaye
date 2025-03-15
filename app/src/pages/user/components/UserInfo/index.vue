<script setup lang="ts">
import { reactive, watch } from 'vue'

import { jump } from '@/utils/base'
import { jumpCreateOrder, jumpUserRecharge } from '@/utils/common'

const userCO = uniCloud.importObject('user')

const props = defineProps<{
  userInfo: Dict
}>()

const userInfo = reactive(props.userInfo)
watch(
  () => props.userInfo,
  () => {
    Object.assign(userInfo, props.userInfo)
  },
)

const onLongpress = () => {
  uni.showActionSheet({
    itemList: ['为该会员充值', '为该会员下单', '查看会员订单', '修改会员昵称'],
    success: ({ tapIndex }) => {
      void [
        jumpUserRecharge,
        jumpCreateOrder,
        () => {
          jump('pages/order/manage', {
            uid: userInfo._id,
            nickname: userInfo.nickname,
          })
        },
        () => {
          uni.showModal({
            title: '输入新的昵称',
            editable: true,
            success: async (e) => {
              if (e.cancel || !e.content) return
              await userCO.updateUserInfo({
                uid: userInfo._id,
                nickname: e.content,
              })
              userInfo.nickname = e.content
            },
          })
        },
      ][tapIndex](userInfo.mobile)
    },
  })
}
</script>

<template>
  <view class="user" @longpress="onLongpress">
    <view class="avatar">
      <MImage :src="userInfo.avatar || 'avatar.png'" />
    </view>
    <view class="info">
      <view class="nickname">{{ userInfo.nickname || userInfo.mobile }}</view>
      <view class="mobile">{{ userInfo.mobile }}</view>
    </view>
    <view class="balance">
      <view>余额: {{ (userInfo.balance ?? 0) / 100 }}</view>
      <view>总消费额: {{ userInfo.score ?? 0 }}</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.user {
  height: 120rpx;
  flex-direction: row;
  align-items: center;
  padding: 0 20rpx;
  background: #fff;

  .avatar {
    overflow: hidden;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }

  .info {
    flex: 1;
    margin-left: 20rpx;

    .nickname {
      color: #333;
      font-size: 14px;
      @include ellipsis(1);
    }

    .mobile {
      margin-top: 4rpx;
      color: #666;
      font-size: 12px;
    }
  }

  .balance {
    color: #333;
    font-size: 12px;
    text-align: right;
  }
}
</style>
