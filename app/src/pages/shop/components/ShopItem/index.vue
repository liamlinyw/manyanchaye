<script setup lang="ts">
defineProps<{
  item: Dict
}>()

const $uni = uni
</script>

<template>
  <view class="item">
    <view class="info">
      <view class="name">
        <u-icon name="bag" />
        <view class="text">{{ item.name }}</view>
      </view>
      <view class="address">{{ item.address }}</view>
      <view class="hours">{{ item.hours }}</view>
    </view>
    <view class="opt">
      <view v-if="item.distance != null" class="distance">距离{{ item.distance }}</view>
      <view class="btn">
        <view class="icon" @click="$uni.makePhoneCall({ phoneNumber: item.mobile })">
          <u-icon name="phone" />
        </view>
        <view
          class="icon"
          @click="
            $uni.openLocation({
              longitude: item.location.coordinates[0],
              latitude: item.location.coordinates[1],
              name: item.name,
              address: item.address,
            })
          "
        >
          <u-icon name="map" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.item {
  width: 710rpx;
  height: 210rpx;
  flex-direction: row;
  align-items: center;
  border-radius: 10rpx;
  margin: 20rpx auto 0;
  background: #fff;
  box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 5%);

  .info {
    flex: 1;
    justify-content: center;
    padding: 0 20rpx;

    .name {
      flex-direction: row;
      align-items: baseline;
      color: $color;
      font-size: 16px;

      .text {
        margin-left: 10rpx;
        color: #000;
        font-size: 14px;
        @include ellipsis(1);
      }
    }

    .address {
      margin-top: 20rpx;
      color: #666;
      font-size: 12px;
      @include ellipsis(1);
    }

    .hours {
      margin-top: 10rpx;
      color: #999;
      font-size: 12px;
      @include ellipsis(1);
    }
  }

  .opt {
    width: 204rpx;
    height: 80%;
    align-items: center;
    justify-content: center;
    border-left: 2px dashed #e9e9e9;

    .distance {
      color: $color;
      font-size: 10px;
      margin-bottom: 30rpx;
    }

    .btn {
      width: 75%;
      flex-direction: row;
      justify-content: space-between;

      .icon {
        width: 60rpx;
        height: 60rpx;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f8f8f8;
        color: $color;
        font-size: 12px;
      }
    }
  }
}
</style>
