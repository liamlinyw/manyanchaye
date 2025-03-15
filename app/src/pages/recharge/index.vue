<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

import DbList from '@/components/DbList/DbList.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import { useUserStore } from '@/stores/user'

const paymentCO = uniCloud.importObject('payment')

const user = useUserStore()

const db = uniCloud.database()
const collections = [
  db
    .collection('recharge')
    .where(`payTime != null ${user.userInfo?.admin ? '' : '&& staff._id == $cloudEnv_uid'}`)
    .getTemp(),
  db.collection('uni-id-users').field('_id, nickname, mobile').getTemp(),
]

const dbListRef = ref<Dict>()
const revoke = (id: string) => {
  if (!user.userInfo?.admin) return
  uni.showModal({
    title: '是否确认撤销充值?',
    success: async (res) => {
      if (res.cancel) return
      await paymentCO.revoke(id)
      dbListRef.value?.refresh()
    },
  })
}
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="充值记录" back />
    </template>
    <DbList
      ref="dbListRef"
      :db="{
        collection: collections,
      }"
    >
      <template #default="{ item }">
        <view class="item" @longpress="revoke(item._id)">
          <view class="row">会员昵称: {{ item.uid[0].nickname }}</view>
          <view class="row">会员手机: {{ item.uid[0].mobile }}</view>
          <view v-if="item.staff" class="row">代充值人: {{ item.staff.nickname }}({{ item.staff.mobile }})</view>
          <view class="row">充值金额: {{ item.card.amount / 100 }}</view>
          <view class="row">赠送金额: {{ item.card.give / 100 }}</view>
          <view class="row">支付时间: {{ dayjs(item.payTime).format('YYYY-MM-DD HH:mm:ss') }}</view>
        </view>
      </template>
    </DbList>
  </PageContainer>
</template>

<style scoped lang="scss">
.item {
  width: 710rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  margin: 20rpx auto 0;
  background: #fff;
  box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 5%);

  .row {
    padding: 10rpx 0;
    color: #333;
    font-size: 12px;
  }
}
</style>
