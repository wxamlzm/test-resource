// components/OrderList.vue
<template>
  <div class="order-list">
    <!-- 搜索和操作区域 -->
    <a-row :gutter="16" class="mb-4">
      <a-col :span="16">
        <a-space>
          <a-input-search
            v-model:value="searchQuery"
            placeholder="请输入关键词搜索"
            enter-button
            @search="onSearch"
            :loading="searching"
            style="width: 300px"
          />
          <a-select
            v-model:value="statusFilter"
            placeholder="状态筛选"
            style="width: 120px"
            @change="onStatusFilterChange"
          >
            <a-select-option value="">全部状态</a-select-option>
            <a-select-option value="active">激活</a-select-option>
            <a-select-option value="inactive">未激活</a-select-option>
          </a-select>
        </a-space>
      </a-col>
      <a-col :span="8" :style="{ textAlign: 'right' }">
        <a-button type="primary" @click="$emit('add')" :loading="loading">
          <template #icon>
            <plus-outlined />
          </template>
          新增母单
        </a-button>
      </a-col>
    </a-row>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <!-- 状态列自定义渲染 -->
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '激活' : '未激活' }}
          </a-tag>
        </template>
        <!-- 操作列自定义渲染 -->
        <template v-if="column.dataIndex === 'action'">
          <a-space size="middle">
            <a-button type="link" size="small" @click="$emit('view', record)">
              查看
            </a-button>
            <a-button type="link" size="small" @click="$emit('edit', record)">
              编辑
            </a-button>
            <a-popconfirm
              title="确定要删除这条记录吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="$emit('delete', record)"
            >
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableProps } from 'ant-design-vue'
import type { MotherOrder, Pagination } from '../types'
import { orderColumns } from '../types'

// 定义组件属性
interface Props {
  data: MotherOrder[]
  loading?: boolean
  pagination: Pagination
}

// 定义组件事件
interface Emits {
  (e: 'add'): void
  (e: 'edit', record: MotherOrder): void
  (e: 'view', record: MotherOrder): void
  (e: 'delete', record: MotherOrder): void
  (e: 'search', value: string): void
  (e: 'filter', value: string): void
  (e: 'page-change', page: number, pageSize: number): void
}

// 组件属性默认值
const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 定义组件事件
const emit = defineEmits<Emits>()

// 响应式状态
const searchQuery = ref('')
const statusFilter = ref('')
const searching = ref(false)
const columns = ref(orderColumns)

// 搜索处理函数
const onSearch = async (value: string) => {
  searching.value = true
  try {
    emit('search', value)
  } finally {
    searching.value = false
  }
}

// 状态筛选处理函数
const onStatusFilterChange = (value: string) => {
  emit('filter', value)
}

// 表格变化处理函数(排序、筛选、分页)
const handleTableChange: TableProps['onChange'] = (
  pagination,
  filters,
  sorter
) => {
  emit('page-change', pagination.current || 1, pagination.pageSize || 10)
}

// 生命周期钩子
onMounted(() => {
  // 组件挂载时的初始化逻辑
  console.log('OrderList component mounted')
})
</script>

<style scoped>
.order-list {
  padding: 24px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
