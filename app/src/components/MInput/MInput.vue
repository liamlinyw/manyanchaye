<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string
    focus?: boolean
    maxlength?: number
    placeholder?: string
    placeholderStyle?: string
    placeholderClass?: string
    confirmType?: string
    confirmHold?: boolean
    type?: string
    password?: boolean
    textarea?: boolean
    disabled?: boolean
  }>(),
  {
    value: '',
    focus: false,
    maxlength: -1,
    placeholder: '',
    placeholderStyle: 'color: #999',
    confirmType: 'done',
    confirmHold: false,
    type: 'text',
    password: false,
    textarea: false,
    disabled: false,
  },
)
const emit = defineEmits<{
  (e: 'update:value', payload: string): void
  (e: 'update:focus', payload: boolean): void
  (e: 'input', payload: string): void
  (e: 'confirm', payload: string): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'linechange', payload: number): void
}>()

const onFocus = () => {
  emit('update:focus', true)
  emit('focus')
}
const onBlur = () => {
  emit('update:focus', false)
  emit('blur')
}
const onInput = (e: any) => {
  emit('update:value', e.detail.value)
  emit('input', e.detail.value)
}
</script>
<script lang="ts">
export default {
  options: { virtualHost: true },
}
</script>

<template>
  <textarea
    v-if="textarea"
    class="textarea"
    :value="value"
    :focus="focus"
    :disabled="disabled"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :placeholder-style="placeholderStyle"
    :placeholder-class="placeholderClass"
    :confirm-type="confirmType"
    :confirm-hold="confirmHold"
    :adjust-position="false"
    :auto-blur="true"
    :auto-height="true"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @confirm="emit('confirm', $event.detail.value)"
    @linechange="emit('linechange', $event.detail.height)"
  />
  <input
    v-else
    class="input"
    :type="type"
    :password="password"
    :value="value"
    :focus="focus"
    :disabled="disabled"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :placeholder-style="placeholderStyle"
    :placeholder-class="placeholderClass"
    :confirm-type="confirmType"
    :confirm-hold="confirmHold"
    :adjust-position="false"
    :auto-blur="true"
    @focus="onFocus"
    @blur="onBlur"
    @input="onInput"
    @confirm="emit('confirm', $event.detail.value)"
  />
</template>

<style scoped lang="scss">
.input {
  width: 100%;
  color: #2a2a2a;
  line-height: 1;
}

.textarea {
  width: 100%;
  color: #2a2a2a;
  line-height: 1.2;
}
</style>
