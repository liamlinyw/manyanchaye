<script setup lang="ts">
import dayjs from 'dayjs'
import { useRequest } from 'vue-request'

import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'

const orderCO = uniCloud.importObject('order')

const props = defineProps<{
  startTime?: string
  endTime?: string
}>()

const { data } = useRequest(async () => {
  const data = (await orderCO.calc([props.startTime, props.endTime])) as Array<{
    staff: Dict
    products: Dict[]
    price: number
  }>
  return data.map((item) => {
    item.price = item.products.reduce((total, cur) => total + cur.price * cur.count, 0) / 100
    return item
  })
})
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="销售统计" back />
    </template>
    <view>
      <view class="range">
        {{ dayjs(Number(startTime)).format('YYYY-MM-DD HH:mm:ss') }} 至
        {{ dayjs(Number(endTime)).format('YYYY-MM-DD HH:mm:ss') }}
        <br />
        <text>
          总营业额
          <text class="highlight">¥{{ data?.reduce((total, cur) => total + cur.price, 0) }}</text>
        </text>
      </view>
      <view v-if="data?.length === 0" class="empty">
        <u-empty text="暂无数据" mode="list" />
      </view>
      <view class="item" v-for="(item, index) in data" :key="index">
        <div class="header">
          <view>{{ item.staff.nickname }}({{ item.staff.mobile }})</view>
          <view class="highlight">¥{{ item.price }}</view>
        </div>
        <view class="content">
          <view v-for="(product, index) in item.products" :key="index" class="row">
            <view class="left">{{ product.name }}</view>
            <view class="right">
              ¥{{ product.price / 100 }} * {{ product.count }} = ¥{{ (product.price / 100) * product.count }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.range {
  padding-top: 20rpx;
  text-align: center;
}

.empty {
  height: 50vh;
  justify-content: center;
}

.item {
  width: 710rpx;
  border-radius: 20rpx;
  margin: 20rpx auto 0;
  background: #fff;
  box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 5%);

  .header {
    flex-direction: row;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 1px solid #eee;
    color: #333;
    font-size: 12px;
  }

  .content {
    padding: 10rpx 0;
    border-bottom: 1px solid #eee;

    .row {
      flex-direction: row;
      padding: 10rpx 20rpx;

      .left {
        color: #000;
        font-size: 12px;
      }

      .right {
        flex: 1;
        color: $color;
        font-size: 12px;
        text-align: right;
      }
    }
  }
}
</style>
