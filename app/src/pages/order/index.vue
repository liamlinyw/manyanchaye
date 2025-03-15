<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

import DbList from '@/components/DbList/DbList.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import TabBar from '@/components/TabBar/TabBar.vue'
import { useUserStore } from '@/stores/user'
import { jump } from '@/utils/base'

import OrderItem from './components/OrderItem/index.vue'

const user = useUserStore()

const dbListRef = ref<Dict>()
onShow(() => {
  dbListRef.value?.refresh()
})
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="订单" />
    </template>
    <DbList
      v-if="user.userInfo"
      ref="dbListRef"
      :db="{
        collection: 'order',
        where: 'uid == $cloudEnv_uid',
      }"
    >
      <template #default="{ item }">
        <OrderItem :item="item" />
      </template>
    </DbList>
    <view v-else class="tip">
      <view class="btn" @click="jump('pages/user/login/loginByWx')">立即登录</view>
    </view>
    <template #bot>
      <TabBar />
    </template>
  </PageContainer>
</template>

<style scoped lang="scss">
.tip {
  flex: 1;
  align-items: center;
  justify-content: center;

  .btn {
    width: 300rpx;
    height: 80rpx;
    align-items: center;
    justify-content: center;
    border-radius: 54rpx;
    background: #07c160;
    box-shadow: 0 0 12rpx 0 rgb(22 230 126 / 5%);
    color: #fff;
    font-size: 14px;
  }
}
</style>
