<template>
  <a-layout>
    <a-layout-content :style="{ padding: '24px', background: '#fff' }">
      <a-card title="母单列表" :bordered="false">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-input-search
              v-model="searchQuery"
              placeholder="请输入关键词"
              enter-button
              @search="onSearch"
              style="width: 100%"
            />
          </a-col>
          <a-col :span="8" :style="{ textAlign: 'right' }">
            <a-button type="primary" @click="showAddModal">新增母单</a-button>
          </a-col>
        </a-row>

        <a-table
          :columns="columns"
          :data-source="filteredData"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space size="middle">
                <a-button type="link" @click="editRecord(record)"
                  >编辑</a-button
                >
                <a-popconfirm
                  title="确定要删除吗？"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="deleteRecord(record.id)"
                >
                  <a-button type="link">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>

        <!-- 新增/编辑模态框 -->
        <a-modal
          v-model:visible="addEditModalVisible"
          title="新增/编辑母单"
          @ok="handleAddEditOk"
          @cancel="handleAddEditCancel"
        >
          <a-form
            :model="form"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="标题">
              <a-input v-model:value="form.title" placeholder="请输入标题" />
            </a-form-item>
            <a-form-item label="状态">
              <a-select v-model:value="form.status" placeholder="请选择状态">
                <a-select-option value="active">激活</a-select-option>
                <a-select-option value="inactive">未激活</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="提交时间">
              <a-date-picker v-model:value="form.submittedAt" show-time />
            </a-form-item>
          </a-form>
        </a-modal>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import moment from 'moment'
import { ColumnsType, TableColumnType } from 'ant-design-vue/es/table/interface'

// 模拟数据
interface MotherOrder {
  id: number
  title: string
  status: string
  submittedAt: string | null
}

const data = ref<MotherOrder[]>([
  {
    id: 1,
    title: '母单1',
    status: 'active',
    submittedAt: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 2,
    title: '母单2',
    status: 'inactive',
    submittedAt: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
  }
  // 更多数据...
])

const searchQuery = ref<string>('')
const filteredData = computed(() => {
  return data.value.filter(item => item.title.includes(searchQuery.value))
})

const columns: ColumnsType<MotherOrder> = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt' },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' } as TableColumnType<MotherOrder>
  }
]

const addEditModalVisible = ref<boolean>(false)
const form = reactive<MotherOrder>({
  id: null,
  title: '',
  status: '',
  submittedAt: null
})

const onSearch = (value: string) => {
  searchQuery.value = value
}

const showAddModal = () => {
  form.id = null
  form.title = ''
  form.status = ''
  form.submittedAt = null
  addEditModalVisible.value = true
}

const editRecord = (record: MotherOrder) => {
  Object.assign(form, record)
  addEditModalVisible.value = true
}

const deleteRecord = (id: number) => {
  const index = data.value.findIndex(item => item.id === id)
  if (index !== -1) {
    data.value.splice(index, 1)
  }
}

const handleAddEditOk = () => {
  if (form.id) {
    // 更新现有记录
    const index = data.value.findIndex(item => item.id === form.id)
    if (index !== -1) {
      Object.assign(data.value[index], form)
    }
  } else {
    // 新增记录
    const newId = data.value.length
      ? data.value[data.value.length - 1].id + 1
      : 1
    data.value.push({ ...form, id: newId })
  }
  addEditModalVisible.value = false
}

const handleAddEditCancel = () => {
  addEditModalVisible.value = false
}
</script>

<style scoped>
/* 自定义样式 */
</style>
