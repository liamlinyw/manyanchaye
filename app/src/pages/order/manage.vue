<script setup lang="ts">
import { ref } from 'vue'

import DbList from '@/components/DbList/DbList.vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import PageContainer from '@/components/PageContainer/PageContainer.vue'
import { useUserStore } from '@/stores/user'

import OrderItem from './components/OrderItem/index.vue'

const orderCO = uniCloud.importObject('order')

const user = useUserStore()

const props = defineProps<{
  all?: boolean
  uid?: string
  nickname?: string
}>()

const db = uniCloud.database()
const collections = [
  db
    .collection('order')
    .where(props.all ? undefined : props.uid ? `uid == '${props.uid}'` : 'staff._id == $cloudEnv_uid')
    .getTemp(),
  db.collection('uni-id-users').field('_id, nickname, mobile').getTemp(),
]

const dbListRef = ref<Dict>()
const revoke = (id: string) => {
  if (!user.userInfo?.admin) return
  uni.showModal({
    title: '是否确认撤销订单?',
    success: async (res) => {
      if (res.cancel) return
      await orderCO.revoke(id)
      dbListRef.value?.refresh()
    },
  })
}
</script>

<template>
  <PageContainer>
    <template #top>
      <NavBar :title="`${all ? '所有' : `${nickname || '我'}的`}订单`" back />
    </template>
    <DbList
      ref="dbListRef"
      :db="{
        collection: collections,
      }"
    >
      <template #default="{ item }">
        <OrderItem :item="item" @longpress="revoke(item._id)" manage />
      </template>
    </DbList>
  </PageContainer>
</template>

<style scoped lang="scss"></style>
