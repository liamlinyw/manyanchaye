<script setup lang="ts">
import { reactive } from 'vue'

import MButton from '@/components/MButton/MButton.vue'
import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'

const temp = uni.getStorageSync('temp')
if (temp) {
  Object.assign(temp, {
    packetPrice: temp.packetPrice / 100,
    boxPrice: temp.boxPrice / 100,
    cattyPrice: temp.cattyPrice / 100,
  })
}
const model = reactive<Dict>(temp || {})
uni.removeStorageSync('temp')

const db = uniCloud.database()

const save = async () => {
  const { _id, ...data } = model
  data.packetPrice = (data.packetPrice || 0) * 100
  data.boxPrice = (data.boxPrice || 0) * 100
  data.cattyPrice = (data.cattyPrice || 0) * 100
  data.sort = +data.sort || 0
  if (_id) {
    await db.collection('product').doc(_id).update(data)
    uni.$emit('update-product', { _id, ...data })
  } else {
    await db.collection('product').add(data)
    uni.$emit('add-product', data)
  }
  uni.navigateBack({
    complete: () => {
      uni.showToast({
        icon: 'none',
        title: '保存成功',
      })
    },
  })
}
</script>

<template>
  <PageContainer background="#f6f6f6">
    <template #top>
      <NavBar title="添加产品" back />
    </template>
    <view class="container">
      <view class="form">
        <u-form :label-width="240" :model="model">
          <u-form-item label="产品名称" prop="name">
            <MInput v-model:value="model.name" placeholder="请输入" />
          </u-form-item>
          <u-form-item label="产品价格(一泡)" prop="packetPrice">
            <MInput v-model:value="model.packetPrice" placeholder="请输入" type="number" />
          </u-form-item>
          <u-form-item label="产品价格(一盒)" prop="boxPrice">
            <MInput v-model:value="model.boxPrice" placeholder="请输入" type="number" />
          </u-form-item>
          <u-form-item label="产品价格(一斤)" prop="cattyPrice">
            <MInput v-model:value="model.cattyPrice" placeholder="请输入" type="number" />
          </u-form-item>
          <u-form-item label="排序" prop="cattyPrice">
            <MInput v-model:value="model.sort" placeholder="请输入" type="number" />
          </u-form-item>
        </u-form>
      </view>
      <view class="block">
        <MButton text="保存" :onClick="save" />
      </view>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.container {
  .form {
    padding: 0 40rpx;
    margin-top: 20rpx;
    background: #fff;
  }
}
</style>
