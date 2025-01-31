<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import {
  Table,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Card,
  Space,
  Tag
} from 'ant-design-vue'
import type { Resource, QueryParams } from './types.ts'
import type {
  TableColumnType,
  TableProps,
  TablePaginationConfig
} from 'ant-design-vue'
import { h } from 'vue'
// 表单实例引用
const formRef = ref()
// 编辑表单实例引用
const editFormRef = ref()

// 查询参数状态
const queryParams = reactive<QueryParams>({
  keyword: '',
  status: undefined,
  type: undefined,
  pageSize: 10,
  current: 1
})

// 表格数据状态
const tableData = ref<Resource[]>([])
const loading = ref(false)
const total = ref(0)

// 弹窗控制状态
const modalVisible = ref(false)
const modalTitle = ref('')
const modalLoading = ref(false)

// 当前编辑的资源
const currentResource = ref<Partial<Resource>>({})

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

// 表格列定义
const columns: TableColumnType<Resource>[] = [
  {
    title: '编号',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center',
    customRender: ({ index }) => `${index + 1}`
  },
  {
    title: '资源名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '资源类型',
    dataIndex: 'type',
    key: 'type',
    customRender: ({ text }) => {
      return h(Tag, { color: 'blue' }, () => String(text).toUpperCase())
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => {
      return h(Tag, { color: text === 'normal' ? 'success' : 'error' }, () =>
        text === 'normal' ? '正常' : '禁用'
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    customRender: ({ record }) => {
      return h(Space, null, () => [
        h(
          Button,
          {
            type: 'link',
            onClick: () => handleEdit(record)
          },
          () => '编辑'
        ),
        h(
          Button,
          {
            type: 'link',
            danger: true,
            onClick: () => handleDelete(record)
          },
          () => '删除'
        )
      ])
    }
  }
]

// 查询列表数据
const fetchList = async () => {
  try {
    loading.value = true
    // TODO: 替换为实际的API调用
    // const res = await fetch('/api/resources', {
    //   method: 'POST',
    //   body: JSON.stringify(queryParams)
    // })
    // const data = await res.json()

    tableData.value = [
      {
        name: '资源1',
        type: '类型1',
        status: 0,
        createTime: '2024-11-11',
        updateTime: '2024-1-1'
      },
      {
        name: '资源1',
        type: '类型1',
        status: 1,
        createTime: '2024-11-11',
        updateTime: '2024-1-1'
      }
    ]
    // total.value = data.total
  } catch (error) {
    message.error('获取列表失败')
    console.error('获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 重置查询表单
const handleReset = () => {
  formRef.value?.resetFields()
  queryParams.current = 1
  fetchList()
}

// 查询按钮点击
const handleQuery = () => {
  queryParams.current = 1
  fetchList()
}

// 表格翻页
const handleTableChange: TableProps<any>['onChange'] = (
  pagination: TablePaginationConfig
) => {
  queryParams.current = pagination.current || 1
  queryParams.pageSize = pagination.pageSize || 10
  fetchList()
}

// 新建资源
const handleAdd = () => {
  modalTitle.value = '新建资源'
  currentResource.value = {}
  modalVisible.value = true
}

// 编辑资源
const handleEdit = (record: Resource) => {
  modalTitle.value = '编辑资源'
  currentResource.value = { ...record }
  modalVisible.value = true
}

// 删除资源
const handleDelete = async (record: Resource) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除资源 "${record.name}" 吗？`,
    async onOk() {
      try {
        // TODO: 替换为实际的API调用
        await fetch(`/api/resources/${record.id}`, {
          method: 'DELETE'
        })
        message.success('删除成功')
        fetchList()
      } catch (error) {
        message.error('删除失败')
        console.error('删除失败:', error)
      }
    }
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    await editFormRef.value?.validateFields()
    modalLoading.value = true

    // TODO: 替换为实际的API调用
    const url = currentResource.value.id
      ? `/api/resources/${currentResource.value.id}`
      : '/api/resources'
    const method = currentResource.value.id ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      body: JSON.stringify(currentResource.value)
    })

    message.success(`${modalTitle.value}成功`)
    modalVisible.value = false
    fetchList()
  } catch (error) {
    message.error(`${modalTitle.value}失败`)
    console.error(`${modalTitle.value}失败:`, error)
  } finally {
    modalLoading.value = false
  }
}

// 弹窗取消
const handleCancel = () => {
  modalVisible.value = false
  editFormRef.value?.resetFields()
}

// 监听查询参数变化
watch(
  () => queryParams.type,
  () => {
    handleQuery()
  }
)

// 组件挂载时获取列表数据
onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="resource-management">
    <!-- 查询表单 -->
    <Card class="mb-4">
      <Form
        ref="formRef"
        :model="queryParams"
        layout="inline"
        class="search-form"
      >
        <Form.Item name="keyword" label="关键词">
          <Input
            v-model:value="queryParams.keyword"
            placeholder="请输入资源名称"
            allow-clear
          />
        </Form.Item>

        <Form.Item name="type" label="资源类型">
          <Select
            v-model:value="queryParams.type"
            placeholder="请选择资源类型"
            allow-clear
            style="width: 200px"
          >
            <Select.Option
              v-for="item in resourceTypes"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select
            v-model:value="queryParams.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 200px"
          >
            <Select.Option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" @click="handleQuery">查询</Button>
            <Button @click="handleReset">重置</Button>
            <Button type="primary" @click="handleAdd">新建</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>

    <!-- 数据表格 -->
    <Card>
      <Table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="{
          total,
          current: queryParams.current,
          pageSize: queryParams.pageSize,
          showSizeChanger: true,
          showQuickJumper: true
        }"
        row-key="id"
        @change="handleTableChange"
      />
    </Card>

    <!-- 编辑弹窗 -->
    <Modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <Form ref="editFormRef" :model="currentResource" layout="vertical">
        <Form.Item
          name="name"
          label="资源名称"
          :rules="[{ required: true, message: '请输入资源名称' }]"
        >
          <Input
            v-model:value="currentResource.name"
            placeholder="请输入资源名称"
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="资源类型"
          :rules="[{ required: true, message: '请选择资源类型' }]"
        >
          <Select
            v-model:value="currentResource.type"
            placeholder="请选择资源类型"
          >
            <Select.Option
              v-for="item in resourceTypes"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          :rules="[{ required: true, message: '请选择状态' }]"
        >
          <Select
            v-model:value="currentResource.status"
            placeholder="请选择状态"
          >
            <Select.Option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
.resource-management {
  padding: 24px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
