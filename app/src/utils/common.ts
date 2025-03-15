import { jump } from '@/utils/base'

export const jumpCreateOrder = async (mobile?: string) => {
  if (mobile == null) {
    mobile = await new Promise((resolve, reject) => {
      uni.showModal({
        title: '输入会员手机号码',
        editable: true,
        success: (e) => {
          if (e.cancel || !e.content) return reject()
          resolve(e.content)
        },
      })
    })
  }
  jump('pages/order/create', {
    mobile,
  })
}

export const jumpUserRecharge = async (mobile?: string) => {
  if (mobile == null) {
    mobile = await new Promise((resolve, reject) => {
      uni.showModal({
        title: '输入会员手机号码',
        editable: true,
        success: (e) => {
          if (e.cancel || !e.content) return reject()
          resolve(e.content)
        },
      })
    })
  }
  jump('pages/user/wallet', {
    mobile,
  })
}

export const requestSubscribeMessage = async () => {
  // return await new Promise<Dict>((resolve) => {
  //   uni.requestSubscribeMessage({
  //     tmplIds: ['yq5UoDGQb-BNNePGyQVs_spmv59lCXU0HESm98bshy4', 'ghuA0J0_CDtoRbZKzdw4z-akOwXP9FSl0psRCZs95j8'],
  //     success: (res) => {
  //       resolve(res)
  //     },
  //   })
  // })
  return {} as any
}
