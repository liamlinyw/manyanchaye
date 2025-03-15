<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    mode?: 'top' | 'right' | 'bot' | 'left' | 'middle' | 'custom'
    opacity?: number
  }>(),
  {
    modelValue: false,
    mode: 'custom',
    opacity: 0.5,
  },
)
const emit = defineEmits<(e: 'update:modelValue', payload: boolean) => void>()
</script>

<template>
  <view @touchmove.stop.prevent>
    <view
      class="component"
      :style="modelValue ? { background: `rgba(0, 0, 0, ${opacity})`, pointerEvents: 'auto' } : {}"
      @click="emit('update:modelValue', false)"
    >
      <view :class="['content', mode, { active: modelValue }]" @click.stop.prevent>
        <slot />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.component {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 0%);
  pointer-events: none;
  transition: all 0.28;

  .content {
    position: absolute;
    transition: all 0.28s;

    &.top {
      top: 0;
      left: 0;
      width: 100%;
      transform: translate(0, -100%);
    }

    &.right {
      top: 0;
      right: 0;
      height: 100%;
      transform: translate(100%, 0);
    }

    &.bot {
      bottom: 0;
      left: 0;
      width: 100%;
      transform: translate(0, 100%);
    }

    &.left {
      top: 0;
      left: 0;
      height: 100%;
      transform: translate(-100%, 0);
    }

    &.active {
      transform: none;
    }

    &.middle {
      top: 50%;
      left: 50%;
      opacity: 0;
      transform: translate(-50%, -50%);
    }

    &.custom {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
    }

    &.active {
      opacity: 1;
    }
  }
}
</style>
