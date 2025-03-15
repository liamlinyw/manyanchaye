<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'

import { useBaseStore } from '@/stores/base'

withDefaults(
  defineProps<{
    fixed?: boolean
    background?: string
  }>(),
  {
    fixed: true,
    background: '#fff',
  },
)
const emit = defineEmits<(e: 'ready', payload: number) => void>()

const base = useBaseStore()
const safeAreaHeight = base.systemInfo.safeAreaInsets?.bottom ?? 0

const height = ref(0)
onMounted(() => {
  uni
    .createSelectorQuery()
    .in(getCurrentInstance())
    .select('#content')
    .boundingClientRect((res) => {
      if (Array.isArray(res)) {
        res = res[0]
      }
      height.value = res?.height ?? 0
      emit('ready', height.value)
    })
    .exec()
})
</script>

<template>
  <view class="component" :style="{ height: `${height}px` }">
    <view id="content" :class="{ fixed }" :style="{ background }">
      <slot />
      <view v-if="fixed" :style="{ height: `${safeAreaHeight}px` }" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.component {
  .fixed {
    position: fixed;
    z-index: 900;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
