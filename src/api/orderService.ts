// api/orderService.ts

import type { MotherOrder, Draft } from '../types'

// API 基础配置
const BASE_URL = '/api'
const headers = {
  'Content-Type': 'application/json'
}

// API 错误处理
class ApiError extends Error {
  constructor (public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// 统一处理响应
async function handleResponse<T> (response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText)
  }
  return response.json()
}

// 母单相关API
export const orderApi = {
  // 获取母单列表
  async getOrders (params: {
    page: number
    pageSize: number
    search?: string
    status?: string
  }): Promise<{ data: MotherOrder[]; total: number }> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status })
    })

    const response = await fetch(`${BASE_URL}/orders?${queryParams}`)
    return handleResponse(response)
  },

  // 创建母单
  async createOrder (order: Omit<MotherOrder, 'id'>): Promise<MotherOrder> {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(order)
    })
    return handleResponse(response)
  },

  // 更新母单
  async updateOrder (
    id: number,
    order: Partial<MotherOrder>
  ): Promise<MotherOrder> {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(order)
    })
    return handleResponse(response)
  },

  // 删除母单
  async deleteOrder (id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  }
}

// 草稿相关API
export const draftApi = {
  // 获取草稿列表
  async getDrafts (params: {
    page: number
    pageSize: number
  }): Promise<{ data: Draft[]; total: number }> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString()
    })

    const response = await fetch(`${BASE_URL}/drafts?${queryParams}`)
    return handleResponse(response)
  },

  // 保存草稿
  async saveDraft (draft: Draft): Promise<Draft> {
    const response = await fetch(`${BASE_URL}/drafts`, {
      method: draft.id ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(draft)
    })
    return handleResponse(response)
  },

  // 删除草稿
  async deleteDraft (id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/drafts/${id}`, {
      method: 'DELETE',
      headers
    })
    return handleResponse(response)
  },

  // 将草稿转换为正式母单
  async convertToOrder (id: number): Promise<MotherOrder> {
    const response = await fetch(`${BASE_URL}/drafts/${id}/convert`, {
      method: 'POST',
      headers
    })
    return handleResponse(response)
  }
}
