<script setup lang="ts">
import { onPageScroll } from '@dcloudio/uni-app'
import { ref, toRefs } from 'vue'

import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import MImage from '@/components/MImage/MImage.vue'
import { useBaseStore } from '@/stores/base'
import { jump } from '@/utils/base'

const emit = defineEmits<{
  (e: 'ready', payload: number): void
  (e: 'refresh'): void
}>()

uni.hideTabBar({ fail: () => {} })

const pages = getCurrentPages()
const { route = '' } = pages[pages.length - 1] ?? {}

const base = useBaseStore()
const { tabBar } = toRefs(base)

const scroll = ref(0)
onPageScroll(({ scrollTop }) => {
  if (scrollTop > 0) {
    scroll.value = 1
  } else {
    scroll.value = 0
  }
})

const onClick = async (path?: string | (() => Promise<string>)) => {
  if (path == null) return
  let url: string
  if (typeof path === 'string') {
    url = path
  } else {
    url = await path()
  }
  if (url === route) {
    if (scroll.value > 0) {
      uni.pageScrollTo({
        scrollTop: 0,
      })
    } else {
      emit('refresh')
    }
  } else {
    jump(url)
  }
}
</script>

<template>
  <view @touchmove.stop.prevent>
    <FixedBottom :background="tabBar.backgroundColor" @ready="emit('ready', $event)">
      <view class="tabs">
        <view v-for="item in tabBar.list" :key="item.pagePath" class="item" @click="onClick(item.pagePath)">
          <MImage height="44rpx" :src="`/${item.pagePath === route ? item.selectedIconPath : item.iconPath}`" />
          <view
            class="text"
            :style="{
              color: item.pagePath === route ? tabBar.selectedColor : tabBar.color,
            }"
          >
            {{ item.text }}
          </view>
          <view v-if="item.badge > 0" class="badge">
            <text class="text">{{ item.badge }}</text>
          </view>
        </view>
      </view>
    </FixedBottom>
  </view>
</template>

<style scoped lang="scss">
.tabs {
  height: 98rpx;
  flex-direction: row;
  padding: 0 40rpx;
  border-top: 1px solid rgb(0 0 0 / 5%);

  .item {
    position: relative;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    padding: 12rpx 0;

    .text {
      font-size: 20rpx;
    }

    .badge {
      position: absolute;
      top: 5rpx;
      right: 30rpx;
      min-width: 36rpx;
      height: 36rpx;
      align-items: center;
      justify-content: center;
      padding: 0 6rpx;
      border-radius: 18rpx;
      background: #ef4d26;

      .text {
        color: #fff;
        font-size: 20rpx;
      }
    }
  }
}
</style>
