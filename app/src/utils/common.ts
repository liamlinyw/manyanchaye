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
  return await new Promise<Dict>((resolve) => {
    uni.requestSubscribeMessage({
      tmplIds: ['-NYdGqaBc4sFVBI2YbDXtTrI6sBeP4ycloZcurKa2z0', 'NOxtTxW9OE0XcL1yHThJeqU7W8-VSmWB7FS-8sZ0By8'],
      success: (res) => {
        console.log(res)
        resolve(res)
      },
      fail: (err) => {
        console.log(err)
      },
    })
  })
}
