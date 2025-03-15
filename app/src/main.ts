import 'dayjs/locale/zh-cn'

import dayjs from 'dayjs'
import * as Pinia from 'pinia'
import { createSSRApp } from 'vue'

import uView from '@/uni_modules/vk-uview-ui'

import App from './App.vue'
dayjs.locale('zh-cn')

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.use(uView)
  return {
    app,
    Pinia,
  }
}
