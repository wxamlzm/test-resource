<template>
  <div class="resource-management">
    <!-- 查询表单 -->
    <a-card class="mb-4">
      <div class="query-container">
        <!-- 查询表单 -->
        <a-form
          :model="queryParams"
          ref="formRef"
          layout="inline"
          class="search-form"
        >
          <a-form-item name="keyword" label="关键词">
            <a-input
              v-model:value="queryParams.keyword"
              placeholder="请输入资源名称"
              allow-clear
            />
          </a-form-item>

          <a-form-item name="type" label="资源类型">
            <a-select
              v-model:value="queryParams.type"
              placeholder="请选择资源类型"
              allow-clear
              style="width: 200px"
            >
              <a-select-option
                v-for="item in resourceTypes"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item name="status" label="状态">
            <a-select
              v-model:value="queryParams.status"
              placeholder="请选择状态"
              allow-clear
              style="width: 200px"
            >
              <a-select-option
                v-for="item in statusOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleQuery">查询</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>

        <!-- 功能按钮容器 -->
        <div class="function-buttons">
          <a-button type="primary">功能1</a-button>
          <!-- 如果有更多功能按钮，可以继续添加 -->
        </div>
      </div>
    </a-card>

    <!-- 数据表单 -->
    <a-card>
      <a-table></a-table>
    </a-card>

    <modalTest v-model:isVisible="modalValue" :title="modalTitle" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { QueryParams, Resource } from './types'
import modalTest from './modal/modalTest.vue'
import { message } from 'ant-design-vue'

const modalValue = ref(true)
const modalTitle = ref('test')

// 表单实例引用
const formRef = ref()

const tableData = ref<Resource[]>([])
const loading = ref(false)
const total = ref(0)

// 资源类型选项
const resourceTypes = [
  { label: 'GitLab', value: 'gitlab' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'RADIUS', value: 'radius' }
]

// 状态选项
const statusOptions = [
  { label: '正常', value: 'normal' },
  { label: '禁用', value: 'disabled' }
]

// 查询参数状态
const queryParams = reactive<QueryParams>({
  keyword: '',
  status: undefined,
  type: undefined,
  pageSize: 10,
  current: 1
})

// 查询列表数据
const fetchList = async () => {
  try {
    loading.value = true
    // 请求
    const res = await fetch('/api/resources', {
      method: 'POST',
      body: JSON.stringify(queryParams)
    })
    // const {data} = await getResourceList(queryParams)
    const data = await res.json()
    tableData.value = data.list
    total.value = data.total
  } catch (error) {
    message.error('获取列表失败')
    console.error('获取列表失败：', error)
  } finally {
    loading.value = false
  }
}

// 查询按钮点击
const handleQuery = () => {
  queryParams.current = 1
  fetchList()
}
// 重置查询表单
const handleReset = () => {
  formRef.value?.resetFields()
  queryParams.current = 1
  fetchList()
}
</script>

<style>
.function-buttons {
  display: flex;
  justify-content: flex-end; /* 右对齐 */
  flex-wrap: wrap; /* 允许按钮换行 */
  gap: 8px; /* 为按钮之间添加间距 */
  margin-top: 16px; /* 与查询表单之间添加间距 */
  width: 100%; /* 使功能按钮容器与查询表单宽度一致 */
}
</style>
