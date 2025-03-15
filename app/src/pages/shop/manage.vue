<script setup lang="ts">
import DbList from '@/components/DbList/DbList.vue'
import MButton from '@/components/MButton/MButton.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import { jump } from '@/utils/base'

import ShopItem from './components/ShopItem/index.vue'

const onClickShop = (item: Dict) => {
  uni.setStorageSync('temp', item)
  jump('pages/shop/create')
}
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="门店管理" back />
    </template>
    <view class="block">
      <MButton text="添加门店" :onClick="() => jump('pages/shop/create')" />
    </view>
    <DbList
      :db="{
        collection: 'shop',
      }"
      remove
    >
      <template #default="{ item }">
        <ShopItem :item="item" @tap="onClickShop(item)" />
      </template>
    </DbList>
  </PageContainer>
</template>

<style scoped lang="scss"></style>
