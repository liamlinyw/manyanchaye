<script setup lang="ts">
import { computed, ref } from 'vue'

import DbList from '@/components/DbList/DbList.vue'
import MButton from '@/components/MButton/MButton.vue'
import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import { jump } from '@/utils/base'

import ProductItem from './components/ProductItem/index.vue'

defineProps<{
  selectable?: boolean
}>()

const input = ref('')
const where = computed(() => `${new RegExp(input.value, 'i')}.test(name)`)

const onClickProduct = (item: Dict) => {
  uni.setStorageSync('temp', item)
  jump('pages/product/create')
}
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar :title="selectable ? '产品选择' : '产品管理'" back />
    </template>
    <view class="search">
      <MInput placeholder="搜索产品" confirmType="search" @confirm="(e) => (input = e)" />
    </view>
    <view v-if="!selectable" class="block">
      <MButton text="添加产品" :onClick="() => jump('pages/product/create')" />
    </view>
    <DbList
      :db="{
        collection: 'product',
        orderby: 'sort desc, _id desc',
        where,
      }"
      :remove="!selectable"
    >
      <template #default="{ item }">
        <ProductItem :selectable="selectable" :item="item" @tap="!selectable && onClickProduct(item)" />
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
