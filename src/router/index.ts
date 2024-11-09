import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import MotherOrderList from '../components/MotherOrderList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
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
