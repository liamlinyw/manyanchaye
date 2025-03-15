<script setup lang="ts">
// import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const props = defineProps<{
  width?: string
  height?: string
  mode?: string
  src: string
}>()

const src = computed(() => {
  if (props.src.startsWith('/') || props.src.startsWith('data:image/') || props.src.includes('://')) {
    return props.src
  } else {
    return `/static/${props.src}`
  }
})

const options = computed(() => {
  const res = {
    style: {
      width: props.width ?? '100%',
      height: props.height ?? '100%',
    },
    mode: props.mode ?? 'aspectFill',
    src,
  }
  if (props.width != null && props.height == null) {
    Object.assign(res, {
      style: {
        width: props.width,
      },
      mode: 'widthFix',
    })
  } else if (props.width == null && props.height != null) {
    Object.assign(res, {
      style: {
        height: props.height,
      },
      mode: 'heightFix',
    })
  }
  return res
})

const isShow = ref(false)
setTimeout(() => {
  isShow.value = true
}, 200)
</script>
<script lang="ts">
export default {
  options: { virtualHost: true },
}
</script>

<template>
  <view :style="options.style">
    <image v-if="isShow" :style="options.style" :mode="options.mode" :src="options.src" />
  </view>
</template>

<style scoped lang="scss"></style>
