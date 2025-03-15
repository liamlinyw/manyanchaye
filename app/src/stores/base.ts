import { defineStore } from 'pinia'
import { ref } from 'vue'

import manifest from '@/manifest.json'
import pages from '@/pages.json'
import qqmapsdk from '@/utils/map'

export const useBaseStore = defineStore('base', () => {
  const systemInfo = uni.getSystemInfoSync()

  let menuInfo: ReturnType<typeof uni.getMenuButtonBoundingClientRect> | undefined
  try {
    menuInfo = uni.getMenuButtonBoundingClientRect()
  } catch {}

  const locationInfo = ref<{
    latitude: number
    longitude: number
    address: string
  }>()
  const getLocation = () => {
    // locationInfo.value = {
    //   latitude: 25.448928,
    //   longitude: 119.010875,
    //   address: '福建省福州市',
    // }
    uni.getLocation({
      type: 'gcj02',
      success: ({ latitude, longitude }) => {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude,
          },
          success: (res: any) => {
            locationInfo.value = {
              latitude,
              longitude,
              address: res.result.formatted_addresses.recommend,
            }
          },
        })
      },
    })
  }

  const keyboardHeight = ref(0)
  uni.onKeyboardHeightChange(({ height }) => {
    keyboardHeight.value = height
  })
  return {
    systemInfo,
    menuInfo,
    locationInfo,
    getLocation,
    keyboardHeight: 0,
    homePath: pages.pages[0].path,
    tabBar: {
      ...pages.tabBar,
      list: pages.tabBar.list.map((item) => ({
        ...item,
        badge: 0,
      })),
    },
    versionName: manifest.versionName,
  }
})
