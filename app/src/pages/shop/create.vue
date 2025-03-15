<script setup lang="ts">
import { reactive } from 'vue'

import MButton from '@/components/MButton/MButton.vue'
import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'

const temp = uni.getStorageSync('temp')
const model = reactive<Dict>(temp || {})
uni.removeStorageSync('temp')

const db = uniCloud.database()

const chooseLocation = () => {
  uni.chooseLocation({
    success: (res) => {
      model.address = res.name
      model.location = new db.Geo.Point(res.longitude, res.latitude)
    },
  })
}

const del = (index: number) => {
  model.staff.splice(index, 1)
}

const add = async () => {
  uni.showModal({
    title: '请输入员工手机号码',
    editable: true,
    success: ({ confirm, content }) => {
      if (confirm) {
        if (model.staff?.includes(content)) {
          uni.showToast({
            icon: 'none',
            title: '该员工已存在',
          })
          return
        }
        model.staff = [...(model.staff || []), content]
      }
    },
  })
}

const save = async () => {
  const { _id, ...data } = model
  if (_id) {
    await db.collection('shop').doc(_id).update(data)
    uni.$emit('update-shop', { _id, ...data })
  } else {
    await db.collection('shop').add(data)
    uni.$emit('add-shop', data)
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
      <NavBar title="添加门店" back />
    </template>
    <view class="container">
      <view class="form">
        <u-form :label-width="140" :model="model">
          <u-form-item label="门店名称" prop="name">
            <MInput v-model:value="model.name" placeholder="请输入" />
          </u-form-item>
          <u-form-item label="门店地址" prop="address">
            <view @click="chooseLocation">
              <MInput v-model:value="model.address" placeholder="请选择" disabled textarea />
            </view>
          </u-form-item>
          <u-form-item label="门店电话" prop="mobile">
            <MInput v-model:value="model.mobile" placeholder="请输入" />
          </u-form-item>
          <u-form-item label="营业时间" prop="hours">
            <MInput v-model:value="model.hours" placeholder="请输入" />
          </u-form-item>
          <u-form-item label="员工账号">
            <view v-for="(item, index) in model.staff" :key="index" class="phone">
              <view>{{ item }}</view>
              <view @click="() => del(index)"><u-icon name="trash-fill" /></view>
            </view>
            <view class="add" @click="add">添加员工</view>
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
    .phone {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .add {
      padding: 16rpx 0;
      border-radius: 12rpx;
      border: 1px dashed $color;
      color: $color;
      font-size: 24rpx;
      line-height: 1;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
