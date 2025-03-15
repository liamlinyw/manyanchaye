<script setup lang="ts">
const props = defineProps<{
  item: Dict
  selectable?: boolean
}>()

const onSelect = async (type?: string) => {
  if (!props.selectable) return
  const map: Dict = {
    packet: '泡',
    box: '盒',
    catty: '斤',
  }
  if (type == null) {
    type = await new Promise<string>((resolve) => {
      uni.showActionSheet({
        itemList: Object.values(map),
        success: ({ tapIndex }) => {
          resolve(Object.keys(map)[tapIndex])
        },
      })
    })
  }
  const unit = map[type]
  const price = props.item[`${type}Price`]
  uni.showModal({
    title: '请输入购买数量',
    editable: true,
    success: (e) => {
      if (e.cancel || !e.content) return
      const count = +e.content
      uni.$emit('select-product', {
        origin: props.item,
        name: `${props.item.name}(¥${price / 100}/${unit} * ${count})`,
        price: price * count,
        count,
        type,
      })
      uni.showToast({
        title: '添加成功',
        icon: 'none',
      })
    },
  })
}
</script>

<template>
  <view class="item" @click="onSelect()">
    <view class="text">{{ item.name }}</view>
    <view class="price">
      <view :class="['text', { highlight: selectable }]" @click.stop="onSelect('packet')">
        ¥{{ item.packetPrice / 100 }}/泡
      </view>
      <view :class="['text', { highlight: selectable }]" @click.stop="onSelect('box')">
        ¥{{ item.boxPrice / 100 }}/盒
      </view>
      <view :class="['text', { highlight: selectable }]" @click.stop="onSelect('catty')">
        ¥{{ item.cattyPrice / 100 }}/斤
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.item {
  width: 710rpx;
  flex-direction: row;
  justify-content: space-between;
  padding: 10rpx;
  border-radius: 10rpx;
  margin: 20rpx auto 0;
  background: #fff;
  box-shadow: 0 0 20rpx rgba($color: #000, $alpha: 5%);

  .text {
    padding: 10rpx;
  }
}
</style>
