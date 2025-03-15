<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { ref } from 'vue'

const props = defineProps<{
  db: Dict
  remove?: boolean
}>()

const udb = ref<Dict>()
const temps = ref<Dict[]>([])
const refresh = async () => {
  return await new Promise<void>((resolve) => {
    udb.value?.clear()
    udb.value?.loadData({ clear: true }, () => {
      temps.value = []
      resolve()
    })
  })
}
const onRemove = (id: string) => {
  udb.value?.remove(id)
}
uni.$on(`add-${props.db.collection}`, () => {
  void refresh()
})
uni.$on(`update-${props.db.collection}`, (data) => {
  temps.value.unshift(data)
})

onReachBottom(() => {
  udb.value?.loadMore()
})
onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})

defineExpose({
  refresh,
})
</script>
<script lang="ts">
export default {
  options: { virtualHost: true },
}
</script>

<template>
  <unicloud-db ref="udb" #default="{ error, data, loading }" orderby="_id desc" v-bind="db">
    <view v-if="error" class="error">{{ error.message }}</view>
    <view v-else-if="data.length > 0">
      <view v-for="item in data" :key="item._id" @longpress="remove && onRemove(item._id)">
        <slot :item="temps.find((temp) => temp._id === item._id) ?? item"></slot>
      </view>
    </view>
    <view v-else-if="!loading" class="empty">
      <u-empty text="暂无数据" mode="list" />
    </view>
    <u-loadmore
      v-if="loading || data.length > 0"
      :status="loading ? 'loading' : 'nomore'"
      margin-top="40"
      margin-bottom="100"
    />
  </unicloud-db>
</template>

<style scoped lang="scss">
.error {
  padding: 20rpx;
  color: #dd524d;
  font-size: 14px;
  text-align: center;
}

.empty {
  height: 50vh;
  justify-content: center;
}

.loading {
  padding: 20rpx;
  text-align: center;
}
</style>
