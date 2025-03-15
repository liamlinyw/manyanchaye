<script setup lang="ts">
import { reactive } from 'vue'

import FixedBottom from '@/components/FixedBottom/FixedBottom.vue'
import MButton from '@/components/MButton/MButton.vue'
import MImage from '@/components/MImage/MImage.vue'
import MInput from '@/components/MInput/MInput.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import { useUserStore } from '@/stores/user'

const uniIdCo = uniCloud.importObject('uni-id-co')

const user = useUserStore()

const form = reactive(user.userInfo ?? {})

const onChangeAvatar = (e: Dict) => {
  form.avatar =
    'data:image/png;base64,' + (uni.getFileSystemManager().readFileSync(e.detail.avatarUrl, 'base64') as string)
}

const onChangeMobile = async (e: Dict) => {
  const code = e.detail.code
  if (code == null) return
  await uniIdCo.bindMobileByMpWeixin({
    code,
  })
  await user.getUserInfo()
  Object.assign(form, user.userInfo)
}

const save = async () => {
  await user.userDbDoc.update({
    avatar: form.avatar ?? '',
    nickname: form.nickname ?? '',
  })
  uni.showToast({
    icon: 'none',
    title: '保存成功',
  })
}

const logout = async () => {
  uni.showModal({
    title: '是否确定退出登录?',
    success: async ({ cancel }) => {
      if (cancel) return
      await user.logout()
      uni.navigateBack()
    },
  })
}
</script>

<template>
  <PageContainer background="#f6f6f6">
    <template #top>
      <NavBar title="个人资料" back />
    </template>
    <view class="container">
      <view class="header">
        <view class="avatar">
          <MImage :src="form.avatar || 'avatar.png'" />
          <button class="hidden" open-type="chooseAvatar" @chooseavatar="onChangeAvatar" />
        </view>
      </view>
      <view class="form">
        <u-form :model="form">
          <u-form-item label="昵称" prop="nickname">
            <MInput type="nickname" v-model:value="form.nickname" placeholder="请输入昵称" />
          </u-form-item>
          <u-form-item label="手机">
            <view :style="{ position: 'relative' }">
              {{ form.mobile }}
              <button class="hidden" open-type="getPhoneNumber" @getphonenumber="onChangeMobile" />
            </view>
          </u-form-item>
        </u-form>
      </view>
      <view class="block">
        <MButton text="保存" :onClick="save" />
      </view>
      <FixedBottom background="transparent">
        <view class="logout" @click="logout">退出登录</view>
      </FixedBottom>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.container {
  .header {
    height: 300rpx;
    align-items: center;
    justify-content: center;
    background: #fff;

    .avatar {
      position: relative;
      overflow: hidden;
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
    }
  }

  .form {
    padding: 0 40rpx;
    margin-top: 20rpx;
    background: #fff;
  }

  .logout {
    height: 60rpx;
    align-items: center;
    color: #999;
    font-size: 12px;
  }
}
</style>
