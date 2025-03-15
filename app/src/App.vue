<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const updateManager = uni.getUpdateManager()
updateManager.onUpdateReady(() => {
  uni.showModal({
    title: '更新提示',
    content: '新版本已准备就绪',
    showCancel: false,
    confirmText: '立即体验',
    success: (res) => {
      if (res.cancel) return
      updateManager.applyUpdate()
    },
  })
})

const user = useUserStore()
void user.getUserInfo()
</script>
<style lang="scss">
@import './uni_modules/vk-uview-ui/index';

view {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
}

image {
  width: auto;
  height: auto;
  vertical-align: middle;
}

.highlight {
  color: $color;
}

.hidden {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.nav-icon-btn {
  width: 100rpx;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 18px;
}

.block {
  align-items: center;
  margin-top: 20rpx;
}
</style>
