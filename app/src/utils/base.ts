import qs from 'querystringify'

import { useBaseStore } from '@/stores/base'

export const uuid = () => {
  let d = Date.now()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export const jump = (url?: string, query?: Dict, redirect = false) => {
  const base = useBaseStore()
  if (url == null) {
    url = base.homePath
  }
  if (query != null) {
    url += `?${qs.stringify(query)}`
  }
  if (base.tabBar.list.find((item) => item.pagePath === url)) {
    uni.switchTab({ url: `/${url}` })
  } else if (redirect) {
    uni.redirectTo({ url: `/${url}` })
  } else {
    uni.navigateTo({ url: `/${url}` })
  }
}

export const distance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const r1 = (lat1 * Math.PI) / 180.0
  const r2 = (lat2 * Math.PI) / 180.0
  const x = r1 - r2
  const y = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  const s =
    2 *
    Math.asin(Math.sqrt(Math.pow(Math.sin(x / 2), 2) + Math.cos(r1) * Math.cos(r2) * Math.pow(Math.sin(y / 2), 2))) *
    6378.137
  return Math.round(s * 10000) / 10000
}
