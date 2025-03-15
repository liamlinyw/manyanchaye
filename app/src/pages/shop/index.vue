<script setup lang="ts">
import { onShareAppMessage } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'

import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import TabBar from '@/components/TabBar/TabBar.vue'
import { useBaseStore } from '@/stores/base'

import ShopItem from './components/ShopItem/index.vue'

onShareAppMessage(() => {
  return {
    title: '好友邀请您使用漫岩茶业会员',
    path: '/pages/shop/index',
  }
})

const base = useBaseStore()
// base.getLocation()
const chooseLocation = () => {
  uni.chooseLocation({
    ...base.locationInfo,
    success: (res) => {
      base.locationInfo = {
        latitude: res.latitude,
        longitude: res.longitude,
        address: res.name,
      }
    },
  })
}

const db = uniCloud.databaseForJQL() as any

const list = ref<Dict[]>([])
const format = (list: Dict[]) => {
  return list.map((item) => {
    if (item.distance) {
      const distance = Math.round(item.distance)
      item.distance = distance >= 1000 ? `${Math.round(distance / 100) / 10}km` : `${distance}m`
    }
    return item
  })
}
const get = async (name: string = '') => {
  const location = base.locationInfo
  let res
  if (location) {
    res = await db
      .collection('shop')
      .aggregate()
      .geoNear({
        spherical: true,
        near: new db.Geo.Point(location.longitude, location.latitude),
        distanceField: 'distance',
        query: {
          name: new RegExp(name),
        },
      })
      .end()
  } else {
    res = await db
      .collection('shop')
      .where({
        name: new RegExp(name),
      })
      .get()
  }
  list.value = format(res.data)
}
watch(
  () => base.locationInfo,
  async () => {
    get()
  },
  {
    immediate: true,
    deep: true,
  },
)
const onSearch = async (e: string) => {
  get(e)
}
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar title="门店" />
    </template>
    <view class="container">
      <view class="top">
        <view class="left" @click="chooseLocation">
          <view class="text">{{ base.locationInfo?.address ?? '请选择当前位置' }}</view>
          <u-icon name="arrow-right" />
        </view>
        <view class="right">
          <MInput placeholder="请输入门店名称" :style="{ flex: 1 }" @confirm="onSearch" />
        </view>
      </view>
      <view class="map">
        <map
          :style="{ position: 'absolute', width: '100%', height: '100%' }"
          show-location
          :longitude="base.locationInfo?.longitude"
          :latitude="base.locationInfo?.latitude"
        />
      </view>
      <scroll-view class="bot" scroll-y>
        <template v-if="list.length > 0">
          <ShopItem v-for="item in list" :key="item._id" :item="item" />
        </template>
        <u-empty v-else text="附近没有门店" mode="search" />
      </scroll-view>
    </view>
    <template #bot>
      <TabBar />
    </template>
  </PageContainer>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  flex: 1;

  .map {
    position: relative;
    flex: 1;
  }

  .top {
    height: 100rpx;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    background: #fff;

    .left {
      width: 50%;
      flex-direction: row;
      align-items: baseline;

      .text {
        color: #000;
        font-size: 14px;
        @include ellipsis(1);
      }
    }

    .right {
      width: 40%;
      height: 60rpx;
      flex-direction: row;
      align-items: center;
      padding: 0 40rpx;
      border-radius: 40rpx;
      background: rgba($color: #000, $alpha: 5%);
    }
  }

  .bot {
    height: 50vh;
    box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 10%) inset;
  }
}
</style>
