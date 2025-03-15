<script setup lang="ts">
import { computed, ref } from 'vue'

import DbList from '@/components/DbList/DbList.vue'
import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'

import UserInfo from './components/UserInfo/index.vue'

const input = ref('')
const where = computed(() =>
  input.value ? `${new RegExp(input.value, 'i')}.test(nickname) || ${new RegExp(input.value, 'i')}.test(mobile)` : {},
)
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="会员列表" back />
    </template>
    <view class="search">
      <MInput placeholder="搜索会员" confirmType="search" @confirm="(e) => (input = e)" />
    </view>
    <DbList
      :db="{
        collection: 'uni-id-users',
        field: 'avatar,nickname,mobile,balance,score',
        where,
      }"
    >
      <template #default="{ item }">
        <UserInfo :userInfo="item" />
      </template>
    </DbList>
  </PageContainer>
</template>

<style scoped lang="scss">
.search {
  margin: 0 16rpx;
  padding: 0 32rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
