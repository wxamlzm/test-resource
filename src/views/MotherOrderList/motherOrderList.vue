<template>
  <a-layout>
    <a-layout-content :style="{ padding: '24px', background: '#fff' }">
      <a-tabs :active-key="activeTab" @change="onTabChange">
        <a-tab-pane key="1" tab="母单列表">
          <a-card title="母单列表" :bordered="false">
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
                <a-button
                  type="primary"
                  @click="showAddModal"
                  :loading="loading"
                >
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
              :data-source="filteredData"
              :pagination="pagination"
              :loading="loading"
              @change="handleTableChange"
              rowKey="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'status'">
                  <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                    {{ record.status === 'active' ? '激活' : '未激活' }}
                  </a-tag>
                </template>
                <template v-if="column.dataIndex === 'submittedAt'">
                  {{ formatDate(record.submittedAt) }}
                </template>
                <template v-if="column.dataIndex === 'action'">
                  <a-space size="middle">
                    <a-button
                      type="link"
                      size="small"
                      @click="viewDetails(record)"
                    >
                      查看
                    </a-button>
                    <a-button
                      type="link"
                      size="small"
                      @click="editRecord(record)"
                    >
                      编辑
                    </a-button>
                    <a-popconfirm
                      title="确定要删除这条母单吗？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="deleteRecord(record.id)"
                    >
                      <a-button type="link" size="small" danger>删除</a-button>
                    </a-popconfirm>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2" tab="草稿箱">
          <a-card title="草稿箱" :bordered="false">
            <a-table
              :columns="draftColumns"
              :data-source="filteredDrafts"
              :pagination="draftPagination"
              :loading="loading"
              @change="handleDraftTableChange"
              rowKey="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                  <a-space size="middle">
                    <a-button
                      type="link"
                      size="small"
                      @click="viewDraftDetails(record)"
                    >
                      查看
                    </a-button>
                    <a-button
                      type="link"
                      size="small"
                      @click="editDraft(record)"
                    >
                      编辑
                    </a-button>
                    <a-popconfirm
                      title="确定要删除这条草稿吗？"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="deleteDraft(record.id)"
                    >
                      <a-button type="link" size="small" danger>删除</a-button>
                    </a-popconfirm>
                    <a-button
                      type="link"
                      size="small"
                      @click="convertToOrder(record)"
                    >
                      转为正式申请
                    </a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>

      <!-- 新增/编辑模态框 -->
      <a-modal
        v-model:visible="addEditModalVisible"
        :title="form.id ? '编辑母单' : '新增母单'"
        @ok="handleAddEditOk"
        @cancel="handleAddEditCancel"
        :confirm-loading="submitting"
      >
        <a-form
          :model="form"
          :rules="rules"
          ref="formRef"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-form-item label="标题" name="title">
            <a-input
              v-model:value="form.title"
              placeholder="请输入标题"
              :maxLength="50"
              show-count
            />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="form.status" placeholder="请选择状态">
              <a-select-option value="active">激活</a-select-option>
              <a-select-option value="inactive">未激活</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="提交时间" name="submittedAt">
            <a-date-picker
              v-model:value="form.submittedAt"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="描述" name="description">
            <a-textarea
              v-model:value="form.description"
              placeholder="请输入描述信息"
              :rows="4"
              :maxLength="200"
              show-count
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

// 类型定义
interface MotherOrder {
  id: number | null
  title: string
  status: string
  submittedAt: string | null
  description?: string
}

interface Draft extends MotherOrder {
  lastSaved: string
  completion: number
}

interface Pagination {
  current: number
  pageSize: number
  total: number
}

// 状态定义
const searchQuery = ref('')
const statusFilter = ref('')
const loading = ref(false)
const searching = ref(false)
const submitting = ref(false)
const addEditModalVisible = ref(false)
const formRef = ref<FormInstance>()
const activeTab = ref('1') // 默认选中的标签页

// 分页配置
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0
})

// 草稿相关的状态
const drafts = ref<Draft[]>([])
const draftPagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  submittedAt: [
    { required: true, message: '请选择提交时间', trigger: 'change' }
  ]
}

// 表单数据
const form = reactive<MotherOrder>({
  id: null,
  title: '',
  status: '',
  submittedAt: null,
  description: ''
})

// 模拟数据
const data = ref<MotherOrder[]>([
  {
    id: 1,
    title: '母单1',
    status: 'active',
    submittedAt: new Date().toISOString(),
    description: '这是一个测试母单'
  },
  {
    id: 2,
    title: '母单2',
    status: 'inactive',
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    description: '这是另一个测试母单'
  }
])

// 表格列定义
const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', ellipsis: true },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '提交时间', dataIndex: 'submittedAt', width: 180 },
  { title: '操作', dataIndex: 'action', width: 180, fixed: 'right' }
]

// 草稿表格列定义
const draftColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', ellipsis: true },
  {
    title: '完成度',
    dataIndex: 'completion',
    width: 100,
    customRender: (text, record) => `${(record.completion * 100).toFixed(0)}%`
  },
  { title: '最后保存时间', dataIndex: 'lastSaved', width: 180 },
  { title: '操作', dataIndex: 'action', width: 250, fixed: 'right' }
]

// 计算过滤后的数据
const filteredData = computed(() => {
  return data.value
    .filter(item =>
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .filter(item => !statusFilter.value || item.status === statusFilter.value)
})

// 计算过滤后的草稿数据
const filteredDrafts = computed(() => {
  return drafts.value
})

// 方法定义
const formatDate = (date: string | null) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const onSearch = async (value: string) => {
  searching.value = true
  try {
    // 这里可以调用实际的搜索API
    await new Promise(resolve => setTimeout(resolve, 500))
    searchQuery.value = value
  } finally {
    searching.value = false
  }
}

const onStatusFilterChange = (value: string) => {
  statusFilter.value = value
  pagination.current = 1
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  // 这里可以调用获取数据的方法
}

const showAddModal = () => {
  Object.assign(form, {
    id: null,
    title: '',
    status: '',
    submittedAt: null,
    description: ''
  })
  addEditModalVisible.value = true
}

const viewDetails = (record: MotherOrder) => {
  // 实现查看详情逻辑
  message.info(`查看母单: ${record.title}`)
}

const editRecord = (record: MotherOrder) => {
  Object.assign(form, record)
  addEditModalVisible.value = true
}

const deleteRecord = async (id: number) => {
  loading.value = true
  try {
    // 这里可以调用删除API
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = data.value.findIndex(item => item.id === id)
    if (index !== -1) {
      data.value.splice(index, 1)
      message.success('删除成功')
    }
  } catch (error) {
    message.error('删除失败')
  } finally {
    loading.value = false
  }
}

const handleAddEditOk = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    // 这里可以调用保存API
    await new Promise(resolve => setTimeout(resolve, 500))

    if (form.id) {
      const index = data.value.findIndex(item => item.id === form.id)
      if (index !== -1) {
        Object.assign(data.value[index], form)
      }
      message.success('更新成功')
    } else {
      const newId = Math.max(...data.value.map(item => item.id || 0)) + 1
      data.value.push({ ...form, id: newId })
      message.success('创建成功')
    }
    addEditModalVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleAddEditCancel = () => {
  formRef.value?.resetFields()
  addEditModalVisible.value = false
}

// 草稿相关的函数
const onTabChange = (key: string) => {
  activeTab.value = key
  if (key === '2') {
    draftPagination.current = 1
    // 可以在这里加载草稿数据
  }
}

const handleDraftTableChange = (pag: any) => {
  draftPagination.current = pag.current
  draftPagination.pageSize = pag.pageSize
  // 这里可以调用获取草稿数据的方法
}

const viewDraftDetails = (record: Draft) => {
  // 实现查看草稿详情逻辑
  message.info(`查看草稿: ${record.title}`)
}

const editDraft = (record: Draft) => {
  Object.assign(form, record)
  addEditModalVisible.value = true
}

const deleteDraft = async (id: number) => {
  loading.value = true
  try {
    // 这里可以调用删除草稿API
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = drafts.value.findIndex(item => item.id === id)
    if (index !== -1) {
      drafts.value.splice(index, 1)
      message.success('删除成功')
    }
  } catch (error) {
    message.error('删除失败')
  } finally {
    loading.value = false
  }
}

const convertToOrder = (record: Draft) => {
  // 将草稿转为正式申请的逻辑
  message.info(`将草稿转为正式申请: ${record.title}`)
}

// 自动保存草稿
let saveTimeout: ReturnType<typeof setTimeout> | undefined
const autoSaveDraft = (draft: Draft) => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    // 更新草稿列表中的草稿数据
    const index = drafts.value.findIndex(d => d.id === draft.id)
    if (index !== -1) {
      drafts.value[index] = { ...draft, lastSaved: new Date().toISOString() }
    }
    message.info('草稿已自动保存')
  }, 3000) // 3秒后保存
}

// 监听表单变化，触发自动保存
watch(
  form,
  (newForm, oldForm) => {
    if (JSON.stringify(newForm) !== JSON.stringify(oldForm)) {
      const draft: Draft = {
        ...newForm,
        lastSaved: '',
        completion: 0.5,
        id: form.id || null
      }
      autoSaveDraft(draft)
    }
  },
  { deep: true }
)

// 生命周期钩子
onMounted(async () => {
  loading.value = true
  try {
    // 这里可以调用获取数据的API
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 设置分页总数
    pagination.total = data.value.length
    draftPagination.total = drafts.value.length
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
