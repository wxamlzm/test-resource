import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MotherOrderList from '@/views/MotherOrderList/motherOrderList.vue'
import ResourceManagement from '@/views/ResourceManagement/ResourceManagement.vue'
import ResourceManagementTest from '@/views/ResourceManagementTest/resourceManagementTest.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/motherorders',
    name: 'MotherOrders',
    component: MotherOrderList
  },
  {
    path: '/ResourceManagement',
    name: 'ResourceManagement',
    component: ResourceManagement
  },
  {
    path: '/ResourceManagementTest',
    name: 'ResourceManagementTest',
    component: ResourceManagementTest
  }
  // 其他路由
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
