// types/index.ts

// 基础母单接口
export interface BaseOrder {
  id: number | null
  title: string
  status: 'active' | 'inactive'
  submittedAt: string | null
  description?: string
}

// 母单接口
export interface MotherOrder extends BaseOrder {
  createdAt: string
  updatedAt: string
}

// 草稿接口
export interface Draft extends BaseOrder {
  lastSaved: string
  completion: number
}

// 分页接口
export interface Pagination {
  current: number
  pageSize: number
  total: number
}

// 表单校验规则
export const formRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  submittedAt: [
    { required: true, message: '请选择提交时间', trigger: 'change' }
  ]
}

// 表格列配置
export const orderColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', ellipsis: true },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '提交时间', dataIndex: 'submittedAt', width: 180 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '更新时间', dataIndex: 'updatedAt', width: 180 },
  { title: '操作', dataIndex: 'action', width: 180, fixed: 'right' }
]

export const draftColumns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', ellipsis: true },
  {
    title: '完成度',
    dataIndex: 'completion',
    width: 100,
    customRender: (text: any, record: Draft) =>
      `${(record.completion * 100).toFixed(0)}%`
  },
  { title: '最后保存时间', dataIndex: 'lastSaved', width: 180 },
  { title: '操作', dataIndex: 'action', width: 250, fixed: 'right' }
]
