<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'

import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import MButton from '@/components/MButton/MButton.vue'
import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import UserInfo from '@/pages/user/components/UserInfo/index.vue'
import { jump } from '@/utils/base'

const userCO = uniCloud.importObject('user')
const orderCO = uniCloud.importObject('order')

const props = defineProps<{
  uid?: string
  mobile?: string
}>()

const { data: userInfo } = useRequest(
  async () => {
    return await (userCO.getUserInfo(props) as Promise<Dict>)
  },
  {
    onError: () => {
      uni.navigateBack()
    },
  },
)

const note = ref('')

const currentList = ref<Dict[]>([])
const total = computed(() => {
  return currentList.value.reduce((total, current) => {
    return total + +current.price
  }, 0)
})
uni.$on(`select-product`, (data) => {
  currentList.value.push(data)
})

const onRemoveProduct = (i: number) => {
  uni.showModal({
    title: '是否确定删除该项?',
    success: (res) => {
      if (res.cancel) return
      currentList.value.splice(i, 1)
    },
  })
}

const create = async () => {
  if (currentList.value.length === 0) {
    return uni.showToast({
      icon: 'none',
      title: '没有添加产品',
    })
  }
  await orderCO.create(userInfo.value?._id, currentList.value, note.value)
  uni.navigateBack({
    complete: () => {
      uni.showToast({
        icon: 'none',
        title: '结算成功',
      })
    },
  })
}
</script>

<template>
  <PageContainer background="#f6f6f6">
    <template #top>
      <NavBar title="下单" back />
    </template>
    <view v-if="userInfo" class="container">
      <UserInfo :userInfo="userInfo" />
      <view class="input">
        <MInput v-model:value="note" placeholder="备注" />
      </view>
      <view v-if="currentList.length" class="products">
        <view v-for="(item, index) in currentList" :key="item._id" class="item" @longpress="onRemoveProduct(index)">
          <view class="left">{{ item.name }}</view>
          <view class="right">¥{{ item.price / 100 }}</view>
        </view>
      </view>
      <view class="block">
        <MButton text="添加产品" :onClick="() => jump('pages/product/manage', { selectable: true })" />
      </view>
      <FixedBottom>
        <view class="opt">
          <view class="left">
            合计:
            <text class="price">¥{{ total / 100 }}</text>
          </view>
          <MButton :ui="false" radius="0" :onClick="create"><view class="right">结算</view></MButton>
        </view>
      </FixedBottom>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.container {
  .input {
    padding: 20rpx;
    margin-top: 20rpx;
    background: #fff;
  }

  .products {
    padding: 10rpx 0;
    margin-top: 20rpx;
    background: #fff;

    .item {
      flex-direction: row;
      padding: 20rpx;
      color: #333;
      font-size: 14px;

      .left {
        flex: 1;
        @include ellipsis(1);
      }
    }
  }

  .opt {
    height: 80rpx;
    flex-direction: row;

    .left {
      flex: 1;
      flex-direction: row;
      align-items: center;
      padding: 0 20rpx;
      color: #333;
      font-size: 12px;

      .price {
        margin-left: 10rpx;
        color: $color;
        font-size: 18px;
      }
    }

    .right {
      width: 200rpx;
      height: 100%;
      align-items: center;
      justify-content: center;
      background: $color;
      color: #fff;
      font-size: 14px;
    }
  }
}

.tips {
  flex: 1;
  align-items: center;
  justify-content: center;
  color: red;
  font-size: 14px;
}
</style>
