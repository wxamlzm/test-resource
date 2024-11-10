import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MotherOrderList from '@/views/MotherOrderList/motherOrderList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/mother-orders',
    name: 'MotherOrders',
    component: MotherOrderList
  }
  // 其他路由
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
