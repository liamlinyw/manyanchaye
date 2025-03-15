/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare type Dict = Record<string, any>

declare module '@/uni_modules/*'

declare module '@/js_sdk/*'
