<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{
  item: Dict
  manage?: boolean
}>()
</script>

<template>
  <view class="item">
    <div class="header">
      <view>{{ item.shop.name }}</view>
      <text>
        合计:
        <text class="highlight">¥{{ item.price / 100 }}</text>
      </text>
    </div>
    <view class="content">
      <view class="row">
        <view class="left">产品</view>
        <view class="right">
          <text v-for="(product, index) in item.products" :key="index">
            {{ product.name }}
            <text class="highlight">¥{{ product.price / 100 }}</text>
          </text>
        </view>
      </view>
      <view v-if="item.note" class="row">
        <view class="left">备注</view>
        <view class="right">{{ item.note }}</view>
      </view>
      <template v-if="manage">
        <view class="row">
          <view class="left">会员昵称</view>
          <view class="right">{{ item.uid[0].nickname }}</view>
        </view>
        <view class="row">
          <view class="left">会员电话</view>
          <view class="right">{{ item.uid[0].mobile }}</view>
        </view>
      </template>
      <view class="row">
        <view class="left">客户经理</view>
        <view class="right">{{ item.staff.nickname }}</view>
      </view>
      <view class="row">
        <view class="left">商家电话</view>
        <view class="right">{{ item.shop.mobile }}</view>
      </view>
      <view class="row">
        <view class="left">支付时间</view>
        <view class="right">{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</view>
      </view>
      <view class="row">
        <view class="left">账户余额</view>
        <view class="right">¥{{ item.balance / 100 }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
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
        color: #666;
        font-size: 12px;
      }

      .right {
        flex: 1;
        color: #000;
        font-size: 12px;
        text-align: right;
      }
    }
  }
}
</style>
