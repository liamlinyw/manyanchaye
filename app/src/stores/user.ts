import { defineStore } from 'pinia'
import { ref } from 'vue'

const uniIdCo = uniCloud.importObject('uni-id-co')
const userCO = uniCloud.importObject('user')
const db = uniCloud.database()
const userDbDoc = db.collection('uni-id-users').where('_id == $cloudEnv_uid')

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<Dict | undefined>(uni.getStorageSync('userInfo') || undefined)
  const setUserInfo = (data: Dict | undefined) => {
    console.log(data)
    userInfo.value = data
    uni.setStorageSync('userInfo', data)
  }
  const getUserInfo = async () => {
    try {
      const userInfo = await userDbDoc
        .field('nickname, avatar, mobile, balance, score, admin')
        .get({ getOne: true })
        .then(({ result }) => result.data)
      const shop = await db
        .collection('shop')
        .where(`mobile == '${userInfo.mobile}' || staff == '${userInfo.mobile}'`)
        .get({ getOne: true })
        .then(({ result }) => result.data)
      setUserInfo({
        ...userInfo,
        shop,
      })
    } catch {
      setUserInfo(undefined)
    }
  }
  const loginByWx = async (data: { phoneCode: string }) => {
    return await new Promise<void>((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: async ({ code }) => {
          await uniIdCo.loginByWeixinMobile({
            phoneCode: data.phoneCode,
          })
          const { isWeixinBound } = await uniIdCo.getAccountInfo()
          if (isWeixinBound) await uniIdCo.unbindWeixin()
          try {
            await uniIdCo.bindWeixin({ code })
            await getUserInfo()
            resolve()
          } catch {
            if (isWeixinBound) reject()
            await userCO.delEmptyUser()
            reject()
          }
        },
      })
    })
  }
  const logout = async () => {
    await uniIdCo.logout()
    uni.removeStorageSync('uni_id_token')
    uni.removeStorageSync('uni_id_token_expired')
    setUserInfo(undefined)
  }
  return {
    userDbDoc,
    userInfo,
    loginByWx,
    logout,
    getUserInfo,
    setUserInfo,
  }
})
