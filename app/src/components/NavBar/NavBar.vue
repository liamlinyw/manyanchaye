<script setup lang="ts">
import { computed, watch } from 'vue'

import { useBaseStore } from '@/stores/base'
import { jump } from '@/utils/base'

const props = withDefaults(
  defineProps<{
    title?: string
    color?: string
    background?: string
    height?: number
    center?: boolean
    back?: boolean | number | string | Function
  }>(),
  {
    title: '',
    color: '#2A2A2A',
    background: '#FFFFFF',
    height: 44,
    center: true,
    back: false,
  },
)
const emit = defineEmits<{
  (e: 'back'): void
  (e: 'ready', payload: number): void
}>()

const base = useBaseStore()
const { systemInfo, menuInfo } = base
let top = systemInfo.statusBarHeight ?? 0
let right = 0
if (menuInfo != null) {
  if (props.center) {
    top = menuInfo.top + menuInfo.height / 2 - props.height / 2
  }
  right = systemInfo.windowWidth - menuInfo.left
}
const navBarHeight = computed(() => top + props.height)
watch(navBarHeight, () => emit('ready', navBarHeight.value), {
  immediate: true,
})

const onClickBack = () => {
  let back = props.back
  if (back === true) back = 1
  if (typeof back === 'number') {
    uni.navigateBack({ delta: back, fail: () => jump() })
  } else if (typeof back === 'string') {
    jump(back, undefined, true)
  } else if (typeof back === 'function') {
    back()
  }
}
</script>

<template>
  <view class="component" :style="{ height: `${navBarHeight}px` }">
    <view
      class="fixed"
      :style="{
        height: `${navBarHeight}px`,
        padding: `${top}px ${right}px 0 0`,
        color,
        background,
      }"
    >
      <view class="content">
        <view class="center">
          <slot>
            <view class="title">{{ title }}</view>
          </slot>
        </view>
        <view class="left">
          <slot name="left">
            <view v-if="back" class="icon" @click="onClickBack">
              <u-icon name="arrow-left" size="40" />
            </view>
          </slot>
        </view>
        <view class="right">
          <slot name="right" />
        </view>
      </view>
      <view class="bg">
        <slot name="fixedBg" />
      </view>
    </view>
    <view class="bg">
      <slot name="scrollBg" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.component {
  position: relative;

  .fixed {
    position: fixed;
    z-index: 900;
    top: 0;
    left: 0;
    overflow: hidden;
    width: 100%;

    .content {
      position: relative;
      z-index: 1;
      height: 100%;

      .title {
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 34rpx;
      }

      .icon {
        width: 88rpx;
        height: 100%;
        align-items: center;
        justify-content: center;
      }

      .center {
        width: 750rpx;
        height: 100%;
      }

      .left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
      }

      .right {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
      }
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
