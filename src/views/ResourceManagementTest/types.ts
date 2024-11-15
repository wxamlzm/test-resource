// types.ts
import type { TableProps } from 'ant-design-vue'

// 定义资源通用接口
export interface Resource {
  id: string | number
  name: string
  type: string
  status: string
  createTime: string
  updateTime: string
  [key: string]: any
}

// 定义查询参数接口
export interface QueryParams {
  keyword?: string
  status?: string
  type?: string
  pageSize: number
  current: number
  [key: string]: any
}
