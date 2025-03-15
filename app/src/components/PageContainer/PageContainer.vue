<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue'
withDefaults(
  defineProps<{
    background?: string
    loading?: boolean
  }>(),
  {
    background: '#fdfdfd',
    loading: false,
  },
)
const emit = defineEmits<(e: 'ready', payload: number) => void>()

onMounted(() => {
  uni
    .createSelectorQuery()
    .in(getCurrentInstance())
    .select('#main')
    .boundingClientRect((res) => {
      if (Array.isArray(res)) {
        res = res[0]
      }
      emit('ready', res?.height ?? 0)
    })
    .exec()
})
</script>

<template>
  <view class="component" :style="{ background }">
    <slot name="top" />
    <view class="main">
      <slot v-if="loading" name="loading">
        <view class="loading">
          <u-loading />
        </view>
      </slot>
      <template v-else>
        <slot />
      </template>
    </view>
    <slot name="bot" />
  </view>
</template>

<style scoped lang="scss">
.component {
  position: relative;
  min-height: 100vh;

  .main {
    position: relative;
    flex: 1;

    .loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      background: #f5f6fb;
    }
  }
}
</style>
