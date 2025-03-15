<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    ui?: boolean
    text?: string
    radius?: string
    onClick?: () => any
  }>(),
  {
    ui: true,
    radius: '10rpx',
  },
)

const onClick = async () => {
  props.ui &&
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
  try {
    await props.onClick?.()
  } catch (err: any) {
    props.ui &&
      uni.showToast({
        icon: 'none',
        title: err.message,
      })
  }
  props.ui && uni.hideLoading()
}
</script>
<script lang="ts">
export default {
  options: { virtualHost: true },
}
</script>

<template>
  <view hover-class="hover" :hover-start-time="20" :hover-stay-time="150" @click="onClick">
    <slot>
      <view class="button">{{ text }}</view>
    </slot>
  </view>
</template>

<style scoped lang="scss">
.hover {
  position: relative;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: v-bind(radius);
    background: rgb(0 0 0 / 10%);
    content: '';
  }
}

.button {
  width: 700rpx;
  height: 80rpx;
  align-items: center;
  justify-content: center;
  border-radius: 10rpx;
  background: $color;
  color: #fff;
}
</style>
